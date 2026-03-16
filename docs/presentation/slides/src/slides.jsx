import { useEffect, useRef } from 'react'
import recordingScreenshot from '../Screenshot_20260309_204351.png'
import { DEMO_DATA } from './demo-recording.js'
import { GLOBAL_DEMO } from './demo-recording-global.js'

// ─── Shared diagram components ───────────────────────────────────────────────

function AgentLoopDiagram() {
  const think = { x: 122, y: 18, w: 116, h: 52, color: '#4f9cf9', label: 'Think', sub: 'decide' }
  const act = { x: 220, y: 154, w: 116, h: 52, color: '#f97316', label: 'Act', sub: 'tool use' }
  const observe = { x: 24, y: 154, w: 116, h: 52, color: '#22c55e', label: 'Observe', sub: 'feedback' }

  const edge = (from, to, fromSide, toSide) => {
    const start = {
      left: { x: from.x, y: from.y + from.h / 2 },
      right: { x: from.x + from.w, y: from.y + from.h / 2 },
      top: { x: from.x + from.w / 2, y: from.y },
      bottom: { x: from.x + from.w / 2, y: from.y + from.h },
    }[fromSide]
    const end = {
      left: { x: to.x, y: to.y + to.h / 2 },
      right: { x: to.x + to.w, y: to.y + to.h / 2 },
      top: { x: to.x + to.w / 2, y: to.y },
      bottom: { x: to.x + to.w / 2, y: to.y + to.h },
    }[toSide]
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2
    return `M ${start.x} ${start.y} Q ${midX} ${midY}, ${end.x} ${end.y}`
  }

  const arrows = [
    { d: edge(think, act, 'bottom', 'top'), id: 'think-act' },
    { d: edge(act, observe, 'left', 'right'), id: 'act-observe' },
    { d: edge(observe, think, 'top', 'left'), id: 'observe-think' },
  ]

  return (
    <svg
      viewBox="0 0 360 236"
      width="100%"
      style={{ maxWidth: 360 }}
      data-testid="agent-loop-diagram"
      aria-label="Agent loop diagram: Think leads to Act, Act leads to Observe, Observe leads back to Think"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#3a79d7" />
        </marker>
      </defs>

      {arrows.map((a) => (
        <path
          key={a.id}
          data-testid={`arrow-${a.id}`}
          d={a.d}
          fill="none"
          stroke="#3a79d7"
          strokeWidth="2.6"
          markerEnd="url(#arrow)"
        />
      ))}

      {[think, act, observe].map((n) => {
        const cx = n.x + n.w / 2
        const cy = n.y + n.h / 2
        return (
          <g key={n.label} data-testid={`node-${n.label.toLowerCase()}`}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="16" fill="#11192b" stroke={n.color} strokeWidth="2.4" />
            <text x={cx} y={cy - 2} textAnchor="middle" fill={n.color} fontSize="13" fontWeight="700">
              {n.label}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={n.color} fontSize="9.5" opacity="0.78">
              {n.sub}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Fragment helper ─────────────────────────────────────────────────────────

function Fragment({ index, visible, className = '', style, children }) {
  const show = visible >= index
  return (
    <div className={`fragment${show ? ' visible' : ''} ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

function SlideJumpLink({ targetId, children, className = '', testId }) {
  const handleClick = (e) => {
    e.preventDefault()
    window.__presentation?.goToId(targetId)
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`slide-jump-link ${className}`.trim()}
      data-testid={testId}
    >
      {children}
    </a>
  )
}

const DEMO_FINAL_ANSWER = 'Tuesday, March 10 or Wednesday, March 11, 2026 at 10:00 AM New York / 2:00 PM London.'
const DEMO_FINAL_REASONING = [
  'I now have enough evidence to recommend.',
  '',
  'Reasoning:',
  '- There are no public holiday conflicts next week in either country.',
  '- After the US daylight-saving change, 10:00 AM New York becomes 2:00 PM London.',
  '- That keeps New York out of early morning and London out of late afternoon.',
  '- Tuesday and Wednesday are stronger than Monday ramp-up or Friday wind-down.',
].join('\n')

const DEMO_REVEAL_SEQUENCE = [
  { step: 0, stage: 'thought' },
  { step: 0, stage: 'result' },
  { step: 1, stage: 'thought' },
  { step: 1, stage: 'result' },
  { step: 2, stage: 'thought' },
  { step: 2, stage: 'answer' },
]

function getCurrentDemoFrame(visibleFragments = 0) {
  if (visibleFragments <= 0) return { step: -1, stage: 'idle' }
  const idx = Math.min(visibleFragments, DEMO_REVEAL_SEQUENCE.length) - 1
  return DEMO_REVEAL_SEQUENCE[idx]
}

function getDemoStepStage(stepIndex, visibleFragments = 0) {
  const frame = getCurrentDemoFrame(visibleFragments)
  if (frame.step === -1) return 'hidden'
  if (stepIndex < frame.step) return stepIndex === DEMO_DATA.steps.length - 1 ? 'answer' : 'result'
  if (stepIndex > frame.step) return 'hidden'
  return frame.stage
}

function getVisibleDemoCalls(visibleFragments = 0) {
  if (visibleFragments <= 0) return 0
  return Math.min(Math.floor(visibleFragments / 2), DEMO_DATA.steps.length)
}

// ─── ReAct loop diagram (Slide 5) ────────────────────────────────────────────

function ReActLoopDiagram({ visibleFragments = 0 }) {
  return (
    <svg
      viewBox="0 0 500 320"
      width="100%"
      style={{ maxWidth: 450 }}
      className="react-loop-svg"
      data-testid="react-loop-diagram"
      aria-label="ReAct loop: Thought leads to Action, Action leads to Observation, Observation leads back to Thought, with an optional final answer exit"
    >
      <defs>
        <marker id="arr-think" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4f9cf9" />
        </marker>
        <marker id="arr-act" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
        </marker>
        <marker id="arr-obs" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
        </marker>
        <radialGradient id="glow-think" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4f9cf9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f9cf9" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="glow-act" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="glow-obs" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Arrow: Thought → Action */}
      <path
        d="M 231 112 Q 320 120, 309 213"
        className={`react-arrow${visibleFragments >= 2 ? ' visible' : ''}`}
        stroke="#4f9cf9" strokeWidth="2.5" fill="none"
        markerEnd="url(#arr-think)"
      />
      {/* Arrow: Action → Observation */}
      <path
        d="M 290 252 Q 200 305, 110 252"
        className={`react-arrow${visibleFragments >= 3 ? ' visible' : ''}`}
        stroke="#f97316" strokeWidth="2.5" fill="none"
        markerEnd="url(#arr-act)"
      />
      {/* Arrow: Observation → Thought */}
      <path
        d="M 91 213 Q 80 120, 169 112"
        className={`react-arrow${visibleFragments >= 3 ? ' visible' : ''}`}
        stroke="#22c55e" strokeWidth="2.5" fill="none"
        markerEnd="url(#arr-obs)"
      />
      {/* Exit: Thought → Answer */}
      <path
        d="M 256 72 Q 306 48, 336 66"
        className={`react-arrow react-arrow--answer${visibleFragments >= 4 ? ' visible' : ''}`}
        stroke="#facc15" strokeWidth="2.5" fill="none"
        markerEnd="url(#arr-think)"
      />

      {/* Node: Thought */}
      <g className={`react-node${visibleFragments >= 1 ? ' visible' : ''}`}>
        <circle cx="200" cy="72" r="58" fill="#4f9cf9" opacity="0.06" />
        <circle cx="200" cy="72" r="50" fill="url(#glow-think)" stroke="#4f9cf9" strokeWidth="2.5" />
        <text x="200" y="68" textAnchor="middle" fill="#4f9cf9" fontSize="14" fontWeight="bold">Thought</text>
        <text x="200" y="84" textAnchor="middle" fill="#4f9cf9" fontSize="10" opacity="0.7">decide</text>
      </g>

      {/* Node: Action */}
      <g className={`react-node${visibleFragments >= 2 ? ' visible' : ''}`}>
        <circle cx="340" cy="252" r="58" fill="#f97316" opacity="0.06" />
        <circle cx="340" cy="252" r="50" fill="url(#glow-act)" stroke="#f97316" strokeWidth="2.5" />
        <text x="340" y="248" textAnchor="middle" fill="#f97316" fontSize="14" fontWeight="bold">Action</text>
        <text x="340" y="264" textAnchor="middle" fill="#f97316" fontSize="10" opacity="0.7">tool call</text>
      </g>

      {/* Node: Observation */}
      <g className={`react-node${visibleFragments >= 3 ? ' visible' : ''}`}>
        <circle cx="60" cy="252" r="58" fill="#22c55e" opacity="0.06" />
        <circle cx="60" cy="252" r="50" fill="url(#glow-obs)" stroke="#22c55e" strokeWidth="2.5" />
        <text x="60" y="248" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">Observation</text>
        <text x="60" y="264" textAnchor="middle" fill="#22c55e" fontSize="10" opacity="0.7">feedback</text>
      </g>

      <g className={`react-node react-node--answer${visibleFragments >= 4 ? ' visible' : ''}`}>
        <rect x="336" y="36" width="120" height="68" rx="16" fill="rgba(250, 204, 21, 0.08)" stroke="#facc15" strokeWidth="2.2" />
        <text x="396" y="61" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="bold">Final Answer</text>
        <text x="396" y="78" textAnchor="middle" fill="#facc15" fontSize="9.5" opacity="0.8">stop when</text>
        <text x="396" y="91" textAnchor="middle" fill="#facc15" fontSize="9.5" opacity="0.8">evidence is enough</text>
      </g>
    </svg>
  )
}

// ─── Slide 1: Title ───────────────────────────────────────────────────────────

function TitleSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-title">
      <h1 className="title-main" data-testid="title-heading">From LLM to Agent</h1>
      <p className="title-sub">
        Why tool loops matter more than one smart model call
      </p>
    </div>
  )
}

// ─── Slide 2: Screenshot Cold Open ──────────────────────────────────────────

function OpeningSlide({ visibleFragments = 0 }) {
  return (
    <div className="slide slide--split cold-open-slide" data-testid="slide-content-opening">
      <div className="cold-open-visual">
        <div className="phone-shot" data-testid="cold-open-shot">
          <img
            className="phone-shot-image"
            src={recordingScreenshot}
            alt="Chat screenshot where an assistant claims it is recording a meeting, then later admits it cannot actually record."
          />
        </div>
      </div>
      <div className="cold-open-copy">
        <h2 className="cold-open-title">It said it was recording.</h2>
      </div>
    </div>
  )
}

// ─── Slide 3: Tools Matter ──────────────────────────────────────────────────

function ToolsMatterSlide({ visibleFragments = 0 }) {
  return (
    <div className="slide" data-testid="slide-content-tools-matter">
      <h2 className="slide-title">What Was Missing?</h2>
      <div className="tools-bridge-statement">Text about action is not the action.</div>
      <div className="tools-bridge-comparison">
        <div className="tools-bridge-card" data-testid="tools-bridge-llm">
          <div className="contrast-label">Standalone LLM</div>
          <div className="tools-bridge-flow">"I&apos;m recording."</div>
        </div>
        <Fragment index={1} visible={visibleFragments} className="tools-bridge-card tools-bridge-card--active">
          <div className="contrast-label">Tool-Enabled System</div>
          <div className="tools-bridge-flow tools-bridge-flow--stack">
            <span className="tools-bridge-chip">startRecorder()</span>
            <span className="contrast-arrow">→</span>
            <span className="tools-bridge-chip">recording_id</span>
            <span className="contrast-arrow">→</span>
            <span className="tools-bridge-chip">observe status</span>
          </div>
        </Fragment>
      </div>
    </div>
  )
}

// ─── Slide 3: Agent Definition ───────────────────────────────────────────────

function AgentDefinitionSlide({ visibleFragments = 0 }) {
  return (
    <div className="slide definition-slide" data-testid="slide-content-agent-definition">
      <div className="definition-header">
        <div className="slide-kicker">The Boundary</div>
        <h2 className="slide-title">Agent = Model + Tools + Loop</h2>
        <p className="definition-summary">
          Same model, different runtime: one stops at fluent text, the other keeps touching the world until it can answer.
        </p>
      </div>
      <div className="definition-stage" data-testid="agent-contrast">
        <div className="definition-panel definition-panel--llm" data-testid="contrast-llm">
          <div className="contrast-label">Model Only</div>
          <div className="definition-lane">
            <div className="definition-node">Prompt</div>
            <div className="definition-arrow" aria-hidden="true">→</div>
            <div className="definition-node">Model</div>
            <div className="definition-arrow" aria-hidden="true">→</div>
            <div className="definition-node">Text Reply</div>
          </div>
          <div className="definition-note">One polished response, then stop.</div>
        </div>
        <div className="definition-panel definition-panel--agent" data-testid="contrast-agent">
          <div className="contrast-label">Agent System</div>
          <div className="definition-lane definition-lane--agent">
            <div className="definition-node definition-node--agent">Goal</div>
            <div className="definition-arrow definition-arrow--agent" aria-hidden="true">→</div>
            <div className="definition-node definition-node--agent definition-node--loop">
              <span className="definition-node-main">Tool + Feedback</span>
              <span className="definition-node-sub">loop</span>
            </div>
            <div className="definition-arrow definition-arrow--agent" aria-hidden="true">→</div>
            <div className="definition-node definition-node--agent">Answer</div>
          </div>
          <div className="definition-note">The middle loop can keep running until the evidence is good enough.</div>
        </div>
      </div>
      <Fragment index={1} visible={visibleFragments} className="definition-footer">
        <div className="definition-footer-item"><strong>Model</strong> chooses the next move</div>
        <div className="definition-footer-item"><strong>Tools</strong> make contact with the environment</div>
        <div className="definition-footer-item"><strong>Feedback</strong> decides whether to continue or answer</div>
      </Fragment>
    </div>
  )
}

// ─── Slide 4: ReAct ──────────────────────────────────────────────────────────

function ReActSlide({ visibleFragments = 0 }) {
  const steps = [
    { key: 'thought', label: 'Thought', cls: 'thought', desc: 'explicit decision step', frag: 1 },
    { key: 'action', label: 'Action', cls: 'action', desc: 'tool call or structured operation', frag: 2 },
    { key: 'observation', label: 'Observation', cls: 'observation', desc: 'new evidence from the outside world', frag: 3 },
    { key: 'finish', label: 'Final Answer', cls: 'finish', desc: 'stop when there is enough evidence', frag: 4 },
  ]

  return (
    <div className="slide slide--split react-slide" data-testid="slide-content-react-pattern">
      <div className="split-left">
        <h2 className="slide-title">Introducing ReAct</h2>
        <div className="react-def" data-testid="react-definition">
          <span className="react-r">Re</span>ason + <span className="react-a">Act</span>
        </div>
        <p className="react-desc react-desc--lead">
          ReAct is a bounded loop: decide, do something, inspect what came back, then either continue or answer.
        </p>
        <div className="react-sequence" data-testid="react-sequence">
          {steps.map((s) => (
            <Fragment key={s.key} index={s.frag} visible={visibleFragments}>
              <div className={`seq-step ${s.cls}`} data-testid={`seq-step-${s.key}`}>
                <span className="seq-label">{s.label}</span>
                <span className="seq-desc">{s.desc}</span>
              </div>
            </Fragment>
          ))}
        </div>
        <p className="react-desc react-desc--footnote">
          Many production systems use structured tool calls rather than free-form traces, but the loop is the same.
        </p>
      </div>
      <div className="split-right react-visual-col">
        <ReActLoopDiagram visibleFragments={visibleFragments} />
        <Fragment index={4} visible={visibleFragments} className="react-stop-note">
          In common ReAct-style prompting, the loop ends with a terminal move like <code>Finish[...]</code> or a final answer.
        </Fragment>
      </div>
    </div>
  )
}

// ─── Slide 5: Lookup vs Recommendation ──────────────────────────────────────

function SmallExampleSlide({ visibleFragments = 0 }) {
  return (
    <div className="slide example-slide" data-testid="slide-content-small-example">
      <h2 className="slide-title example-heuristic-title">
        If you can write the decision tree, you don&apos;t need an agent.
      </h2>
      <Fragment index={1} visible={visibleFragments} className="example-gate-wrap">
        <svg className="example-gate-svg" viewBox="0 0 600 132" fill="none" aria-hidden="true">
          <defs>
            <marker id="eg-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0.5 L6,3.5 L0,6.5 Z" fill="#2a3550" />
            </marker>
          </defs>
          <polygon points="300,12 444,52 300,92 156,52" stroke="#2a3550" strokeWidth="1.5" fill="rgba(22,28,44,0.85)" />
          <text x="300" y="47" textAnchor="middle" fill="#7d8ba1" fontSize="12" fontFamily="inherit">Can you write the decision tree</text>
          <text x="300" y="63" textAnchor="middle" fill="#7d8ba1" fontSize="12" fontFamily="inherit">before you write the code?</text>
          <line x1="300" y1="92" x2="300" y2="106" stroke="#2a3550" strokeWidth="1.5" />
          <path d="M 300 106 Q 216 114 136 124" stroke="#2a3550" strokeWidth="1.5" markerEnd="url(#eg-arr)" />
          <path d="M 300 106 Q 384 114 464 124" stroke="#2a3550" strokeWidth="1.5" markerEnd="url(#eg-arr)" />
          <text x="176" y="114" textAnchor="middle" fill="#7d8ba1" fontSize="10.5" fontFamily="inherit" fontWeight="600">Yes</text>
          <text x="148" y="128" textAnchor="middle" fill="#4f9cf9" fontSize="10" fontFamily="inherit">no agent needed</text>
          <text x="424" y="114" textAnchor="middle" fill="#7d8ba1" fontSize="10.5" fontFamily="inherit" fontWeight="600">No</text>
          <text x="452" y="128" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="inherit">agent is justified</text>
        </svg>
      </Fragment>
      <div className="example-contrast" data-testid="example-contrast">
        <div className="example-card" data-testid="example-card-lookup">
          <div className="contrast-label">Fact Retrieval</div>
          <div className="example-card-title">"How old is NVIDIA&apos;s CEO?"</div>
          <div className="example-flow">
            <span className="example-flow-chip">retrieve</span>
            <span className="contrast-arrow">→</span>
            <span className="example-flow-chip">compute</span>
            <span className="contrast-arrow">→</span>
            <span className="example-flow-chip">answer</span>
          </div>
          <div className="example-card-point">Clear missing fact</div>
          <div className="example-card-point">Retrieve, then answer</div>
          <div className="example-stop">Stop when the fact is found.</div>
        </div>
        <div className="example-card example-card--agent" data-testid="example-card-agent">
          <div className="contrast-label">Decision Under Constraints</div>
          <div className="example-card-title">"Find a good meeting time next week."</div>
          <div className="example-flow">
            <span className="example-flow-chip">criteria</span>
            <span className="contrast-arrow">→</span>
            <span className="example-flow-chip">evidence</span>
            <span className="contrast-arrow">→</span>
            <span className="example-flow-chip">recommend</span>
          </div>
          <div className="example-card-point">Several constraints, not one missing fact</div>
          <div className="example-card-point">Gather evidence, then weigh tradeoffs</div>
          <div className="example-stop example-stop--agent">Stop when the system can defend the recommendation.</div>
        </div>
      </div>
      <div className="example-footer-note">The left case passes this test. The right case does not.</div>
    </div>
  )
}

// ─── Slide 7: Minimal Runtime ───────────────────────────────────────────────

function WorkflowSlide({ visibleFragments = 0 }) {
  const components = [
    'Thought / Answer = Model',
    'Action = Tools',
    'Observation = Feedback',
    'Continue / Stop = Controller',
  ]

  return (
    <div className="slide slide--center runtime-slide" data-testid="slide-content-workflow">
      <h2 className="slide-title">A Minimal Runtime</h2>
      <div className="runtime-summary">An agent runtime is a bounded tool loop.</div>
      <div className="runtime-grid" data-testid="four-things">
        {components.map((c, i) => (
          <div key={i} className="runtime-card" data-testid={`thing-item-${i}`}>
            <span className="runtime-card-num">{i + 1}</span>
            <span className="runtime-card-text">{c}</span>
          </div>
        ))}
      </div>
      <Fragment index={1} visible={visibleFragments} className="runtime-footer" data-testid="workflow-note">
        User gives a goal. The model chooses. The runtime executes, observes, and stops on a limit.
      </Fragment>
    </div>
  )
}

// ─── Slide 6: Demo (Prompt + Fake TTY + Cost Meter) ────────────────────────

const AGENT_CODE = `# ── The Prompt: everything the model needs ────────────
prompt = """
You are a scheduling assistant.
Think step-by-step. Always check timezone offsets AND holidays.

You have these tools:
  get_timezone_info(timezone) -> current time & UTC offset
  get_public_holidays(country, year) -> holiday list

To use a tool, respond with:
  Thought: <your reasoning>
  Action: <tool_name>(args)

When done, respond with:
  Thought: <your reasoning>
  Answer: <final recommendation>

User request: {USER_REQUEST}
"""

# ── The Loop ──────────────────────────────────────────
messages = [prompt]

while True:
    response = llm(messages)

    thought = parse_thought(response)
    action = parse_action(response)

    if not action:
        print("Final answer:", response)
        break

    observation = execute(action)
    messages += [thought, action, observation]`

function FakeTTY({ steps, visibleSteps, visibleFragments, prompt, stagedReveal = false, finalAnswer }) {
  const bodyRef = useRef(null)
  const stepRef = useRef(null)
  const frame = stagedReveal ? getCurrentDemoFrame(visibleFragments) : { step: visibleSteps - 1, stage: 'result' }

  useEffect(() => {
    if (bodyRef.current) {
      if ((stagedReveal && visibleFragments === 0) || (!stagedReveal && visibleSteps === 0)) {
        bodyRef.current.scrollTo({ top: 0 })
      } else if (stepRef.current) {
        const body = bodyRef.current
        const step = stepRef.current
        const top = step.offsetTop - body.offsetTop
        body.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }, [frame.step, stagedReveal, visibleFragments, visibleSteps])

  const truncate = (text, maxLines = 8) => {
    const lines = text.split('\n')
    if (lines.length <= maxLines) return text
    return lines.slice(0, maxLines).join('\n') + '\n  ...'
  }

  return (
    <div className="fake-tty">
      <div className="tty-titlebar">
        <span className="tty-dot tty-dot--red" />
        <span className="tty-dot tty-dot--yellow" />
        <span className="tty-dot tty-dot--green" />
        <span className="tty-titlebar-text">python react_agent.py</span>
      </div>
      <div className="tty-body" ref={bodyRef}>
        <div className="tty-prompt">
          <span className="tty-prompt-label">$</span>
          <span className="tty-prompt-text">{prompt}</span>
        </div>
        {steps.map((step, i) => {
          const stage = stagedReveal ? getDemoStepStage(i, visibleFragments) : (i + 1 <= visibleSteps ? 'result' : 'hidden')
          if (stage === 'hidden') return null
          const blocks = stage === 'thought'
            ? step.blocks.filter((block) => block.type === 'thought').slice(0, 1)
            : step.blocks

          return (
            <div
              key={step.step}
              className={`tty-step tty-step--${stage}`}
              ref={frame.step === i || (!stagedReveal && i + 1 === visibleSteps) ? stepRef : undefined}
            >
              <div className="tty-step-header">Step {step.step}</div>
              {blocks.map((block, j) => {
                if (block.type === 'thought') {
                  const thoughtText = stagedReveal && i === steps.length - 1
                    ? DEMO_FINAL_REASONING
                    : block.text
                  const thoughtMaxLines = i === steps.length - 1
                    ? stage === 'thought' ? 14 : 6
                    : 4
                  return (
                    <div key={j} className="tty-thought">
                      <span className="tty-label">Thought:</span>
                      <span className="tty-text">{truncate(thoughtText, thoughtMaxLines)}</span>
                    </div>
                  )
                }
                if (block.type === 'action') {
                  return (
                    <div key={j} className="tty-action">
                      <span className="tty-label">Action:</span>
                      <span className="tty-text">{block.tool}({block.args})</span>
                    </div>
                  )
                }
                if (block.type === 'observation') {
                  return (
                    <div key={j} className="tty-observation">
                      <span className="tty-label">Observation:</span>
                      <pre className="tty-text tty-pre">{truncate(block.text)}</pre>
                    </div>
                  )
                }
                return null
              })}
              {stage === 'answer' && finalAnswer && (
                <div className="tty-answer">
                  <span className="tty-label">Final Answer:</span>
                  <span className="tty-text">{finalAnswer}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DemoPhaseTracker({ visibleFragments = 0 }) {
  const frame = getCurrentDemoFrame(visibleFragments)
  const currentStep = frame.step >= 0 ? `Step ${frame.step + 1} of ${DEMO_DATA.steps.length}` : 'Ready to run'
  const states = {
    thought: frame.stage === 'thought',
    action: frame.stage === 'result',
    observation: frame.stage === 'result',
    answer: frame.stage === 'answer',
  }

  return (
    <div className="demo-phase-panel" data-testid="demo-phase-panel">
      <div className="cost-meter-title">Loop State</div>
      <div className="demo-phase-step">{currentStep}</div>
      <div className="demo-phase-track">
        <div className={`demo-phase-pill${states.thought ? ' active' : ''}`}>Thought</div>
        <div className={`demo-phase-pill${states.action ? ' active' : ''}`}>Action</div>
        <div className={`demo-phase-pill${states.observation ? ' active' : ''}`}>Observation</div>
        <div className={`demo-phase-pill${states.answer ? ' active' : ''}`}>Final Answer</div>
      </div>
      <SlideJumpLink targetId="demo-code" testId="demo-code-link">
        Open loop pseudocode appendix
      </SlideJumpLink>
    </div>
  )
}

function CostMeter({ steps, visibleSteps, total }) {
  const visibleCost = visibleSteps > 0
    ? steps[Math.min(visibleSteps, steps.length) - 1]?.cumulative_cost_usd ?? 0
    : 0
  const visibleIn = steps.slice(0, visibleSteps).reduce((s, st) => s + st.usage.input_tokens, 0)
  const visibleOut = steps.slice(0, visibleSteps).reduce((s, st) => s + st.usage.output_tokens, 0)
  const allRevealed = visibleSteps >= steps.length

  return (
    <div className="cost-meter">
      <div className="cost-meter-title">API Usage</div>
      {steps.map((step, i) => {
        if (i + 1 > visibleSteps) return null
        return (
          <div key={step.step} className="cost-entry">
            <div className="cost-entry-label">Call {step.step}</div>
            <div className="cost-entry-tokens">
              <span className="cost-tok">In: {step.usage.input_tokens.toLocaleString()}</span>
              <span className="cost-tok">Out: {step.usage.output_tokens.toLocaleString()}</span>
            </div>
            <div className="cost-entry-usd">${step.cost_usd.toFixed(4)}</div>
          </div>
        )
      })}
      <div className={`cost-total${allRevealed ? ' cost-total--final' : ''}`}>
        <div className="cost-total-tokens">
          {visibleIn.toLocaleString()} in / {visibleOut.toLocaleString()} out
        </div>
        <div className="cost-total-usd">
          Total: ${visibleCost.toFixed(4)}
        </div>
      </div>
    </div>
  )
}

function DemoCodeSlide() {
  return (
    <div className="slide slide--split demo-slide" data-testid="slide-content-demo-code">
      <div className="split-left demo-tty-col">
        <div className="fake-tty">
          <div className="tty-titlebar">
            <span className="tty-dot tty-dot--red" />
            <span className="tty-dot tty-dot--yellow" />
            <span className="tty-dot tty-dot--green" />
            <span className="tty-titlebar-text">react_agent.py</span>
          </div>
          <div className="tty-body">
            <pre className="tty-code">{AGENT_CODE}</pre>
          </div>
        </div>
      </div>
      <div className="split-right demo-meter-col">
        <div className="demo-watchlist" data-testid="demo-code-aside">
          <div className="cost-meter-title">Appendix</div>
          <div className="demo-watch-item">This is the teaching sketch behind the replay.</div>
          <div className="demo-watch-item">It shows the prompt, the tool contract, and the bounded loop.</div>
          <SlideJumpLink targetId="demo" testId="back-to-demo-link">
            Back to prerecorded demo
          </SlideJumpLink>
        </div>
      </div>
    </div>
  )
}

function DemoSlide({ visibleFragments = 0 }) {
  const visibleSteps = getVisibleDemoCalls(visibleFragments)
  return (
    <div className="slide slide--split demo-slide" data-testid="slide-content-demo">
      <div className="split-left demo-tty-col">
        <FakeTTY
          steps={DEMO_DATA.steps}
          visibleSteps={visibleSteps}
          visibleFragments={visibleFragments}
          stagedReveal
          finalAnswer={DEMO_FINAL_ANSWER}
          prompt="We need to find a good time next week for a joint meeting with our New York and London teams. Please recommend the best day and time."
        />
      </div>
      <div className="split-right demo-meter-col">
        <div className="demo-meter-stack">
          <DemoPhaseTracker visibleFragments={visibleFragments} />
          <CostMeter steps={DEMO_DATA.steps} visibleSteps={visibleSteps} total={DEMO_DATA.total} />
        </div>
      </div>
    </div>
  )
}

// ─── Slide 9: Beyond ReAct ────────────────────────────────────────────────

function WhatsNextSlide() {
  const items = [
    { icon: '🧠', label: 'Memory', desc: 'Not stateless between tasks', testid: 'next-memory' },
    { icon: '📋', label: 'Planning layers', desc: 'More than one flat loop', testid: 'next-planning' },
    { icon: '🤝', label: 'Multiple components', desc: 'Specialized parts that cooperate', testid: 'next-multiagent' },
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

// ─── Slide 10: Closing ──────────────────────────────────────────────────────

function ClosingSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-closing">
      <div className="closing-tagline" data-testid="closing-tagline">
        Words describe. Agents do.
      </div>
      <div className="closing-summary" data-testid="closing-summary">
        <div className="summary-item" data-testid="summary-model">
          <span className="summary-key">Model</span> proposes the next step
        </div>
        <div className="summary-item" data-testid="summary-runtime">
          <span className="summary-key">Runtime</span> executes
        </div>
        <div className="summary-item" data-testid="summary-tools">
          <span className="summary-key">Tools</span> interact with the world
        </div>
        <div className="summary-item" data-testid="summary-feedback">
          <span className="summary-key">Observations</span> close the loop
        </div>
      </div>
      <div className="closing-cta" data-testid="closing-cta">
        <div className="cta-main">Build the loop around the model.</div>
        <div className="cta-sub">
          Small lookup tasks show tool use. Better constrained decisions turn vague goals into criteria, gather evidence,
          and then decide.
        </div>
      </div>
    </div>
  )
}

// ─── Slide 10: Easter Egg — Global All-Hands Demo ───────────────────────────

function EasterEggSlide({ visibleFragments = 0 }) {
  const visibleSteps = visibleFragments
  return (
    <div className="slide slide--split demo-slide" data-testid="slide-content-easter-egg">
      <div className="split-left demo-tty-col">
        <FakeTTY
          steps={GLOBAL_DEMO.steps}
          visibleSteps={visibleSteps}
          prompt={GLOBAL_DEMO.prompt}
        />
      </div>
      <div className="split-right demo-meter-col">
        <CostMeter steps={GLOBAL_DEMO.steps} visibleSteps={visibleSteps} total={GLOBAL_DEMO.total} />
      </div>
    </div>
  )
}

// ─── Slide definitions ──────────────────────────────────────────────────────

export const slides = [
  {
    id: 'title',
    title: 'Title',
    component: TitleSlide,
    notes: `This is a 10–15 minute educational talk for engineers and managers.

Goal: leave with one clear mental model.

A standalone LLM can describe actions.
An agent loop can turn those descriptions into grounded steps.`,
  },
  {
    id: 'opening',
    title: 'Cold Open',
    component: OpeningSlide,
    notes: `Open with the screenshot itself, not a separate viewer.

Let the audience read the screenshot for one beat before you start talking.

Tell the story in one sentence: the assistant behaved like it was recording the meeting, but nothing outside the chat changed.

[CLICK] After: "Nothing outside the chat changed."

Then say: it knew the script of recording, but it had no handle to the recorder.

[CLICK] After: "It could describe the job. It could not do the job."

Then land the thesis: fluent text is not execution.`,
  },
  {
    id: 'tools-matter',
    title: 'What Was Missing?',
    component: ToolsMatterSlide,
    fragments: 1,
    notes: `Answer the screenshot directly.

Start on the left card and finish the setup sentence before you click.

Text about action is not the action.

[CLICK] After: "Text about action is not the action."

Then walk the right card from tool call to observation.

Close with: tools make the action real; observations make the next step informed.`,
  },
  {
    id: 'agent-definition',
    title: 'Agent = Model + Tools + Loop',
    component: AgentDefinitionSlide,
    fragments: 1,
    notes: `This should now feel full from the first moment.

Do not click immediately.

Use the left panel for the plain model boundary, then the right panel for the agent runtime shape.

[CLICK] When you are ready to compress the comparison into one takeaway.

Then read the bottom row: model chooses, tools act, feedback decides whether to continue or answer.`,
  },
  {
    id: 'react-pattern',
    title: 'Introducing ReAct',
    component: ReActSlide,
    fragments: 4,
    notes: `ReAct is the simplest useful teaching model.

Click only after you finish the current definition.

[CLICK] After: "For teaching, I will use four labels." Then define Thought.

[CLICK] After the Thought explanation. Then define Action.

[CLICK] After the Action explanation. Then define Observation.

[CLICK] After: "do I need another pass, or do I now have enough evidence to answer?"

Then land Final Answer and the stop note.

Keep the audience on the loop labels and the diagram only.

Important caveat: many production systems use structured tool calls rather than visible free-form traces, but the loop is the same.`,
  },
  {
    id: 'small-example',
    title: 'Fact Retrieval vs Decision Under Constraints',
    component: SmallExampleSlide,
    fragments: 1,
    notes: `Land the heuristic in the title first. Let the audience read it before you say anything.

    The title is the rule. The two cards are the proof.

    Do not present this as a formal taxonomy.

    Do not call the right side an "agent task" on stage. That wording is fuzzy.

    Use the contrast: fact retrieval stops when the fact is found; the demo is a constrained decision that stops when there is enough evidence to defend a recommendation.

    [CLICK] Reveal the decision gate diagram. Say: "The left case passes this test. The right case does not."

    That one sentence is the transition into the demo.`,
  },
  {
    id: 'demo',
    title: 'Prerecorded Demo',
    component: DemoSlide,
    fragments: DEMO_REVEAL_SEQUENCE.length,
    notes: `No click until the user request is framed.

Use the right rail only as a light phase tracker, not as a second script.

Do not verbally recreate an on-screen watchlist. Just tell the audience to notice how tool results change the next move.

Rhythm:
1. thought
2. tool + feedback
3. thought
4. tool + feedback
5. thought
6. final answer

[CLICK] Step 1 thought. Narrate intent only.
[CLICK] Step 1 tool calls and observations. Narrate what came back and why it matters.

[CLICK] Step 2 thought. Say the correction before you reveal it.
[CLICK] Step 2 correction fetches for 2026.

[CLICK] Step 3 thought: explain the reasoning chain clearly: 4-hour gap next week, no holidays, 10 AM New York / 2 PM London overlap, and Tuesday / Wednesday beats Monday / Friday.
[CLICK] Final answer lands on Tuesday, March 10 or Wednesday, March 11 at 10:00 AM New York / 2:00 PM London.

After the final answer appears, stop clicking for a beat and let the recommendation sit.

The cost meter is supporting detail, not the headline.`,
  },
  {
    id: 'workflow',
    title: 'A Minimal Runtime',
    component: WorkflowSlide,
    fragments: 1,
    notes: `Only debrief after the demo.

Let the four cards sit for one beat before you click.

Map the demo vocabulary back to architecture: Thought / Answer is the model, Action is tools, Observation is feedback, and continue versus stop is the controller.

[CLICK] Only when you are ready to translate the demo into architecture.

Then give one sentence only: user gives a goal, the model chooses, the runtime executes, observes, and stops on a limit.`,
  },
  {
    id: 'whats-next',
    title: 'Beyond ReAct',
    component: WhatsNextSlide,
    notes: `Keep this intentionally brief.

Memory, planning layers, multiple components.

If the audience understands the loop, they can understand all of these as extensions rather than entirely new ideas.`,
  },
  {
    id: 'closing',
    title: 'Closing',
    component: ClosingSlide,
    notes: `End on the core takeaway, not on framework details.

A standalone LLM can describe actions.
An agent can take them.

Then repeat the four-part model:
model, runtime, tools, observations.

Close with "Words describe. Agents do."`,
  },
  {
    id: 'demo-code',
    title: 'Appendix: Demo Code',
    component: DemoCodeSlide,
    notes: `Appendix only.

Use this if someone asks what the loop looks like in code.

The link on the demo slide jumps here, and the link on this slide jumps back to the demo.`,
  },
  {
    id: 'easter-egg',
    title: 'Bonus: 8-Office Global Demo',
    component: EasterEggSlide,
    fragments: GLOBAL_DEMO.steps.length,
    notes: `Easter egg! Same agent, much harder: 8 offices across SF, NY, London, Berlin, Dubai, Mumbai, Singapore, Tokyo.

[CLICK] Step 1: 15 parallel tool calls — 8 timezones + 7 holiday lookups. UAE and India APIs fail — the agent handles errors gracefully.

[CLICK] Step 2: Self-corrects — re-fetches all 7 countries for 2026. Notes DST starts Mar 8 for US offices.

[CLICK] Step 3: Builds a full UTC overlap matrix. Finds UTC 09:00 hits 6/8 offices. Ranks top 3 windows. Notes 8/8 is mathematically impossible with a 16-hour spread.

Total: $0.11 for 22 tool executions across 3 API calls. Still about a dime.`,
  },
]
