// ─── Shared diagram components ───────────────────────────────────────────────

function AgentLoopDiagram() {
  // Node centers and radius
  const r = 48
  const think   = { x: 160, y: 55,  color: '#4f9cf9', label: 'THINK',   sub: 'reason'   }
  const act     = { x: 270, y: 220, color: '#f97316', label: 'ACT',     sub: 'tool call' }
  const observe = { x: 50,  y: 220, color: '#22c55e', label: 'OBSERVE', sub: 'feedback'  }

  // Compute arrow endpoints at circle edges
  const edge = (from, to) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / len
    const ny = dy / len
    return {
      x1: from.x + nx * r,
      y1: from.y + ny * r,
      x2: to.x - nx * r,
      y2: to.y - ny * r,
    }
  }

  const arrows = [
    { ...edge(think, act),     id: 'think-act'     },
    { ...edge(act, observe),   id: 'act-observe'   },
    { ...edge(observe, think), id: 'observe-think' },
  ]

  return (
    <svg
      viewBox="0 0 325 285"
      width="100%"
      style={{ maxWidth: 300 }}
      data-testid="agent-loop-diagram"
      aria-label="Agent loop diagram: THINK leads to ACT, ACT leads to OBSERVE, OBSERVE leads back to THINK"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4d5b77" />
        </marker>
      </defs>

      {arrows.map((a) => (
        <line
          key={a.id}
          data-testid={`arrow-${a.id}`}
          x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
          stroke="#4d5b77" strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      ))}

      {[think, act, observe].map((n) => (
        <g key={n.label} data-testid={`node-${n.label.toLowerCase()}`}>
          <circle cx={n.x} cy={n.y} r={r} fill={`${n.color}1a`} stroke={n.color} strokeWidth="2" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fill={n.color} fontSize="11" fontWeight="bold">
            {n.label}
          </text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fill={n.color} fontSize="9" opacity="0.7">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ─── Slide 1: Title ───────────────────────────────────────────────────────────

function TitleSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-title">
      <div className="title-badge" data-testid="title-badge">
        10–15 min · Audience: software engineers new to agents
      </div>
      <h1 className="title-main" data-testid="title-heading">From LLM to Agent</h1>
      <p className="title-sub">
        Why an LLM can't act alone — and how the loop changes that
      </p>
      <div className="title-footer">
        <span className="key-hint-inline">← → or Space to navigate · N for speaker notes</span>
      </div>
    </div>
  )
}

// ─── Slide 2: Opening ─────────────────────────────────────────────────────────

function OpeningSlide() {
  return (
    <div className="slide" data-testid="slide-content-opening">
      <h2 className="slide-title">The Brilliant Employee</h2>
      <div className="opening-scene" data-testid="opening-scene">
        <p className="opening-setup">
          Imagine you hired the most brilliant employee you have ever met. They can read anything, explain
          anything, and describe exactly what needs to be done.
        </p>
        <blockquote className="opening-quote" data-testid="opening-quote">
          "I would search the web, find the official page, read the numbers, and write the file."
        </blockquote>
        <div className="opening-punchline" data-testid="opening-punchline">
          And then they just sit there.
        </div>
        <div className="opening-note" data-testid="opening-note">
          The model is not being stubborn — the system's design is why it stops.
        </div>
      </div>
    </div>
  )
}

// ─── Slide 3: The Gap ─────────────────────────────────────────────────────────

function GapSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-gap">
      <div className="impact-block" data-testid="impact-block">
        <div className="impact-line" data-testid="impact-line-1">
          Language alone does not change the world.
        </div>
        <div className="impact-line accent" data-testid="impact-line-2">
          Words describe. Agents do.
        </div>
      </div>
      <p className="gap-note" data-testid="gap-note">
        That gap — between describing what to do and actually doing it — is what this talk is about.
      </p>
    </div>
  )
}

// ─── Slide 4: Agent Definition ────────────────────────────────────────────────

function AgentDefinitionSlide() {
  return (
    <div className="slide slide--split" data-testid="slide-content-agent-definition">
      <div className="split-left">
        <h2 className="slide-title">What Makes a System an Agent?</h2>
        <p className="definition-text" data-testid="agent-definition-text">
          A system that receives information about its environment — the conversation so far, any tool
          results, instructions — decides what to do, takes an action, and then observes what happened.
        </p>
        <p className="loop-label">
          That cycle is the <strong>agent loop</strong>.
        </p>
        <div className="not-list" data-testid="not-list">
          <div className="not-item" data-testid="not-item-0">✗ Just a prompt</div>
          <div className="not-item" data-testid="not-item-1">✗ Just a UI on top of a model</div>
          <div className="not-item" data-testid="not-item-2">✗ Just a longer context window</div>
          <div className="not-item accent-item" data-testid="not-item-yes">
            ✓ Think · Act · Observe · repeat
          </div>
        </div>
      </div>
      <div className="split-right">
        <AgentLoopDiagram />
      </div>
    </div>
  )
}

// ─── Slide 5: Brain & Limbs ───────────────────────────────────────────────────

function BrainLimbsSlide() {
  return (
    <div className="slide slide--split" data-testid="slide-content-brain-limbs">
      <div className="split-left">
        <h2 className="slide-title">Brain and Limbs</h2>
        <p>
          The model can handle the reasoning — but not the acting or the observing.
          Something else has to execute those.
        </p>
        <blockquote className="analogy-quote" data-testid="analogy-quote">
          "The brain considers, the hand acts, the result returns. That is the loop."
        </blockquote>
      </div>
      <div className="split-right">
        <div className="brain-limbs-diagram" data-testid="brain-limbs-diagram">
          <div className="diagram-box brain-box" data-testid="diagram-brain">
            <div className="diagram-icon">🧠</div>
            <div className="diagram-label">LLM</div>
            <div className="diagram-desc">Thinks · Plans · Reasons</div>
            <div className="diagram-limit">Cannot act alone</div>
          </div>
          <div className="diagram-connector" aria-hidden="true">+</div>
          <div className="diagram-box limbs-box" data-testid="diagram-system">
            <div className="diagram-icon">⚙️</div>
            <div className="diagram-label">Agent System</div>
            <div className="diagram-desc">Executes · Observes · Loops</div>
            <div className="diagram-limit">Gives the brain hands and legs</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Slide 6: Why Tools Matter ────────────────────────────────────────────────

function ToolsSlide() {
  return (
    <div className="slide" data-testid="slide-content-tools">
      <h2 className="slide-title">Why Tools Matter</h2>
      <div className="tools-comparison" data-testid="tools-comparison">
        <div className="tools-col without" data-testid="tools-without">
          <div className="col-label">Without tools</div>
          <div className="col-value">Output text only</div>
        </div>
        <div className="tools-arrow" aria-hidden="true">→</div>
        <div className="tools-col with" data-testid="tools-with">
          <div className="col-label">With tools</div>
          <div className="col-value">Reach beyond the context window</div>
        </div>
      </div>
      <div className="tools-example" data-testid="tools-example">
        <span className="example-label">Example</span>
        <span className="example-text">
          Web search → the model's knowledge becomes <em>current</em>.
          It retrieves a live result, reads it, reasons about it.
        </span>
      </div>
      <div className="tools-principle" data-testid="tools-principle">
        <strong>Capability + controlled execution.</strong> The tools define what the agent can reach.
        Permissions define what it is allowed to change. A well-designed agent is scoped, not unlimited.
      </div>
    </div>
  )
}

// ─── Slide 7: Introducing ReAct ───────────────────────────────────────────────

function ReActSlide() {
  const steps = [
    { key: 'thought',     label: 'Thought',     cls: 'thought',     desc: 'Current reasoning and intended next action' },
    { key: 'action',      label: 'Action',      cls: 'action',      desc: 'Specific tool call with specific parameters' },
    { key: 'observation', label: 'Observation', cls: 'observation', desc: 'Tool result, fed back as new input to the model' },
  ]

  return (
    <div className="slide" data-testid="slide-content-react">
      <h2 className="slide-title">Introducing ReAct</h2>
      <div className="react-def" data-testid="react-definition">
        <span className="react-r">Re</span>ason +{' '}
        <span className="react-a">Act</span>
        <span className="react-year"> · 2022 paper · Google Brain</span>
      </div>
      <p className="react-desc">
        Interleave the model's reasoning with its actions — step by step — so you can see the reasoning
        before each action.
      </p>
      <div className="react-sequence" data-testid="react-sequence">
        {steps.map((s, i) => (
          <div key={s.key}>
            <div className={`seq-step ${s.cls}`} data-testid={`seq-step-${s.key}`}>
              <span className="seq-label">{s.label}</span>
              <span className="seq-desc">{s.desc}</span>
            </div>
            {i < steps.length - 1 && <div className="seq-arrow" aria-hidden="true">↓</div>}
          </div>
        ))}
        <div className="seq-arrow loop-arrow" aria-label="repeats">↑ repeat</div>
      </div>
    </div>
  )
}

// ─── Slide 8: Simplest Workflow ───────────────────────────────────────────────

function WorkflowSlide() {
  const components = [
    'A model',
    'A small set of tools',
    'A loop controller (the code that runs the cycle)',
    'A stop rule — max iterations or token budget',
  ]

  const steps = [
    'User gives a goal',
    'Ask the model what to do next',
    'If a tool is chosen, our code executes it',
    'Feed the result back as an observation (errors count too)',
    'Repeat until done or limit reached',
  ]

  return (
    <div className="slide slide--split" data-testid="slide-content-workflow">
      <div className="split-left">
        <h2 className="slide-title">Simplest ReAct Agent</h2>
        <div className="four-things" data-testid="four-things">
          <div className="thing-label">Four things you need:</div>
          {components.map((c, i) => (
            <div key={i} className="thing-item" data-testid={`thing-item-${i}`}>
              <span className="thing-num">{i + 1}</span>
              <span className="thing-text">{c}</span>
            </div>
          ))}
        </div>
        <div className="workflow-note" data-testid="workflow-note">
          Ten iterations is a common starting ceiling.
        </div>
      </div>
      <div className="split-right" style={{ alignItems: 'flex-start' }}>
        <div className="workflow-steps" data-testid="workflow-steps">
          <div className="thing-label" style={{ marginBottom: '0.5rem' }}>How it runs:</div>
          {steps.map((s, i) => (
            <div key={i} className="workflow-step" data-testid={`workflow-step-${i}`}>
              <span className="step-num">{i + 1}</span>
              <span className="step-text">{s}</span>
            </div>
          ))}
        </div>
        <div className="workflow-error-note" data-testid="workflow-error-note">
          If a tool call fails, the error message is the observation — and the model decides what to try next.
        </div>
      </div>
    </div>
  )
}

// ─── Slide 9: Example Trace ───────────────────────────────────────────────────

function ExampleSlide() {
  const trace = [
    {
      thought: 'I need current information.',
      action:  'web_search("anthropic api pricing 2024")',
      obs:     'Search results returned.',
    },
    {
      thought: 'I should read the official pricing page.',
      action:  'fetch_page("https://...")',
      obs:     'Page content received.',
    },
    {
      thought: 'I have enough. Writing the summary now.',
      action:  'write_file("pricing-summary.md", content)',
      obs:     'System confirms: file saved.',
    },
  ]

  return (
    <div className="slide" data-testid="slide-content-example">
      <h2 className="slide-title">Example Trace</h2>
      <div className="trace-prompt" data-testid="trace-prompt">
        "Find the latest pricing for a model API and write a short summary into a markdown file."
      </div>
      <div className="trace-container" data-testid="trace-container">
        {trace.map((step, i) => (
          <div key={i} className="trace-step" data-testid={`trace-step-${i}`}>
            <div className="trace-row trace-thought">
              <span className="trace-label thought-label">Thought</span>
              <span className="trace-value">{step.thought}</span>
            </div>
            <div className="trace-row trace-action">
              <span className="trace-label action-label">Action</span>
              <code className="trace-value">{step.action}</code>
            </div>
            <div className="trace-row trace-obs">
              <span className="trace-label obs-label">Obs</span>
              <span className="trace-value">{step.obs}</span>
            </div>
          </div>
        ))}
        <div className="trace-done" data-testid="trace-done">→ Done.</div>
      </div>
      <p className="trace-note" data-testid="trace-note">
        Equally useful when it fails — you can see exactly where it stopped and why.
      </p>
    </div>
  )
}

// ─── Slide 10: Demo (placeholder) ────────────────────────────────────────────

function DemoSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-demo">
      <h2 className="slide-title">Demo</h2>
      <div className="demo-placeholder" data-testid="demo-placeholder">
        <div className="demo-icon" aria-hidden="true">▶</div>
        <div className="demo-label">[ Demo: ReAct Agent solving a real task ]</div>
        <div className="demo-desc">
          A simple agent uses web search and file write to summarize current API pricing.
          Watch the Thought / Action / Observation trace in real time.
        </div>
        <div className="demo-note">Placeholder — record and embed demo video here</div>
      </div>
    </div>
  )
}

// ─── Slide 11: What's Next ────────────────────────────────────────────────────

function WhatsNextSlide() {
  const items = [
    { icon: '🧠', label: 'Memory',          desc: 'Not stateless between tasks',                    testid: 'next-memory'    },
    { icon: '📋', label: 'Planning layers', desc: 'Plan-and-execute, hierarchical planning',         testid: 'next-planning'  },
    { icon: '🤝', label: 'Multi-agent',     desc: 'Cooperating specialized agents',                  testid: 'next-multiagent'},
  ]

  return (
    <div className="slide slide--center" data-testid="slide-content-whats-next">
      <h2 className="slide-title">Beyond ReAct</h2>
      <div className="next-items" data-testid="next-items">
        {items.map((item) => (
          <div key={item.label} className="next-item" data-testid={item.testid}>
            <div className="next-icon" aria-hidden="true">{item.icon}</div>
            <div className="next-label">{item.label}</div>
            <div className="next-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <p className="next-note" data-testid="next-note">
        If you understand the loop, you understand the foundation all of these build on.
      </p>
    </div>
  )
}

// ─── Slide 12: Closing ────────────────────────────────────────────────────────

function ClosingSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-closing">
      <div className="closing-tagline" data-testid="closing-tagline">
        Words describe. Agents do.
      </div>
      <div className="closing-summary" data-testid="closing-summary">
        <div className="summary-item" data-testid="summary-brain">
          <span className="summary-key">Brain</span> The LLM reasons
        </div>
        <div className="summary-item" data-testid="summary-hands">
          <span className="summary-key">Hands</span> Tools act
        </div>
        <div className="summary-item" data-testid="summary-feedback">
          <span className="summary-key">Feedback</span> Observations close the loop
        </div>
      </div>
      <div className="closing-cta" data-testid="closing-cta">
        <div className="cta-main">Go build the loop.</div>
        <div className="cta-sub">
          Anthropic and OpenAI APIs support tool-calling natively.
          Wire up the loop yourself in a day — you'll understand every step.
        </div>
      </div>
    </div>
  )
}

// ─── Slide definitions ────────────────────────────────────────────────────────

export const slides = [
  {
    id: 'title',
    title: 'Title',
    component: TitleSlide,
    notes: `Welcome. This is a 10–15 minute talk.

Audience: software engineers familiar with LLMs (you've used ChatGPT, maybe the API), but who have not yet built agents.

Goal: leave with a clear mental model of the agent loop — Think, Act, Observe — and confidence to wire one up themselves.

No code required in the talk itself. The demo is the code moment.`,
  },
  {
    id: 'opening',
    title: 'The Brilliant Employee',
    component: OpeningSlide,
    notes: `Set the scene slowly. Let the audience picture the employee.

Pause after "write the file." — let them hear the promise.

Pause again after "And then they just sit there." — let the punchline land before explaining it.

The correction ("not being stubborn") is important: the model isn't broken. It's doing exactly what it was designed to do. The system around it is what's missing.`,
  },
  {
    id: 'gap',
    title: 'The Gap',
    component: GapSlide,
    notes: `This is the thesis of the entire talk. Say it slowly.

"Language alone does not change the world." — this has always been true. Writing a to-do list doesn't do the dishes.

"Words describe. Agents do." — this is the transition. We're about to explain what 'doing' requires.

The gap sentence names the subject of the talk. Everything that follows fills it.`,
  },
  {
    id: 'agent-definition',
    title: 'What Makes an Agent',
    component: AgentDefinitionSlide,
    notes: `Definition first. The audience is engineers — give them the precise term before the analogy.

Stress the three-part cycle on the diagram: THINK → ACT → OBSERVE → repeat. Every agent, from the simplest to the most complex, runs this cycle.

The NOT list is important for Java/Spring or React devs: an agent is not just a chatbot with a bigger prompt. It's not RAG. It's not a fine-tuned model. The loop is the differentiator.`,
  },
  {
    id: 'brain-limbs',
    title: 'Brain and Limbs',
    component: BrainLimbsSlide,
    notes: `The analogy gives the definition a physical feel.

LLM = brain: brilliant, fast, but completely passive without a body.
Agent system = the body: executes the decisions, feeds back what happened.

The brain considers → the hand acts → the result returns. That is the loop, made physical.

This sets up the tools section: "the hands" are the tools.`,
  },
  {
    id: 'tools',
    title: 'Why Tools Matter',
    component: ToolsSlide,
    notes: `Tools are the concrete implementation of "hands." They're just functions — callable, typed, with defined inputs and outputs.

The web search example is the most intuitive: the model's training data has a cutoff. A tool gives it live data. That's real, immediate value any dev can picture.

The permissions point is worth emphasizing to engineers: this is where you design the blast radius. An agent that can only read is very different from one that can write and delete.`,
  },
  {
    id: 'react-pattern',
    title: 'Introducing ReAct',
    component: ReActSlide,
    notes: `ReAct is a specific, published pattern from a 2022 Google Brain paper ("ReAct: Synergizing Reasoning and Acting in Language Models").

The key insight: by making reasoning explicit (the Thought step), you get a trace you can read. You can see why the model made each decision.

For engineers: this is like structured logging for agent behavior. You can debug it. You can audit it. You can replay it.

The observation step is what closes the loop — without it, the model is just guessing.`,
  },
  {
    id: 'workflow',
    title: 'Simplest ReAct Workflow',
    component: WorkflowSlide,
    notes: `Four things, five steps. That is genuinely all you need to build a working ReAct agent.

The stop rule is often underemphasized in tutorials. Do NOT wait for the model to declare it's done — set a hard ceiling. 10 iterations is a good start. Increase as you understand the task.

The error handling note is key: a failed tool call is still useful data. The model sees the error, reasons about it, and decides what to try next. This is why observation matters even on failure.`,
  },
  {
    id: 'example',
    title: 'Example Trace',
    component: ExampleSlide,
    notes: `Walk through each Thought/Action/Observation step slowly. Point to the label as you read.

The audience should be thinking: "I could read this output. I could understand what the agent was doing at each step."

The trace format is the product of using ReAct. This is what you see in the terminal when you run a real agent.

After this slide: segue to demo. "Let me show you this running for real."

The failure note is worth saying aloud: "If it stops at step 2, you know exactly what went wrong."`,
  },
  {
    id: 'demo',
    title: 'Demo',
    component: DemoSlide,
    notes: `PLACEHOLDER — record a live terminal demo of a ReAct agent:
- Task: "Find the latest Anthropic API pricing and write a markdown summary."
- Tools: web_search, fetch_page, write_file
- Show the raw Thought/Action/Observation output in the terminal

Target: 2–3 minutes of recording.

Fallback: if playback fails, have a screenshot sequence of the terminal output ready.

After the demo: "That trace is what you just saw on the previous slide — running for real."`,
  },
  {
    id: 'whats-next',
    title: 'Beyond ReAct',
    component: WhatsNextSlide,
    notes: `This is intentionally brief. The talk's scope is the foundation — the loop.

Memory: agents can store results, facts, and context across multiple runs so they're not starting from zero each time.

Planning layers: instead of a flat loop, a planner model generates a structured task sequence upfront. An executor works through it. This is the plan-and-execute pattern.

Multi-agent: multiple specialized agents, each with its own tools and loop, coordinating toward a shared goal. The foundation is still the same loop.

If you understand the loop, every advanced pattern is just a variation on it.`,
  },
  {
    id: 'closing',
    title: 'Closing',
    component: ClosingSlide,
    notes: `Come back to the employee from the opening. They couldn't act before. Now they can.

"Words describe. Agents do." — this closes the loop opened by the gap slide.

The three-line summary (Brain / Hands / Feedback) is the take-home model. Repeatable, memorable, correct.

"Go build the loop." — specific and actionable. Not "explore agents" or "consider AI." Build the loop. Today.

Mention: both Anthropic and OpenAI tool-calling APIs are stable, well-documented, and free to start. The code is maybe 50 lines. The understanding is worth far more.`,
  },
]
