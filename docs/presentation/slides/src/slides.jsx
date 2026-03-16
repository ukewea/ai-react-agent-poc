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
      <p className="title-sub" data-testid="title-subtitle">How a tool loop turns language into action</p>
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
      <div className="tools-bridge-statement">Fluent text is not execution.</div>
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

// ─── Slide 3: Agent Definition + ReAct (merged) ─────────────────────────────

function AgentReActSlide({ visibleFragments = 0 }) {
  const reactSteps = [
    { key: 'thought', label: 'Thought', cls: 'thought', desc: 'explicit decision step', frag: 2 },
    { key: 'action', label: 'Action', cls: 'action', desc: 'tool call or structured operation', frag: 3 },
    { key: 'observation', label: 'Observation', cls: 'observation', desc: 'new evidence from the outside world', frag: 4 },
    { key: 'finish', label: 'Final Answer', cls: 'finish', desc: 'stop when there is enough evidence', frag: 5 },
  ]

  return (
    <div className="slide slide--split react-slide" data-testid="slide-content-agent-react">
      <div className="split-left">
        <h2 className="slide-title">Agent = Model + Tools + Loop</h2>
        <div className="definition-stage-compact" data-testid="agent-contrast">
          <div className="definition-lane-compact">
            <div className="contrast-label">Model Only</div>
            <div className="definition-lane">
              <div className="definition-node">Prompt</div>
              <div className="definition-arrow" aria-hidden="true">→</div>
              <div className="definition-node">Model</div>
              <div className="definition-arrow" aria-hidden="true">→</div>
              <div className="definition-node">Text Reply</div>
            </div>
          </div>
          <div className="definition-lane-compact">
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
          </div>
        </div>
        <Fragment index={1} visible={visibleFragments} className="react-transition">
          <div className="react-def" data-testid="react-definition">
            <span className="react-r">Re</span>ason + <span className="react-a">Act</span> — the vocabulary for that loop:
          </div>
        </Fragment>
        <div className="react-sequence" data-testid="react-sequence">
          {reactSteps.map((s) => (
            <Fragment key={s.key} index={s.frag} visible={visibleFragments}>
              <div className={`seq-step ${s.cls}`} data-testid={`seq-step-${s.key}`}>
                <span className="seq-label">{s.label}</span>
                <span className="seq-desc">{s.desc}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="split-right react-visual-col">
        <ReActLoopDiagram visibleFragments={Math.max(0, visibleFragments - 1)} />
      </div>
    </div>
  )
}

// ─── Slide 5: Workflow vs Agent flowcharts ───────────────────────────────────

function WorkflowFlowchart() {
  const blue = '#4f9cf9'
  const green = '#22c55e'
  const arrowColor = '#3a79d7'
  const nodeFill = '#11192b'
  const steps = [
    { label: 'receive email', llm: false },
    { label: 'classify intent', llm: true },
    { label: 'route to handler', llm: false },
    { label: 'generate reply', llm: true },
    { label: 'send email', llm: false },
  ]
  const nodeW = 150, nodeH = 38, gap = 14, rx = 10
  const startY = 8
  const cx = 95
  const totalH = startY + steps.length * (nodeH + gap) + 48

  return (
    <svg viewBox={`0 0 190 ${totalH}`} width="100%" style={{ maxWidth: 220 }} className="flowchart-svg" data-testid="workflow-flowchart">
      <defs>
        <marker id="wf-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={arrowColor} />
        </marker>
      </defs>
      {steps.map((step, i) => {
        const y = startY + i * (nodeH + gap)
        const color = step.llm ? green : blue
        return (
          <g key={step.label}>
            {i > 0 && (
              <line
                x1={cx} y1={y - gap + 2} x2={cx} y2={y}
                stroke={arrowColor} strokeWidth="2" markerEnd="url(#wf-arr)"
              />
            )}
            <rect x={cx - nodeW / 2} y={y} width={nodeW} height={nodeH} rx={rx}
              fill={nodeFill} stroke={color} strokeWidth="2" />
            <text x={cx} y={y + nodeH / 2 + 4.5} textAnchor="middle" fill={color} fontSize="12" fontWeight="600">
              {step.label}
            </text>
          </g>
        )
      })}
      <text x={cx} y={startY + steps.length * (nodeH + gap) + 10} textAnchor="middle"
        fill="#7d8ba1" fontSize="9.5" fontStyle="italic">
        LLM fills a slot, code moves on.
      </text>
      <text x={cx} y={startY + steps.length * (nodeH + gap) + 23} textAnchor="middle"
        fill="#7d8ba1" fontSize="9.5" fontStyle="italic">
        Path known before run.
      </text>
    </svg>
  )
}

function AgentFlowchart() {
  const blue = '#4f9cf9'
  const green = '#22c55e'
  const orange = '#f97316'
  const yellow = '#facc15'
  const arrowColor = '#3a79d7'
  const nodeFill = '#11192b'
  const rx = 10
  const cx = 110
  const nodeW = 140, nodeH = 36

  // Node positions (y)
  const receiveY = 8
  const diamond1Y = 72
  const executeY = 140
  const observeY = 198
  const diamond2Y = 260
  const answerY = 330

  // Diamond size
  const dSize = 28

  return (
    <svg viewBox="0 0 220 400" width="100%" style={{ maxWidth: 260 }} className="flowchart-svg" data-testid="agent-flowchart">
      <defs>
        <marker id="ag-arr-blue" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={arrowColor} />
        </marker>
        <marker id="ag-arr-green" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill={green} />
        </marker>
      </defs>

      {/* Node: receive task */}
      <rect x={cx - nodeW / 2} y={receiveY} width={nodeW} height={nodeH} rx={rx}
        fill={nodeFill} stroke={blue} strokeWidth="2" />
      <text x={cx} y={receiveY + nodeH / 2 + 4.5} textAnchor="middle" fill={blue} fontSize="12" fontWeight="600">
        receive task
      </text>

      {/* Arrow: receive → diamond1 */}
      <line x1={cx} y1={receiveY + nodeH + 2} x2={cx} y2={diamond1Y - dSize}
        stroke={arrowColor} strokeWidth="2" markerEnd="url(#ag-arr-blue)" />

      {/* Diamond 1: which tool? LLM decides */}
      <g>
        <polygon
          points={`${cx},${diamond1Y - dSize} ${cx + dSize + 8},${diamond1Y} ${cx},${diamond1Y + dSize} ${cx - dSize - 8},${diamond1Y}`}
          fill={nodeFill} stroke={green} strokeWidth="2"
        />
        <text x={cx} y={diamond1Y - 2} textAnchor="middle" fill={green} fontSize="9.5" fontWeight="600">
          which tool?
        </text>
        <text x={cx} y={diamond1Y + 10} textAnchor="middle" fill={green} fontSize="8" opacity="0.8">
          LLM decides
        </text>
      </g>

      {/* Loop bracket label */}
      <text x={17} y={(diamond1Y + diamond2Y) / 2 + 4} textAnchor="middle" fill="#7d8ba1" fontSize="9.5"
        fontStyle="italic" transform={`rotate(-90, 17, ${(diamond1Y + diamond2Y) / 2 + 4})`}>
        loop
      </text>
      {/* Loop bracket line */}
      <line x1={28} y1={diamond1Y - dSize + 4} x2={28} y2={diamond2Y + dSize - 4}
        stroke="#7d8ba1" strokeWidth="1" opacity="0.35" strokeDasharray="4,3" />

      {/* Arrow: diamond1 → execute */}
      <line x1={cx} y1={diamond1Y + dSize + 2} x2={cx} y2={executeY}
        stroke={arrowColor} strokeWidth="2" markerEnd="url(#ag-arr-blue)" />

      {/* Node: execute tool */}
      <rect x={cx - nodeW / 2} y={executeY} width={nodeW} height={nodeH} rx={rx}
        fill={nodeFill} stroke={orange} strokeWidth="2" />
      <text x={cx} y={executeY + nodeH / 2 + 4.5} textAnchor="middle" fill={orange} fontSize="12" fontWeight="600">
        execute tool
      </text>

      {/* Arrow: execute → observe */}
      <line x1={cx} y1={executeY + nodeH + 2} x2={cx} y2={observeY}
        stroke={arrowColor} strokeWidth="2" markerEnd="url(#ag-arr-blue)" />

      {/* Node: observe result */}
      <rect x={cx - nodeW / 2} y={observeY} width={nodeW} height={nodeH} rx={rx}
        fill={nodeFill} stroke={green} strokeWidth="2" />
      <text x={cx} y={observeY + nodeH / 2 + 4.5} textAnchor="middle" fill={green} fontSize="12" fontWeight="600">
        observe result
      </text>

      {/* Arrow: observe → diamond2 */}
      <line x1={cx} y1={observeY + nodeH + 2} x2={cx} y2={diamond2Y - dSize}
        stroke={arrowColor} strokeWidth="2" markerEnd="url(#ag-arr-blue)" />

      {/* Diamond 2: done or loop? */}
      <g>
        <polygon
          points={`${cx},${diamond2Y - dSize} ${cx + dSize + 8},${diamond2Y} ${cx},${diamond2Y + dSize} ${cx - dSize - 8},${diamond2Y}`}
          fill={nodeFill} stroke={green} strokeWidth="2"
        />
        <text x={cx} y={diamond2Y - 2} textAnchor="middle" fill={green} fontSize="9.5" fontWeight="600">
          done or
        </text>
        <text x={cx} y={diamond2Y + 10} textAnchor="middle" fill={green} fontSize="8" opacity="0.8">
          loop again?
        </text>
      </g>

      {/* Loop-back arrow: diamond2 → diamond1 (right side) */}
      <path
        d={`M ${cx + dSize + 8},${diamond2Y} Q ${cx + nodeW / 2 + 28},${(diamond1Y + diamond2Y) / 2} ${cx + dSize + 8},${diamond1Y}`}
        fill="none" stroke={green} strokeWidth="1.8" strokeDasharray="5,3"
        markerEnd="url(#ag-arr-green)"
      />

      {/* Arrow: diamond2 → answer */}
      <line x1={cx} y1={diamond2Y + dSize + 2} x2={cx} y2={answerY}
        stroke={arrowColor} strokeWidth="2" markerEnd="url(#ag-arr-blue)" />

      {/* Node: return answer */}
      <rect x={cx - nodeW / 2} y={answerY} width={nodeW} height={nodeH} rx={rx}
        fill="rgba(250, 204, 21, 0.08)" stroke={yellow} strokeWidth="2" />
      <text x={cx} y={answerY + nodeH / 2 + 4.5} textAnchor="middle" fill={yellow} fontSize="12" fontWeight="600">
        return answer
      </text>

      {/* Summary */}
      <text x={cx} y={answerY + nodeH + 18} textAnchor="middle" fill="#7d8ba1" fontSize="9.5" fontStyle="italic">
        LLM controls every branch.
      </text>
    </svg>
  )
}

function SmallExampleSlide({ visibleFragments = 0 }) {
  return (
    <div className="slide slide--center example-slide" data-testid="slide-content-small-example">
      <h2 className="slide-title example-heuristic-title">
        When Does a Task Need an Agent?
      </h2>
      <div className="example-heuristic-sub">If you can write the decision tree, you don&apos;t need an agent.</div>
      <div className="example-workflow-callout">Fixed path you can flowchart = <strong>workflow</strong>. Model decides the next step = <strong>agent</strong>.</div>
      <div className="example-flowcharts" data-testid="example-contrast">
        <div className="example-flowchart-col" data-testid="example-card-lookup">
          <div className="example-flowchart-title">Workflow</div>
          <div className="example-flowchart-subtitle">path fixed at author time</div>
          <WorkflowFlowchart />
        </div>
        <Fragment index={1} visible={visibleFragments} className="example-flowchart-col example-flowchart-col--agent" data-testid="example-card-agent">
          <div className="example-flowchart-title example-flowchart-title--agent">Agent</div>
          <div className="example-flowchart-subtitle example-flowchart-subtitle--agent">path generated at runtime</div>
          <AgentFlowchart />
        </Fragment>
      </div>
      <div className="example-legend">
        <span className="example-legend-item"><span className="example-legend-swatch" style={{ background: '#4f9cf9' }} />code node</span>
        <span className="example-legend-item"><span className="example-legend-swatch" style={{ background: '#22c55e' }} />LLM node</span>
      </div>
    </div>
  )
}

// ─── Slide 7: Minimal Runtime ───────────────────────────────────────────────

function WorkflowSlide({ visibleFragments = 0 }) {
  const components = [
    { text: 'Thought / Answer = Model', color: 'var(--think)' },
    { text: 'Action = Tools', color: 'var(--act)' },
    { text: 'Observation = Feedback', color: 'var(--observe)' },
    { text: 'Continue / Stop = Controller', color: 'var(--accent)' },
  ]

  return (
    <div className="slide slide--center runtime-slide" data-testid="slide-content-workflow">
      <h2 className="slide-title">A Minimal Runtime</h2>
      <div className="runtime-summary">An agent runtime is a bounded tool loop.</div>
      <div className="runtime-grid" data-testid="four-things">
        {components.map((c, i) => (
          <div key={i} className="runtime-card" style={{ borderColor: c.color }} data-testid={`thing-item-${i}`}>
            <span className="runtime-card-num">{i + 1}</span>
            <span className="runtime-card-text">{c.text}</span>
          </div>
        ))}
      </div>
      <Fragment index={1} visible={visibleFragments} className="runtime-footer" data-testid="workflow-note">
        User gives a goal. The model chooses. The runtime executes, observes, and stops on a limit.
        <br />
        <span className="runtime-footer-insight">New capabilities layer on top. The core loop rarely needs touching.</span>
      </Fragment>
      <Fragment index={2} visible={visibleFragments} className="runtime-code-reveal">
        <div className="runtime-code-header">Everything you just watched in the demo is driven by this loop.</div>
        <div className="fake-tty runtime-code-tty">
          <div className="tty-titlebar">
            <span className="tty-dot tty-dot--red" />
            <span className="tty-dot tty-dot--yellow" />
            <span className="tty-dot tty-dot--green" />
            <span className="tty-titlebar-text">the loop</span>
          </div>
          <div className="tty-body">
            <pre className="tty-code">{`messages = [prompt]

while True:
    response = llm(messages)

    thought = parse_thought(response)
    action  = parse_action(response)

    if not action:
        print("Final answer:", response)
        break

    observation = execute(action)
    messages += [thought, action, observation]`}</pre>
          </div>
        </div>
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
              className={`tty-step tty-step--${stage}${i === 1 && stage !== 'hidden' ? ' tty-step--correction' : ''}`}
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

function DemoPhaseTracker({ visibleFragments = 0, runningCost = null }) {
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
      {frame.step === 1 && (
        <div className="demo-phase-annotation" data-testid="demo-correction-note">
          Self-correction: wrong year detected
        </div>
      )}
      {runningCost !== null && runningCost > 0 && (
        <div className="demo-phase-cost" data-testid="demo-running-cost">
          <span className="demo-phase-cost-label">API cost so far</span>
          <span className="demo-phase-cost-value">${runningCost.toFixed(4)}</span>
        </div>
      )}
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
          <div className="demo-watch-item">The core loop is under 20 lines. Everything else is tools, context, and safety.</div>
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
  const allRevealed = visibleFragments >= DEMO_REVEAL_SEQUENCE.length
  const totalCost = DEMO_DATA.total.total_cost_usd
  const runningCost = visibleSteps > 0
    ? DEMO_DATA.steps[Math.min(visibleSteps, DEMO_DATA.steps.length) - 1]?.cumulative_cost_usd ?? 0
    : 0

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
        <DemoPhaseTracker visibleFragments={visibleFragments} runningCost={allRevealed ? null : runningCost} />
        {allRevealed && (
          <div className="cost-punchline" data-testid="cost-punchline">
            <div className="cost-punchline-usd">${totalCost.toFixed(2)}</div>
            <div className="cost-punchline-label">total API cost</div>
            <div className="cost-punchline-compare">Less than a text message</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Slide 9: Beyond ReAct ────────────────────────────────────────────────

function WhatsNextSlide() {
  const items = [
    { num: 1, label: 'Guardrails', desc: 'Encode rules in code, not just the prompt', testid: 'next-guardrails' },
    { num: 2, label: 'Tool Design', desc: 'One tool per goal, not per API endpoint', testid: 'next-tool-design' },
    { num: 3, label: 'Context Layers', desc: 'Load only what this turn needs', testid: 'next-context' },
  ]

  return (
    <div className="slide slide--center" data-testid="slide-content-whats-next">
      <h2 className="slide-title">Beyond the Basic Loop</h2>
      <div className="next-items" data-testid="next-items">
        {items.map((item) => (
          <div key={item.label} className="next-item" data-testid={item.testid}>
            <div className="next-num" aria-hidden="true">{item.num}</div>
            <div className="next-label">{item.label}</div>
            <div className="next-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <p className="next-note" data-testid="next-note">
        The loop is the foundation. These four decide whether it works reliably.
      </p>
    </div>
  )
}

// ─── Slide 10: Closing ──────────────────────────────────────────────────────

function ClosingSlide() {
  return (
    <div className="slide slide--center" data-testid="slide-content-closing">
      <div className="closing-tagline" data-testid="closing-tagline">
        <span className="closing-tagline-dim">Words describe.</span>{' '}
        <span className="closing-tagline-bright">Agents do.</span>
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
  { id: 'title', title: 'Title', component: TitleSlide },
  { id: 'opening', title: 'Cold Open', component: OpeningSlide },
  { id: 'tools-matter', title: 'What Was Missing?', component: ToolsMatterSlide, fragments: 1 },
  { id: 'agent-react', title: 'Agent = Model + Tools + Loop', component: AgentReActSlide, fragments: 5 },
  { id: 'small-example', title: 'When Does a Task Need an Agent?', component: SmallExampleSlide, fragments: 1 },
  { id: 'demo', title: 'Prerecorded Demo', component: DemoSlide, fragments: DEMO_REVEAL_SEQUENCE.length },
  { id: 'workflow', title: 'A Minimal Runtime', component: WorkflowSlide, fragments: 2 },
  { id: 'whats-next', title: 'Beyond the Basic Loop', component: WhatsNextSlide },
  { id: 'closing', title: 'Closing', component: ClosingSlide },
  { id: 'demo-code', title: 'Appendix: Demo Code', component: DemoCodeSlide },
  { id: 'easter-egg', title: 'Bonus: 8-Office Global Demo', component: EasterEggSlide, fragments: GLOBAL_DEMO.steps.length },
]
