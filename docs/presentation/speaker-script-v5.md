# From LLM to Agent

## Title

Today I want to leave you with one mental model.

A standalone LLM produces text.
An agent is a loop that can use tools, observe results, and decide what to do next.

That distinction is the whole talk.

## Cold Open

I want to start with this screenshot.

It is funny because the language sounds completely convincing.
The assistant sounds like it started recording, kept track of the state, and then stopped at the end.

But nothing in the outside world actually changed.

No recording started.
No file appeared.
No recorder state was verified.

So the limitation here is not language.
The limitation is action.

The model could describe the job.
It could not do the job.

That is the gap I want to make concrete today.

## What Was Missing?

Text about action is not the action.

If you want a system to actually record a meeting, search the web, call an API, write a file, or click a button, the model needs a tool path into the environment.

That is the first missing piece.

The second missing piece is feedback.

Once the tool runs, something comes back:
success, failure, data, state, an error, a partial result.

That observation is what lets the system choose the next step intelligently instead of just generating one polished paragraph and stopping.

So the causal chain for the rest of the talk is:

Text is not action.
Tools enable action.
Observations steer the next action.
The loop is what makes the system agentic.

## What Makes a System an Agent?

In practical engineering terms, an agent is a system where:

the model chooses a next step,
the runtime executes that step through tools,
the environment returns an observation,
and the loop repeats until the goal is done or we stop it.

A standalone LLM is prompt in, text out, stop.

An agent is goal in, act, get feedback, act again.

That is why I like the simple line:
the model chooses,
tools act,
feedback decides whether we continue or answer.

So on this slide, the left side is the short version:
prompt in, text out, stop.

The right side is the real shift:
goal in, tool use, feedback, repeat until you can answer.

One useful boundary to keep in mind:
a fixed workflow is not quite the same thing.

A workflow can call tools too, but it follows a script.
An agent uses observations to decide what to do next.

## Introducing ReAct

The simplest useful teaching model for that loop is ReAct:
Reason and Act.

For teaching, I will use four labels:

Thought.
Action.
Observation.
Final Answer.

Thought is the decision step:
what should I do next?

Action is where the system actually does something.
Usually that means a tool call.

Observation is what comes back from the outside world.
It might be the data you wanted.
It might be an error.
Either way, it is new evidence.

Then one more decision happens:
do I need another pass through the loop,
or do I now have enough evidence to answer?

That is the key idea.
Not smarter wording.
Not longer prompts.
A loop where each new observation can change the next move.

And that stop is not something I am inventing for this talk.
In common ReAct-style examples, the loop ends with a terminal move like `Finish[...]` or a final answer.

One quick caveat:
many production systems do not literally print a visible `Thought:` line.
They often use structured tool calls and hidden reasoning.
That is fine.
The surface format can change.
The loop is the important part.

## Lookup vs Recommendation

Before the demo, I want one quick contrast.

A lookup task can still use the loop.
So can a recommendation task.
The real difference is what makes the loop stop.

For example:
"How old is NVIDIA's CEO?"

That is a useful multi-step chain:
find the company,
find the CEO,
find the birth date,
compute the age,
answer.

That proves the loop can chain facts.

But it is still mostly a retrieval task.

A lookup task has a very clean stop condition:
you stop when the fact is found.

The more interesting agent case is when the goal is a little vague and the system has to decide what matters, gather outside evidence, and then make a recommendation.

That kind of task stops differently.
It stops when there is enough evidence to make a recommendation you can defend.

That is what the demo is about.

## Prerecorded Demo

Now let us watch the loop happen.

This demo is prerecorded.
That is deliberate.
I want us to focus on the behavior of the agent, not on conference Wi-Fi.

The user request is:

"We need a good time next week for a joint meeting with our New York and London teams. Please check both timezones and any upcoming holidays, then recommend the best day and time."

I do not want to solve that in advance on this slide.
Instead, here is what to watch for.

First, watch what it chooses to fetch.

Second, watch how the next move depends on the previous observation.

Third, watch how it recovers when the first holiday year is wrong.

And fourth, watch for the moment when it decides it has enough evidence to stop.

So while the replay runs, you do not need to read every line.
I am going to pace it in two beats for each step.

First click:
what did the agent decide?

Second click:
what did it do, and what came back?

So just track the loop:
Thought first,
then tool result,
then the next Thought becomes different because of that observation.

## After the Demo

That is the difference between sounding capable and being agentic.

The first pass was not perfect.
The agent initially fetched holiday data for 2025.

But because the tool output came back into the loop as an observation, the next step changed.
It corrected itself.

Then it stopped when it had enough evidence.

The final recommendation in this prerecorded run is:
Tuesday, March 10 or Wednesday, March 11, 2026,
at 10:00 AM in New York and 2:00 PM in London.

That answer is grounded in tool results, not just confident wording.

And the interesting part is not the calendar answer by itself.
The interesting part is the causal chain that produced it.

Text was not enough.
Tools made contact with the outside world.
Observations shaped the next move.
The loop turned that into a recommendation.

## A Minimal Runtime

If you want to compress everything we just saw into one engineering sentence, it is this:

an agent runtime is a bounded tool loop.

In the demo vocabulary:
Thought and Final Answer came from the model.
Action happened through tools.
Observation came back from the environment.
And the controller decided whether to continue or stop.

The user gives a goal.
The model chooses the next step.
The runtime executes any needed tool call.
The observation comes back.
Repeat until there is a final answer or you hit a limit on time, tokens, iterations, or cost.

And one subtle but important point:
success and failure are both useful observations.

## Beyond ReAct

ReAct is not the whole field.

Real systems often add memory, planning layers, retries, guardrails, or multiple cooperating components.

But those are extensions.

If you understand this loop, you already understand the foundation those systems build on.

## Closing

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
