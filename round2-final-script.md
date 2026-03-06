# From LLM to Agent

## Opening

Imagine you hired the most brilliant employee you have ever met. They can read anything, explain anything, and describe exactly what needs to be done in precise, thoughtful detail.

You ask them to pull the latest pricing data and write up a summary. They say: "I would search the web, find the official page, read the numbers, and write the file."

And then they just sit there.

The model has no will, no persistent memory. It is the system around it that keeps the loop going — not the model's motivation, but the code.

Language alone does not change the world. That gap — between describing what to do and actually doing it — is what this talk is about.

## What Makes a System an Agent

So what closes that gap? What turns a language model into something that can act?

An agent is a system that receives information about its environment — or more precisely, a formatted representation of it — decides what to do, takes an action, and then observes what happened as a result. That cycle — think, act, observe — is the loop that defines agency. This is called the agent loop.

Notice what that definition includes: the model reasons, yes, but the system also executes and receives feedback. It is not just a prompt. It is not just a UI on top of a model. It is not just a longer context window. Those things alone do not make an agent. The loop is what makes an agent.

## Brain and Limbs Analogy

The model — the part that reasons — cannot actually run any of those steps except the thinking. Something else has to execute the rest. Here is a way to feel why that matters.

The LLM is like a brain. It thinks, it plans, it reasons through problems with remarkable fluency. But a brain in isolation cannot pick up a pen. It cannot open a browser. It cannot write a file to disk. The agent system is what gives the brain hands and legs — the means to reach out and change something in the world.

When the loop runs, you can almost picture it: the brain considers the situation, the hand reaches for a tool, something in the environment shifts, and the result comes back to the brain as new information. That cycle is exactly the Think-Act-Observe sequence — made physical.

## Why Tools Matter

Those hands and legs — in an actual agent system — are tools. Specific, callable functions the model can invoke and receive results from. Let us look at what that actually means.

Tools are what make the Action step in that loop real. Without tools, the model can only output text. With tools, it can reach beyond its context window and touch the world.

Take web search. The model does not know what the Anthropic API costs today. That information is not in its training data — or it may have changed since. But give the model a web search tool, and suddenly it can retrieve a live result, read it, and reason about it. The model's knowledge becomes current. That is not a small thing.

That reach is powerful. And because it is powerful, it has to be scoped.

And this is worth being precise about: an agent is not just about capability — it is also about controlled execution. The tools define what the agent can reach, and the permissions define what it is allowed to change. A well-designed agent system is not a model with unlimited access to everything. It is a model with a carefully scoped set of tools, operating within boundaries that a human designed intentionally.

## Introducing ReAct

We have talked about the loop in general terms. Now let us look at one specific pattern — ReAct — because it is the simplest design that makes the loop explicit and traceable.

ReAct stands for Reason and Act. It comes from a 2022 research paper, and the core idea is straightforward: you interleave the model's reasoning with its actions, step by step, so you can see the reasoning the model was prompted to produce before it acted.

The sequence looks like this. The model produces a Thought — a short statement of what it understands and what it intends to do next. Then it produces an Action — a specific tool call with specific parameters. The system executes that tool and returns an Observation. The observation is the result the tool returned, formatted by the system and fed back into the model's context as new input. Then the model produces the next Thought, and the cycle continues.

This matters because many tasks cannot be solved in one shot. Without observation, the model is reasoning in the dark — it cannot detect when a tool failed or when its plan needs to change. The observation is what closes the loop. ReAct makes that closure visible, which is why it is such a useful pattern for understanding how agents actually work.

## Simplest ReAct Workflow

So if we wanted to build the simplest possible ReAct agent, what would we need?

Four things. A model. A small set of tools. A loop controller — the code that runs the cycle. And a rule for when to stop — in practice, that means a maximum number of iterations or a token budget limit, not just waiting for the model to declare it is finished. Ten iterations is a common starting ceiling.

That is the whole machine.

Now here is how it runs.

First, the user gives a goal. Second, we ask the model what to do next. Third, if the model chooses a tool, our program executes it. Fourth, we take the result and feed it back as an observation. And we repeat — until the model produces a final answer, or we hit our iteration limit.

That is already enough to build a simple agent.

## Very Simple Example

Imagine the user asks: "Find the latest pricing for a model API and write a short summary into a markdown file."

Here is what happens.

Thought: I need current information. Action: call web search. Observation: search results returned.

Thought: I should open the official pricing page. Action: fetch the pricing page. Observation: page content received.

Thought: I have enough. I will write the summary now. Action: write `pricing-summary.md`. Observation: file saved successfully.

Done.

[SPEAKER NOTE — NOT SPOKEN — demo suggestion]

## What's Next Beyond ReAct

ReAct is one pattern. More advanced agents add memory so they are not stateless between tasks, structured planning so they can tackle multi-step goals without getting lost, and sometimes multiple cooperating agents. If you understand the loop, you understand the foundation all of those build on.

The log is equally useful when the run does not complete — you can see exactly where it stopped and why.

## Closing

So here is where we land.

That brilliant employee who could describe everything but do nothing? Give them the loop and they become something else entirely.

The LLM is the brain. Tools are the hands. Observations are how it learns what actually happened.

The loop is what makes it an agent.

If you want to start building, you do not need a complex framework. The Anthropic and OpenAI APIs both support tool-calling natively — you can wire up a loop yourself in a day, following the API documentation, and see exactly what is happening at every step. That is actually the best way to understand it.

Go build the loop.

---

## Round 2 Changes Summary

- **Opening restructured:** The label "this is a language model" and the corrective sentence ("The model has no will, no persistent memory...") now appear before the gap statement, so the punchline "And then they just sit there" lands cleanly before explanation continues.
- **Definitions softened and tightened:** "perceives its environment" replaced with "receives information about its environment — or more precisely, a formatted representation of it"; "simply" removed from the observation definition; philosophical framing around model reasoning replaced with "the reasoning the model was prompted to produce."
- **Structural transitions added:** Brain and Limbs section opens with a bridging sentence about what the model cannot do alone; Why Tools Matter opens with an explicit bridge naming tools as "hands and legs"; a hinge sentence before the permissions paragraph flags the scope requirement.
- **Workflow and stopping condition fixed:** Simplest ReAct Workflow rewritten as spoken beats with a concrete stopping condition (iteration limit or token budget, ten iterations as a ceiling) rather than the vague "model says it is done."
- **Closing tightened with callback:** The brilliant employee callback closes the circle from the opening; the summary compressed to three distinct percussive lines plus "The loop is what makes it an agent"; "an afternoon" replaced with "a day, following the API documentation."
