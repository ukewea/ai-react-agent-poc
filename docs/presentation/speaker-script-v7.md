# From LLM to Agent — Speaker Script v7

This version is a rehearsal score aligned to the current slide deck (9 slides + appendix + easter egg).

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

Say:

Text about action is not the action.

On the left, the model can say:
"I am recording."

But saying it is not doing it.

`[CLICK 1]` after:
"But saying it is not doing it."

Reveal:
the tool-enabled system on the right.

Say:

Now we have the missing path into the environment.

It can call something real,
inspect the result,
and decide what to do next.

That is the causal chain for the rest of the talk:
tools make the action real,
and observations make the next step informed.

Advance after:
"observations make the next step informed."

---

## Slide 4 — Agent = Model + Tools + Loop

Target: 2:15 – 4:15

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

Let me walk through the four labels.

`[CLICK 2]` after:
"Let me walk through the four labels."

Reveal:
Thought + arrow to Action in diagram.

Say:

Thought is the decision step:
what should I do next?

`[CLICK 3]` after:
"what should I do next?"

Reveal:
Action + arrow to Observation in diagram.

Say:

Action is where the system actually does something.
Usually that means a tool call.

`[CLICK 4]` after:
"Usually that means a tool call."

Reveal:
Observation + feedback loop arrow in diagram.

Say:

Observation is what comes back from the outside world.
It might be data. It might be an error.
Either way, it is new evidence.

Then one more decision happens:
do I need another pass,
or do I now have enough evidence to answer?

`[CLICK 5]` after:
"or do I now have enough evidence to answer?"

Reveal:
Final Answer exit in diagram.

Say:

That stop matters because otherwise the loop sounds infinite.

One caveat:
many production systems use structured tool calls rather than visible free-form traces.
The surface format changes. The loop is the important part.

Advance after:
"The loop is the important part."

---

## Slide 5 — Fact Retrieval vs Decision Under Constraints

Target: 4:15 – 5:10

On entry:
Let the audience read the heuristic title: "If you can write the decision tree, you don't need an agent."

Say:

Before the demo, one quick contrast.

On the left: fact retrieval.
You stop when the missing fact is found.

`[CLICK 1]` after:
"You stop when the missing fact is found."

Reveal:
the green "Decision Under Constraints" card on the right.

Say:

On the right: a decision under constraints.
You stop when there is enough evidence to defend a recommendation.

Notice the stop conditions. They are different.

The meeting-scheduling demo is the right-hand case.
The agent cannot look up the answer, because the answer does not exist yet.
It has to gather evidence, weigh constraints, and produce a recommendation.

Let us see what that looks like.

Advance after:
"Let us see what that looks like."

---

## Slide 6 — Prerecorded Demo

Target: 5:10 – 8:40

On entry:
Do not click yet.

Say:

This demo is prerecorded.
That is deliberate — I want us to focus on the behavior of the agent, not on conference Wi-Fi.

The request is:
"We need a good time next week for a joint meeting with our New York and London teams. Please recommend the best day and time."

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

That is what a loop buys you that a single call never can:
the ability to inspect your own results and change course.

`[CLICK 4]` after:
"Now it repairs the evidence."

Reveal:
Step 2 Tool calls + Observations.

Say:

It re-fetches the 2026 holidays for both countries.
Now the evidence is grounded in the right week and the right year.

### Step 3

`[CLICK 5]` after:
"Now it has enough evidence to recommend."

Reveal:
Step 3 Thought.

Say:

This is the stop decision.

Next week the effective gap between New York and London is 4 hours, because the US switches to daylight saving time on March 8 while the UK stays on GMT until March 29.

There are no public holidays during March 9 to 13 in either country.

10:00 AM New York becomes 2:00 PM London — not too early for New York, not too late for London.

Tuesday and Wednesday beat Monday or Friday because they avoid weekly ramp-up and wind-down.

`[CLICK 6]` after:
"So here is the answer."

Reveal:
Final Answer. Cost punchline appears on the right: **$0.04** — "Less than a text message."

Say:

Tuesday, March 10 or Wednesday, March 11, 2026,
at 10:00 AM New York, 2:00 PM London.

*(Stop clicking. Let the answer sit for a full beat.)*

Three API calls. About four cents. Less than a text message.

That answer is grounded in tool results, not just confident wording.

Advance after:
"not just confident wording."

---

## Slide 7 — A Minimal Runtime

Target: 8:40 – 9:25

On entry:
Let the four color-coded cards sit for one beat.

Say:

If you want to compress everything we just saw into one engineering sentence, it is this:
an agent runtime is a bounded tool loop.

`[CLICK 1]` after:
"an agent runtime is a bounded tool loop."

Reveal:
the debrief sentence.

Say:

Thought and Final Answer came from the model.
Action happened through tools.
Observation came back from the environment.
And the controller decided whether to continue or stop.

Advance after:
"whether to continue or stop."

---

## Slide 8 — Beyond ReAct

Target: 9:25 – 10:05

Say:

ReAct is not the whole field.

Real systems add memory,
planning layers,
and multiple cooperating components.

But those are extensions.

If you understand the loop, you understand the foundation all of these build on.

Advance after:
"the foundation all of these build on."

---

## Slide 9 — Closing

Target: 10:05 – 11:00

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

Words describe.
Agents do.

*(Let the silence hold for two beats. Then:)*

The code and slides are on GitHub if you want to take the loop apart yourself.

Thank you.

---

## Appendix — Demo Code

Optional only.

Use this if someone asks to see the teaching sketch behind the replay.

Click into the appendix from the demo slide, answer the question, then use the return link to go back.

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

Total cost: about eleven cents for 22 tool executions across 3 API calls.
Still about a dime.
