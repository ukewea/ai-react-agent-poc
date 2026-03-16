# From LLM to Agent — Speaker Script v8

Incorporates insights from "You Don't Know AI Agents" by Tw93, reconciled from a 4-way expert debate, then refined by a 3-way review (tech expert, presentation expert, audience representative).

Key refinements from review:
- Closing reordered: "Words describe. Agents do." is now the EXIT LINE
- Slide 3: No longer repeats "Fluent text is not execution" aloud; REST API bridge moved here
- Slide 4: Grouped walkthrough pacing (~1:30 not 2:00); structured-tool-calls caveat cut
- Slide 5: Workflow-vs-agent one-liner now spoken, not just visual
- Slide 6: Step 3 narration condensed; "harness" softened to "runtime"
- Slide 8: Context window mention added
- Slide 9: CTA made concrete (clone repo, domain examples); article ref generalized

Rules:
- Click after the setup sentence, not during it.
- If the reveal is the punchline, click, pause for half a beat, then say the punchline.
- In the prerecorded demo, every loop step is two clicks: `Thought`, then `Tool + Feedback`.
- After the final answer appears, stop clicking for a full beat and let it sit.
- The demo's self-correction step (Step 2) is the STAR moment of the talk. Build tension before it, then let it land.

---

## Slide 1 — Title

Target: 0:00 – 0:25

Say:

Today I want to leave you with one mental model.

A standalone LLM produces text.
An agent is a loop that can use tools, observe results, and decide what to do next.

That distinction is the whole talk.

Advance after:
"That distinction is the whole talk."

---

## Slide 2 — Cold Open

Target: 0:25 – 1:30

On entry:
Let the screenshot breathe for one beat.

Say:

I want to start with this screenshot.

It is funny because the language sounds completely convincing.
The assistant sounds like it started recording, kept track of the state, and then stopped at the end.

But nothing outside the chat changed.

It knew the script of recording.
It had no handle to the recorder.

It could describe the job.
It could not do the job.

Fluent text is not execution.

That is the gap I want to make concrete today.

Advance after:
"That is the gap I want to make concrete today."

---

## Slide 3 — What Was Missing?

Target: 1:30 – 2:15

On entry:
Do not repeat "Fluent text is not execution" aloud — it is on the slide and was just said on Slide 2. Let the visual carry it.

Say:

On the left, the model can say:
"I am recording."

But saying it is not doing it.

`[CLICK 1]` after:
"But saying it is not doing it."

Reveal:
the tool-enabled system on the right.

Say:

Now we have the missing path into the environment.

If you have ever written a service method that calls an external API and returns structured data, you have already written something a tool looks like. That is all these are.

The model can call something real,
inspect the result,
and decide what to do next.

Tools make the action real.
Observations make the next step informed.

Advance after:
"Observations make the next step informed."

---

## Slide 4 — Agent = Model + Tools + Loop

Target: 2:15 – 3:45

On entry:
Do not click yet. Let the two-lane contrast sit.

Say:

On the left is the short version of a standalone model:
prompt in, text out, stop.

On the right is the real shift:
goal in, tool use, feedback, repeat until you can answer.

`[CLICK 1]` after:
"repeat until you can answer."

Reveal:
The ReAct definition line and the diagram's Thought node appears on the right.

Say:

The simplest useful vocabulary for that loop is ReAct:
Reason and Act.

`[CLICK 2]` — Thought node
`[CLICK 3]` — Action node + arrow

Say (grouped):

The model decides what to do next, then acts — usually a tool call.

`[CLICK 4]` — Observation node + feedback arrow
`[CLICK 5]` — Final Answer exit

Say (grouped):

The world responds with new evidence. Then one more decision: do I need another pass, or do I have enough to answer?

That stop matters because otherwise the loop sounds infinite.

Advance after:
"the loop sounds infinite."

Pacing note: do NOT dwell on each label individually. The audience gets the concept from the two-lane contrast. The walkthrough confirms; it should not re-teach. Target ~1:30.

Q&A ammunition:
- Workflow vs Agent: "If the next step is decided by code, it's a workflow. If decided by the model, it's an agent."
- Five Control Patterns (Anthropic): prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. The only one you need today is the basic tool loop.

---

## Slide 5 — When Does a Task Need an Agent?

Target: 3:45 – 4:30

On entry:
Let the audience read the title and the heuristic subtitle.

Say:

Before the demo, one quick contrast.

Fixed path you can flowchart — that is a workflow.
Model decides the next step at runtime — that is an agent.

On the left: a customer email workflow.
Receive, classify, route, generate reply, send. Five steps, straight down, no branches.

Notice the green boxes — classify and generate reply are LLM calls. But the LLM fills a slot and code moves on. The path is the same every time.

`[CLICK 1]` after:
"The path is the same every time."

Reveal:
the green "Decision Under Constraints" card on the right.

Say:

On the right: an agent.
Notice the loop-back arrow and the green diamonds. The model decides which tool to call, observes the result, and decides whether to loop again or stop.

Both diagrams use an LLM. The difference is who controls the flow. Left: the code does. Right: the model does.

The meeting-scheduling demo is the right-hand case.
The agent cannot look up the answer, because the answer does not exist yet.
It has to gather evidence, weigh constraints, and produce a recommendation.

Let us see what that looks like.

Advance after:
"Let us see what that looks like."

Q&A ammunition:
- Enterprise example: Think incident triage. The runbook might say "check logs, then check CPU, then restart." That is a workflow. But if the right next step depends on what the logs actually say, that is an agent task.

---

## Slide 6 — Prerecorded Demo

Target: 4:30 – 8:00

On entry:
Do not click yet.

Say:

This demo is prerecorded.
That is deliberate — I want us to focus on the behavior of the agent, not on conference Wi-Fi.

The request is:
"We need a good time next week for a joint meeting with our New York and London teams. Please recommend the best day and time."

Keep an eye on the running cost in the corner.
The whole thing will cost less than a text message.

I do not want to solve it in advance.
Just notice one pattern: each tool result changes what the agent does next.

### Step 1

`[CLICK 1]` after:
"Let us watch the first decision."

Reveal:
Step 1 Thought.

Say:

The agent decides it needs timezone data and holiday data before it can recommend anything.

`[CLICK 2]` after:
"Now let us see what came back."

Reveal:
Step 1 Tool calls + Observations.

Say:

It fetches timezone info for New York and London.
It fetches holiday data.

And here is the important part:
the holiday data came back for 2025.
That detail is about to change everything.

*(Pause half a beat here. Let the audience register the year mismatch before you continue.)*

### Step 2 — The Self-Correction *(STAR moment)*

`[CLICK 3]` after:
"Watch what happens next."

Reveal:
Step 2 Thought. Orange correction highlight appears in the phase tracker.

Say:

This is the moment I want you to remember.

The agent reads its own evidence, spots the wrong year, and decides to correct it.

Nobody told it the year was wrong.
No error was thrown.
It caught its own mistake.

In a single API call, the model would have confidently given you a 2025 answer and stopped.
You would have caught the mistake, pasted it back, and asked again.
The loop automates that human retry cycle.

`[CLICK 4]` after:
"Now it repairs the evidence."

Reveal:
Step 2 Tool calls + Observations.

Say:

It re-fetches the 2026 holidays for both countries.
Now the evidence is grounded in the right week and the right year.

The model reasons; the runtime — the tools, the loop, the boundaries — turns reasoning into reliable execution.

### Step 3

`[CLICK 5]` after:
"Now it has enough evidence to recommend."

Reveal:
Step 3 Thought.

Say:

It cross-references timezones and holidays, finds that after the US DST switch the effective gap is four hours, and picks the best window.

`[CLICK 6]` after:
"Here is the answer."

Reveal:
Final Answer. Cost punchline appears on the right: **$0.04** — "Less than a text message."

Say:

Tuesday, March 10 or Wednesday, March 11, 2026,
at 10:00 AM New York, 2:00 PM London.

*(Stop clicking. Let the answer sit for a full beat.)*

Three round-trips with the model. About four cents. Less than a text message.

That answer is grounded in tool results, not just confident wording.

Advance after:
"not just confident wording."

Q&A ammunition (DST detail if asked):
- Next week the effective gap between New York and London is 4 hours, because the US switches to daylight saving time on March 8 while the UK stays on GMT until March 29.
- There are no public holidays during March 9 to 13 in either country.
- 10:00 AM New York becomes 2:00 PM London — not too early for New York, not too late for London.
- Tuesday and Wednesday beat Monday or Friday because they avoid weekly ramp-up and wind-down.

---

## Slide 7 — A Minimal Runtime

Target: 8:00 – 9:00

On entry:
Let the four color-coded cards sit for one beat.

Say:

If you want to compress everything we just saw into one engineering sentence, it is this:
an agent runtime is a bounded tool loop.

`[CLICK 1]` after:
"an agent runtime is a bounded tool loop."

Reveal:
the debrief sentence + insight line.

Say:

Thought and Final Answer came from the model.
Action happened through tools.
Observation came back from the environment.
And the controller decided whether to continue or stop.

New capabilities layer on top. The core loop rarely needs touching.

`[CLICK 2]` after:
"The core loop rarely needs touching."

Reveal:
the code panel with the ~20-line loop.

Say:

Everything you just watched in the demo is driven by this loop.

That is the entire loop.
Not the framework. Not the SDK.
A while-true, an LLM call, an if-branch, and a message append.

Advance after:
"and a message append."

---

## Slide 8 — Beyond the Basic Loop

Target: 9:00 – 9:45

Say:

The loop works. Now — what decides whether it works *reliably*?

Guardrails —
the model will ignore rules written only in the prompt. Encode them in code. Linters, type checks, tool-level restrictions. Same discipline you already use in CI.

Tool design —
one tool per goal, not per API endpoint. If your agent has twenty fine-grained tools, it will pick the wrong one.

Context layers —
the model can only see a fixed window of text. Load what this turn needs, not everything you have.

And eval first —
test the harness before tuning the agent. Without automated pass/fail, you will tweak prompts in circles.

The loop is the foundation. These four decide whether it works reliably.

Advance after:
"These four decide whether it works reliably."

Q&A ammunition:
- Guardrails: "Guidelines in docs are easily ignored. The OpenAI codex team (3 engineers, 1M lines, 5 months) found that encoding rules as linters and CI checks was the breakthrough."
- Tool Design / ACI: "Design tools like you'd design a good API — map them to the agent's goals, not low-level operations. Bad: get_post + update_content + update_title as three calls. Good: update_post as one goal-oriented call."
- Context: "What the model sees determines what it does. Noise kills accuracy. Layer context: permanent instructions, on-demand knowledge, runtime state. Compress or drop what is not needed."
- Eval: "The article's infrastructure error chart is striking — what looked like model failures were actually environment crashes from resource limits. Fix the eval before blaming the model."
- Context window: "The model can only 'see' a fixed amount of text at once. Long conversations push old context out. That is why context layers matter."

---

## Slide 9 — Closing

Target: 9:45 – 10:45

Say:

Remember that screenshot from the beginning?

The assistant that said "I am recording" but could not actually record?

Now you know what was missing.
Not smarter text. A loop.

A model proposes the next step.
A runtime executes.
Tools interact with the world.
Observations close the loop.

*(Pause.)*

The repo has the exact code from this talk.
Clone it, swap in your own tools.
Maybe a tool that queries your JIRA API and another that checks your deployment dashboard.
Define two tools, write the loop.
You will have a working agent by Sunday.

The code and deeper reading are linked in the repo.

*(Beat.)*

Words describe.
Agents do.

*(Let the silence hold for two beats.)*

Thank you.

---

## Appendix — Demo Code

Optional only.

Use this if someone asks to see the teaching sketch behind the replay.

Click into the appendix from the demo slide, answer the question, then use the return link to go back.

Note: "The core loop is under 20 lines. Everything else is tools, context, and safety."

---

## Easter Egg — 8-Office Global Demo

Optional only. Use this for Q&A or if the audience wants to see the agent handle a harder problem.

Say:

Same agent, much harder problem: eight offices across San Francisco, New York, London, Berlin, Dubai, Mumbai, Singapore, and Tokyo.

`[CLICK 1]`

Step 1: 15 parallel tool calls — eight timezone lookups and seven holiday lookups.
The UAE and India APIs return errors. The agent handles them gracefully.

`[CLICK 2]`

Step 2: Same self-correction pattern. It re-fetches all seven countries for 2026.
It also notes that US offices already switched to daylight saving time on March 8.

`[CLICK 3]`

Step 3: It builds a full UTC overlap matrix.
Finds that UTC 09:00 hits six of eight offices in business hours.
Ranks the top three windows.
Notes that eight out of eight is mathematically impossible with a 16-hour spread from Tokyo to San Francisco.

Total cost: about eleven cents for 22 tool executions across 3 round-trips with the model.
Still about a dime.

Q&A ammunition (if asked about failure modes / "bounded"):
- Max iteration count (typically 10-15 for simple tasks)
- Token budget (stop if cumulative cost exceeds a threshold)
- Allowed tool list (the agent can only call tools you explicitly define)
- Timeout per tool call (30 seconds is typical)
- The "bounded" in "bounded tool loop" means all of these together
