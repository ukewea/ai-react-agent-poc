#!/usr/bin/env python3
"""ReAct Agent Demo — Team Meeting Scheduler.

Uses Claude with native tool use to find an optimal meeting time
for teams in New York and London, checking timezones and holidays.
"""

import argparse
import json
import os
import sys

import anthropic
import httpx
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ────────────────────────────────────────────────────────────

MODEL = "claude-sonnet-4-6"
MAX_ITERATIONS = 10
HTTP_TIMEOUT = 10

# Sonnet 4.6 pricing (USD per million tokens)
PRICE_INPUT_PER_MTOK = 3
PRICE_OUTPUT_PER_MTOK = 15

# ── ANSI Colors (matching slide theme) ───────────────────────────────────────

BLUE = "\033[38;2;79;156;249m"     # Thought
ORANGE = "\033[38;2;249;115;22m"   # Action
GREEN = "\033[38;2;34;197;94m"     # Observation
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

# ── Tool Definitions ────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "get_timezone_info",
        "description": (
            "Get the current local time and UTC offset for a given IANA timezone. "
            "Returns the current datetime, UTC offset, whether DST is active, "
            "and the timezone abbreviation."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "IANA timezone identifier, e.g. 'America/New_York' or 'Europe/London'.",
                },
            },
            "required": ["timezone"],
        },
    },
    {
        "name": "get_public_holidays",
        "description": (
            "Get the list of public holidays for a given country and year. "
            "Returns holiday dates and names. Use ISO 3166-1 alpha-2 country codes."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "country_code": {
                    "type": "string",
                    "description": "ISO 3166-1 alpha-2 country code, e.g. 'US', 'GB'.",
                },
                "year": {
                    "type": "integer",
                    "description": "The year to get holidays for, e.g. 2026.",
                },
            },
            "required": ["country_code", "year"],
        },
    },
]

# ── Tool Execution ───────────────────────────────────────────────────────────


def call_get_timezone_info(timezone: str) -> dict:
    """Fetch current time info from TimeAPI.io."""
    url = f"https://timeapi.io/api/time/current/zone?timeZone={timezone}"
    resp = httpx.get(url, timeout=HTTP_TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    return {
        "timezone": timezone,
        "datetime": data.get("dateTime"),
        "date": data.get("date"),
        "time": data.get("time"),
        "utc_offset": data.get("timeZone"),
        "dst_active": data.get("dstActive"),
        "day_of_week": data.get("dayOfWeek"),
    }


def call_get_public_holidays(country_code: str, year: int) -> list:
    """Fetch public holidays from Nager.Date API."""
    url = f"https://date.nager.at/api/v3/PublicHolidays/{year}/{country_code}"
    resp = httpx.get(url, timeout=HTTP_TIMEOUT)
    resp.raise_for_status()
    holidays = resp.json()
    return [
        {"date": h["date"], "name": h["localName"]}
        for h in holidays
    ]


def execute_tool(name: str, input_data: dict) -> str:
    """Dispatch a tool call and return the result as a JSON string."""
    try:
        if name == "get_timezone_info":
            result = call_get_timezone_info(input_data["timezone"])
        elif name == "get_public_holidays":
            result = call_get_public_holidays(input_data["country_code"], input_data["year"])
        else:
            result = {"error": f"Unknown tool: {name}"}
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Display Helpers ──────────────────────────────────────────────────────────


def print_thought(text: str) -> None:
    print(f"\n{BLUE}{BOLD}💭 Thought:{RESET}")
    print(f"{BLUE}{text}{RESET}")


def print_action(name: str, input_data: dict) -> None:
    args = ", ".join(f"{k}={v!r}" for k, v in input_data.items())
    print(f"\n{ORANGE}{BOLD}⚡ Action:{RESET} {ORANGE}{name}({args}){RESET}")


def print_observation(text: str) -> None:
    # Truncate long observations for readability
    lines = text.split("\n")
    if len(lines) > 20:
        text = "\n".join(lines[:18]) + f"\n  ... ({len(lines) - 18} more lines)"
    print(f"\n{GREEN}{BOLD}👁 Observation:{RESET}")
    print(f"{GREEN}{text}{RESET}")


def print_final(text: str) -> None:
    print(f"\n{'─' * 60}")
    print(f"{BOLD}✅ Final Answer:{RESET}")
    print(text)
    print(f"{'─' * 60}")


# ── System Prompt ────────────────────────────────────────────────────────────

SYSTEM = """\
You are a scheduling assistant that helps find optimal meeting times across timezones.

When given a scheduling request:
1. Think step-by-step about what information you need.
2. Use the available tools to gather real-time timezone data and holiday information.
3. Analyze the data to find the best meeting slot.
4. Provide a clear, specific recommendation.

Always check both timezone offsets and public holidays before recommending a time.\
"""

# ── Agent Loop ───────────────────────────────────────────────────────────────


def calc_cost(input_tokens: int, output_tokens: int) -> float:
    return (input_tokens * PRICE_INPUT_PER_MTOK + output_tokens * PRICE_OUTPUT_PER_MTOK) / 1_000_000


def run_agent(user_prompt: str, *, record: bool = False) -> None:
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": user_prompt}]
    recording_steps = []
    cumulative_cost = 0.0

    print(f"{DIM}Model: {MODEL}{RESET}")
    print(f"{DIM}Prompt: {user_prompt}{RESET}")

    for iteration in range(1, MAX_ITERATIONS + 1):
        print(f"\n{DIM}{'─' * 40} Step {iteration} {'─' * 40}{RESET}")

        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=SYSTEM,
            tools=TOOLS,
            messages=messages,
        )

        # Track token usage
        usage = response.usage
        in_tok = usage.input_tokens
        out_tok = usage.output_tokens
        step_cost = calc_cost(in_tok, out_tok)
        cumulative_cost += step_cost
        print(f"{DIM}  tokens: in={in_tok} out={out_tok}  cost=${step_cost:.5f}  cumulative=${cumulative_cost:.5f}{RESET}")

        # Process response content blocks
        tool_uses = []
        step_blocks = []
        for block in response.content:
            if block.type == "text":
                print_thought(block.text)
                step_blocks.append({"type": "thought", "text": block.text})
            elif block.type == "tool_use":
                print_action(block.name, block.input)
                args_str = ", ".join(f"{k}={v!r}" for k, v in block.input.items())
                step_blocks.append({"type": "action", "tool": block.name, "args": args_str})
                result_str = execute_tool(block.name, block.input)
                print_observation(result_str)
                step_blocks.append({"type": "observation", "text": result_str})
                tool_uses.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result_str,
                })

        if record:
            recording_steps.append({
                "step": iteration,
                "blocks": step_blocks,
                "usage": {"input_tokens": in_tok, "output_tokens": out_tok},
                "cost_usd": round(step_cost, 6),
                "cumulative_cost_usd": round(cumulative_cost, 6),
            })

        # Append assistant message
        messages.append({"role": "assistant", "content": response.content})

        # Check if we're done
        if response.stop_reason == "end_turn":
            final_text = "\n".join(
                block.text for block in response.content if block.type == "text"
            )
            print_final(final_text)

            if record:
                total_in = sum(s["usage"]["input_tokens"] for s in recording_steps)
                total_out = sum(s["usage"]["output_tokens"] for s in recording_steps)
                recording = {
                    "model": MODEL,
                    "pricing": {"input_per_mtok": PRICE_INPUT_PER_MTOK, "output_per_mtok": PRICE_OUTPUT_PER_MTOK},
                    "steps": recording_steps,
                    "total": {
                        "input_tokens": total_in,
                        "output_tokens": total_out,
                        "total_cost_usd": round(cumulative_cost, 6),
                        "api_calls": len(recording_steps),
                    },
                }
                out_path = os.path.join(os.path.dirname(__file__) or ".", "demo-recording.json")
                with open(out_path, "w") as f:
                    json.dump(recording, f, indent=2)
                print(f"\n{DIM}Recording saved to {out_path}{RESET}")
            return

        # Feed tool results back
        if tool_uses:
            messages.append({"role": "user", "content": tool_uses})

    print(f"\n{BOLD}⚠️  Reached max iterations ({MAX_ITERATIONS}){RESET}")


# ── Entry Point ──────────────────────────────────────────────────────────────

USER_PROMPT = (
    "We need to find a good time next week for a joint meeting with our "
    "New York and London teams. Please check both timezones and any "
    "upcoming holidays, then recommend the best day and time."
)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ReAct Agent Demo — Team Meeting Scheduler")
    parser.add_argument("prompt", nargs="*", default=None, help="User prompt (default: built-in scheduling question)")
    parser.add_argument("--record", action="store_true", help="Save a demo-recording.json with step data for the slide deck")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    prompt = " ".join(args.prompt) if args.prompt else USER_PROMPT
    run_agent(prompt, record=args.record)
