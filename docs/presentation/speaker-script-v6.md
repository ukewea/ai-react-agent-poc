# From LLM to Agent

This version is a rehearsal score.

Rules:
- Click after the setup sentence, not during it.
- If the reveal is the punchline, click, pause for half a beat, then say the punchline.
- In the prerecorded demo, every loop step is two clicks: `Thought`, then `Tool + Feedback`.
- After the final answer appears, stop clicking for a full beat and let it sit.

## Slide 1 — Title

Target: 0:00 to 0:25

Say:

Today I want to leave you with one mental model.

A standalone LLM produces text.
An agent is a loop that can use tools, observe results, and decide what to do next.

That distinction is the whole talk.

Advance to next slide after:
"That distinction is the whole talk."

## Slide 2 — Cold Open

Target: 0:25 to 1:30

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

Advance to next slide after:
"That is the gap I want to make concrete today."

## Slide 3 — What Was Missing?

Target: 1:30 to 2:25

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

Advance to next slide after:
"observations make the next step informed."

## Slide 4 — Agent = Model + Tools + Loop

Target: 2:25 to 3:25

On entry:

Do not click yet.

Say:

On the left is the short version of a standalone model:
prompt in, text out, stop.

On the right is the real shift:
goal in, tool use, feedback, repeat until you can answer.

`[CLICK 1]` after:
"repeat until you can answer."

Reveal:
the bottom takeaway row.

Say:

This is the compact version I want you to remember.

Model chooses the next move.
Tools make contact with the environment.
Feedback decides whether we continue or answer.

Advance to next slide after:
"whether we continue or answer."

## Slide 5 — Introducing ReAct

Target: 3:25 to 4:55

Say:

The simplest useful teaching model for that loop is ReAct:
Reason and Act.

For teaching, I will use four labels.

`[CLICK 1]` after:
"For teaching, I will use four labels."

Reveal:
`Thought`

Say:

Thought is the decision step:
what should I do next?

`[CLICK 2]` after:
"what should I do next?"

Reveal:
`Action`

Say:

Action is where the system actually does something.
Usually that means a tool call.

`[CLICK 3]` after:
"Usually that means a tool call."

Reveal:
`Observation`

Say:

Observation is what comes back from the outside world.
It might be data.
It might be an error.
Either way, it is new evidence.

Then one more decision happens:
do I need another pass,
or do I now have enough evidence to answer?

`[CLICK 4]` after:
"or do I now have enough evidence to answer?"

Reveal:
`Final Answer` and the stop note.

Say:

That stop matters because otherwise the loop sounds infinite.

And this is not just talk-specific wording.
In common ReAct-style examples, the loop ends with a terminal move like `Finish[...]` or a final answer.

One caveat:
many production systems do not literally print a visible `Thought:` line.
The surface format can change.
The loop is the important part.

Advance to next slide after:
"The loop is the important part."

## Slide 6 — Fact Retrieval vs Decision Under Constraints

Target: 4:55 to 5:50

Say:

Before the demo, I want one quick contrast.

I am not trying to give you a grand taxonomy here.
I only want to make the stop condition of the demo legible.

For fact retrieval, you stop when the missing fact is found.

For a decision under constraints, you stop when there is enough evidence to defend a recommendation.

That is why the meeting demo is not just retrieval with extra steps.

Advance to next slide after:
"not just retrieval with extra steps."

## Slide 7 — Prerecorded Demo

Target: 5:50 to 9:10

On entry:

Do not click yet.

Say:

Now let us watch the loop happen.

This demo is prerecorded.
That is deliberate.
I want us to focus on the behavior of the agent, not on conference Wi-Fi.

The request is:
"We need a good time next week for a joint meeting with our New York and London teams. Please recommend the best day and time."

I do not want to solve it in advance.
Just notice one pattern:
each tool result changes what the agent does next.

### Step 1

`[CLICK 1]` after:
"Let us watch the first decision."

Reveal:
Step 1 `Thought`

Say:

The agent decides it needs timezone data and holiday data before it can recommend anything.

`[CLICK 2]` after:
"Now let us see what came back."

Reveal:
Step 1 `Tool + Feedback`

Say:

It fetches the timezone information.
It fetches holiday data.

And here is the important part:
the holiday data came back for 2025.
That detail will change the next move.

### Step 2

`[CLICK 3]` after:
"That mismatch changes the next move."

Reveal:
Step 2 `Thought`

Say:

Now the agent notices the year mismatch and decides to correct it.

`[CLICK 4]` after:
"Now it repairs the evidence."

Reveal:
Step 2 `Tool + Feedback`

Say:

It fetches the 2026 holidays.
Now the evidence is grounded in the right week and the right year.

### Step 3

`[CLICK 5]` after:
"Now it has enough evidence to recommend."

Reveal:
Step 3 `Thought`

Say:

This is the stop decision, but now the audience should also see the reasoning that made it possible.

Next week the effective gap is 4 hours because the US has already switched to daylight saving time while the UK has not.

There are no public holidays during March 9 to 13 in either country.

And 10:00 AM New York / 2:00 PM London is the cleanest overlap:
not too early for New York,
not too late for London.

That is why the recommendation lands in the middle of the week rather than on Monday or Friday.

`[CLICK 6]` after:
"So here is the answer."

Reveal:
`Final Answer`

Say:

The recommendation is:
Tuesday, March 10 or Wednesday, March 11, 2026,
at 10:00 AM in New York and 2:00 PM in London.

Then stop clicking.
Let that sit for one beat.

Advance to next slide after:
"That answer is grounded in tool results, not just confident wording."

## Slide 8 — A Minimal Runtime

Target: 9:10 to 10:00

On entry:

Let the four cards sit for one beat.

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

Advance to next slide after:
"whether to continue or stop."

## Slide 9 — Beyond ReAct

Target: 10:00 to 10:45

Say:

ReAct is not the whole field.

Real systems add memory,
planning layers,
retries,
guardrails,
or multiple cooperating components.

But those are extensions.

If you understand the loop, you already understand the foundation those systems build on.

Advance to next slide after:
"the foundation those systems build on."

## Slide 10 — Closing

Target: 10:45 to 11:30

Say:

So the takeaway is simple.

A standalone LLM can describe actions.
An agent can take them.

The model proposes the next step.
The runtime executes.
Tools interact with the environment.
Observations close the loop.

That is why building an agent is mostly about building the loop around the model, not just making one model call sound more impressive.

Words describe.
Agents do.

## Appendix — Demo Code

Optional only.

Use this if someone asks to see the teaching sketch behind the replay.

Click into the appendix from the demo slide, answer the question, then use the return link to go back to the prerecorded demo if needed.
