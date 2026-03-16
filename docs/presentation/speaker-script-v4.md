# From LLM to Agent

## Opening

We all know an LLM can describe a plan.

It can say:
"Search the files."
"Open the relevant module."
"Write a summary."

But there is a gap between describing an action and actually taking it.

LLM alone does not change the world.
Language alone does not change the world.

If we want a system to read files, call APIs, run code, or write results somewhere, something around the model has to execute those steps.

That "something around the model" is what this talk is about.

To keep this concrete, I will use one task throughout the talk:

"Inspect this slide app, figure out how keyboard navigation works, and write a short markdown note."

## What Makes a System an Agent

In a practical engineering sense, an agent is a system that uses a model to choose actions, executes those actions through tools, observes the results, and repeats until it reaches a goal.

Be precise about the boundaries:

The model proposes or selects the next step within the runtime's available tools, rules, and limits.
The runtime executes the step.
The tools interact with the environment.
The observations come back into the loop as new context.

That loop is what makes it an agent.

This distinction matters because people often mix together three different things:

A standalone LLM.
A product wrapper that gives the model tools.
And an agent loop that can choose what to do next based on what it observes.

Those are not the same thing.

There is another distinction worth making.

A fixed workflow follows predetermined steps.
A CI pipeline is a simple example.
An agent chooses the next step conditionally, based on observations, while working toward a goal.

If you want one quick intuition:
the LLM is the brain, and the agent system gives it hands.

In engineering terms, those "hands" are tool interfaces plus a controller loop that executes calls and returns observations.

## Why Tools Matter

Tools are what make the Action step real.

Without tools, the system outputs text.
With tools, the system can search, read files, write files, run code, or call APIs.

Tools expand capability, but they also introduce boundaries and failure modes: permission errors, bad results, malformed outputs, and side effects.

That is why tools and permissions define both what the agent can do and what it is allowed to do.

## Introducing ReAct

So if the loop is the key idea, what is a way to implement that loop?

ReAct.

ReAct stands for Reason and Act.

It is a simple pattern:

Thought.
Action.
Observation.

Then repeat.

In this teaching model, `Thought` means the explicit decision step about what to do next.
Then comes `Action`: a tool call.
The runtime executes the tool and returns an `Observation`.
That observation goes back into the context, and the model proposes the next step.

This is why ReAct is such a useful teaching model.
It makes the decision-action-observation loop explicit.

I want to be careful here: ReAct is not a claim that every modern production agent literally works this way or exposes visible reasoning traces.

In many real systems, the underlying API uses structured tool calls rather than free-form textual traces, but the same loop still applies.

## Simple ReAct Example

Now let us run the task through that loop.

The goal is:

"Inspect this slide app, figure out how keyboard navigation works, and write a short markdown note."

Thought: I need to find the relevant files.
Action: list files in the project.
Observation: I see `src/App.jsx` and `src/slides.jsx`.

Thought: `src/slides.jsx` looks relevant, so I will inspect it first.
Action: open `src/slides.jsx`.
Observation: it defines slide content and diagrams, but not keyboard navigation.

Thought: keyboard handling is probably in the app shell instead.
Action: open `src/App.jsx`.
Observation: I see the arrow-key handlers and slide state updates.

Thought: I now understand the flow well enough to summarize it.
Action: write `navigation-notes.md`.
Observation: the file was created successfully.

That is already an agent doing useful work.

Notice what matters here:
the observation changes the next step.
The agent does not follow a fixed script.
It updates its plan based on what it finds.

## The Simplest ReAct Runtime

If we wanted to build the simplest possible ReAct agent, we would need only a few things:

A model.
A small set of tools.
A loop controller.
And a stopping rule.

Then the runtime is straightforward:

1. The user gives a goal.
2. The model proposes the next step.
3. If the next step is a tool call, the runtime executes it.
4. The result comes back as an observation.
5. The loop repeats until the agent reaches a final answer or hits a limit.

That limit might be based on iterations, tokens, time, or cost.
The exact stopping rule is an implementation detail.
The important point is that the loop is bounded and controlled.

## Demo Setup

Now let us watch the loop happen.

The demo is prerecorded and replayed inside the slides so we can focus on the behavior instead of gambling on a live run.

It uses the same small local slide app and only three tools:

List files.
Read file.
Write file.

The goal is the same as the example:

"Figure out how keyboard navigation works, then write a short markdown note."

On screen, you will see four things:

Thought.
Action.
Observation.
And the final markdown file opened at the end.

Watch for two things:

First, one observation should change the next action.
Second, the run should end with a visible artifact: a real file written by the agent.

## After The Demo

That is the difference.

The LLM did not just describe the work.
The agent inspected the codebase, adapted to what it found, and produced a real artifact through the loop.

## Beyond ReAct

ReAct is not the whole field.

More advanced agents may add planning layers, memory, retries, structured outputs, guardrails, or multiple cooperating components.

But if you understand this loop, you understand the foundation those systems build on.

## Closing

So the core idea is simple.

A standalone LLM can describe actions.
An agent can take them.

The model proposes the next step.
The runtime executes.
Tools interact with the environment.
Observations close the loop.

And that is why building an agent is mostly about building the loop around the model, not just calling the model once.

Words describe.
Agents do.
