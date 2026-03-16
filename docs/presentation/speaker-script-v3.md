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

## What Makes a System an Agent

In a practical engineering sense, an agent is a system that uses a model to choose actions, executes those actions through tools, observes the results, and repeats until it reaches a goal.

Be precise about the boundaries:

The LLM decides the next step.
The runtime executes the step.
The tools interact with the environment.
The observations come back into the loop as new context.

That loop is what makes the system agentic.

This distinction matters because people often mix together three different things:

A standalone LLM.
A product wrapper that gives the model tools.
And an agent loop that can choose what to do next based on what it observes.

Those are not the same thing.

There is another distinction worth making.

A fixed workflow follows predetermined steps.
An agent chooses the next step conditionally, based on observations, while working toward a goal.

## Brain and Hands

If you want one intuition for this, it is simple:

The LLM is the brain.
The agent system gives it hands.

In engineering terms, those "hands" are tool interfaces plus a controller loop that executes calls and returns observations.

## Why Tools Matter

Tools are what make the Action step real.

Without tools, the model outputs text.
With tools, the system can search, read files, write files, run code, or call APIs.

Tools expand capability, but they also introduce boundaries and failure modes: permission errors, bad results, malformed outputs, and side effects.

That is why tools and permissions define both what the agent can do and what it is allowed to do.

## Introducing ReAct

So if the loop is the key idea, what is the simplest useful way to implement that loop?

ReAct.

ReAct stands for Reason and Act.

It is a simple pattern:

Thought.
Action.
Observation.

Then repeat.

The model produces a Thought: its current reasoning about what to do next.
Then it produces an Action: a tool call.
The runtime executes the tool and returns an Observation.
That observation goes back into the context, and the model decides the next step.

This is why ReAct is such a useful teaching model.
It makes the decision-action-observation loop explicit.

I want to be careful here: ReAct is not a claim that every modern production agent literally works this way or exposes visible reasoning traces.

It is the simplest useful model for understanding the loop.

## Simple ReAct Example

Let us use one concrete example that we can carry through the rest of the talk.

Suppose the goal is:

"Inspect this slide app, figure out how keyboard navigation works, and write a short markdown note."

Now the loop becomes concrete.

Thought: I need to find the relevant files.
Action: list files in the project.
Observation: I see a React app with `src/App.jsx`.

Thought: Keyboard navigation is probably implemented in `App.jsx`.
Action: open `src/App.jsx`.
Observation: I see the key handlers and references to slide state.

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
2. The model decides the next step.
3. If the next step is a tool call, the runtime executes it.
4. The result comes back as an observation.
5. The loop repeats until the agent reaches a final answer or hits a limit.

That limit might be based on iterations, tokens, time, or cost.
The exact stopping rule is an implementation detail.
The important point is that the loop is bounded and controlled.

## Demo Setup

Now let us watch the loop happen.

The prerecorded demo uses a small local slide app and only three tools:

List files.
Read file.
Write file.

The goal is the same as the example:

"Figure out how keyboard navigation works, then write a short markdown note."

Watch for two things:

First, one observation should change the next action.
Second, the run should end with a visible artifact: a real file written by the agent.

## Beyond ReAct

ReAct is not the whole field.

More advanced agents may add planning layers, memory, retries, structured outputs, guardrails, or multiple cooperating components.

But if you understand this loop, you understand the foundation those systems build on.

## Closing

So the core idea is simple.

A standalone LLM can describe actions.
An agent can take them.

The LLM decides.
The runtime executes.
Tools interact with the environment.
Observations close the loop.

That is why an LLM alone is not yet something like Codex.

And that is why building an agent is mostly about building the loop around the model, not just calling the model once.

Words describe.
Agents do.
