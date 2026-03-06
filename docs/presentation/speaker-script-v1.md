# From LLM to Agent

## Opening

Today I want to talk about a very simple question:

Why is a language model not yet an agent?

Because a language model can say what it wants to do, but by itself, it cannot do it.

A model can say: "I should call an API for the latest data."
A model can say: "I should open this file."
A model can say: "I should run a program and test the result."
But unless something around the model actually performs those actions, nothing happens.

That gap is the difference between a chatbot and an agent.

## LLM Intent vs Action

If I ask an LLM to solve a task, it may produce very good reasoning. It may even describe a correct plan.

For example, it might answer:

"I should search the web, compare two sources, summarize the result, and save it to a file."

That sounds intelligent. But notice something important: this is still only text.

The model has described an action, not performed an action.

This is the key idea I want to establish first:
an LLM can produce intentions in language, but language alone does not change the world.

## Brain and Limbs Analogy

A useful analogy is this:

The LLM is like a brain.
An agent is like the brain plus hands and legs.

A brain alone can think. It can plan. It can decide.
But without a body, it cannot pick up a pen, open a door, or move an object.

In the same way, an LLM alone can reason about actions, but it cannot directly interact with files, browsers, APIs, terminals, or databases.

Once we give the model tools, and once we give it a runtime that can execute those tools, then the system can actually affect its environment.

So the LLM provides reasoning.
The agent system provides the ability to act.

## What Makes a System an Agent

So what turns an LLM-based system into an agent?

Not just a nicer prompt.
Not just a chatbot UI.
And not just a long context window.

What matters is that the system can do three things repeatedly:

It can think about the next step.
It can take an action through a tool.
And it can observe what happened.

This is the core agent loop.

This is called as a continuous Thought-Action-Observation cycle, a very good framing.

An agent is not just "an LLM with tools" in a loose sense.
It is a system that wraps the model in a loop:
think, act, observe, repeat until the objective is fulfilled.

## Why Tools Matter

Tools are how the system reaches outside the model.

A tool might be a web search function.
It might be a file reader.
It might be a Python runner.
It might be a browser controller.
It might be a business API like Jira, Slack, Gmail, or a database client.

Without tools, the model can only talk about the world.
With tools, it can query the world and change the world.

That is why tool use matters so much in agent design.

The model is still doing the reasoning, but the tools are what allow the system to turn reasoning into operations.

;;comment: i don't think we need an dedicated slide `From Chatbot to Agent` talking about chatbot, we could've just put the explanation part in the last slide
## From Chatbot to Agent

This also explains why a chatbot is not automatically an agent.

A chatbot can be very capable in conversation. It can answer questions, explain code, draft documents, and help users think.

But if it cannot actually take actions and observe the results, it remains primarily a conversational system.

A standalone LLM cannot directly change external state unless the surrounding application gives it tools and permission.

That last part matters: tools, and permission.

An agent is not just about capability. It is also about controlled execution in the real world.

## Introducing ReAct

One of the ways to build this kind of agent is the ReAct pattern.

ReAct stands for Reason and Act.

The basic idea is straightforward:
the model reasons about what to do next, takes an action, sees the observation, and then reasons again.

So instead of one big prompt and one final answer, we get an iterative workflow.

The sequence looks like this:

Thought.
Action.
Observation.
Thought.
Action.
Observation.
And eventually, final answer.

This is a useful teaching model because it shows that intelligence in an agent does not come only from one giant burst of reasoning. It comes from reasoning combined with interaction.

;;comment: i think we could remove `Why ReAct Works` as my colleagues might imply these facts from `Introducing ReAct` slide
## Why ReAct Works

Why is this powerful?

Because many tasks cannot be solved correctly in one shot.

If the task depends on current information, the agent needs to search.
If the task depends on local files, the agent needs to inspect those files.

The observation step is what closes the loop.

Without observation, the model is just guessing.
With observation, the model can adapt.

;;------------ half way, unread below ------------------

## Simplest ReAct Workflow

So if we wanted to build the simplest possible ReAct agent, what would we need?

We need a model.
We need a small set of tools.
We need a loop controller.
And we need a rule for when to stop.

A minimal workflow would be:

First, the user gives a goal.
Second, we ask the model what to do next.
Third, if the model chooses a tool, our program executes that tool.
Fourth, we take the result of the tool and feed it back to the model as an observation.
Then we repeat this process until the model says it is done.

That is already enough to build a simple agent.

## Very Simple Example

Imagine the user asks:

"Find the latest pricing for a model API and write a short summary into a markdown file."

A ReAct-style agent might proceed like this:

Thought: I need current information.
Action: call web search.
Observation: receive search results.
Thought: I should open the official pricing page.
Action: fetch the pricing page.
Observation: receive the content.
Thought: I now have enough information. I should write a summary file.
Action: write `pricing-summary.md`.
Observation: file saved successfully.
Final answer: summary completed.

That is a simple but real agent behavior.

It is not just chatting about what should happen. It is actually doing the work step by step.

## What the Demo Should Show

In the prerecorded demo, I would recommend showing exactly this loop in action.

Not a flashy multi-agent system.
Not a complicated benchmark.
Just one clear, understandable task.

For example:
research a topic, collect evidence, and write a report file.

That demo works well because the audience can see three things clearly:

First, the model decides on a next step.
Second, a tool is used.
Third, the environment changes, because a real file gets created.

That makes the difference between LLM and agent visible.

## What to Emphasize Technically

There are two technical points I would emphasize so the talk stays honest.

First, the intelligence is not coming from tools alone.
The model still has to decide which action to take, when to take it, and how to use the observations.

Second, ReAct is not the only agent design.
It is simply the easiest useful pattern to explain.

More advanced agents may add planning, memory, retries, structured outputs, safety checks, or multiple cooperating agents.

But if the audience understands ReAct, they understand the foundation.

## Closing

So the big takeaway is this:

A language model can generate reasoning in text.
An agent turns that reasoning into action.

The LLM is like the brain.
The agent system gives it hands and legs.
Tools let it interact with the environment.
Observations let it learn from what happened.
And the ReAct loop ties those pieces together:
Thought, Action, Observation, repeated until the objective is fulfilled.

That is why an LLM alone is not yet something like Codex.
And that is why building an agent is really about building the loop around the model, not just calling the model once.
