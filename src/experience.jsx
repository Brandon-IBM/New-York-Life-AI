import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ArrowDown, Check, Plus, Minus, Menu, X } from 'lucide-react';
import { agents, policyCases, enrollment, benefits, reconcileRecords, regulations } from './data';
import { useSimulation } from './simulation';

export function SiteHeader({ page, go }) {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  const navigate = (id, section) => { setOpen(false); header.current?.querySelector('details')?.removeAttribute('open'); go(id, section); };
  useEffect(() => {
    const escape = e => { if (e.key === 'Escape') { setOpen(false); header.current?.querySelector('details')?.removeAttribute('open'); } };
    const outside = e => { if (!header.current?.contains(e.target)) { setOpen(false); header.current?.querySelector('details')?.removeAttribute('open'); } };
    document.addEventListener('keydown', escape);
    document.addEventListener('click', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('click', outside); };
  }, []);

  return <header ref={header} className="site-header">
    <button className="wordmark" onClick={() => navigate('overview')} aria-label="New York Life AI Systems home">NEW YORK LIFE <span>/</span> <span>AI SYSTEMS</span></button>
    <button className="mobile-menu icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
    <nav id="site-navigation" className={open ? 'is-open' : ''} aria-label="Primary navigation">
      <button aria-current={page === 'overview' ? 'page' : undefined} onClick={() => navigate('overview')}>Overview</button>
      <details className="systems-nav"><summary>Agents <Plus size={11}/></summary><div className="systems-menu">{agents.map(a => <button key={a.id} onClick={() => navigate(a.id)}><span>{a.number}</span>{a.short}<ArrowUpRight size={14}/></button>)}<button onClick={() => navigate('overview', 'systems')} className="all-systems-link">All systems <ArrowDown size={13}/></button></div></details>
      <button aria-current={page === 'architecture' ? 'page' : undefined} onClick={() => navigate('architecture')}>Architecture</button>
      <button aria-current={page === 'value' ? 'page' : undefined} onClick={() => navigate('value')}>Business value</button>
    </nav>
  </header>;
}

function SystemDrawing() {
  return <div className="system-drawing" aria-hidden="true">
    <svg viewBox="0 0 520 280" fill="none">
      <defs><pattern id="plot-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#d5d5d5"/></pattern></defs>
      <rect width="520" height="280" fill="url(#plot-grid)"/>
      <g stroke="#c2c2c2" strokeWidth="1"><path d="M30 70H137V135H214M30 135H214M30 200H137V135M304 135H373V70H490M373 135H490M373 135V200H490"/><path strokeDasharray="3 5" d="M259 178V250H465"/></g>
      <g fill="#ffffff" stroke="#bbbbbb"><rect x="18" y="48" width="87" height="44"/><rect x="18" y="113" width="87" height="44"/><rect x="18" y="178" width="87" height="44"/><rect x="214" y="92" width="90" height="86"/><rect x="405" y="48" width="96" height="44"/><rect x="405" y="113" width="96" height="44"/><rect x="405" y="178" width="96" height="44"/></g>
      <g fill="#707070" fontFamily="monospace" fontSize="8" letterSpacing=".6"><text x="32" y="74">DOCUMENTS</text><text x="32" y="139">RECORDS</text><text x="32" y="204">REGULATION</text><text x="230" y="124">WORKFLOW</text><text x="237" y="148">ENGINE</text><text x="420" y="74">VALIDATION</text><text x="420" y="139">EXCEPTIONS</text><text x="420" y="204">REVIEW</text><text x="333" y="265">AUDIT TRAIL</text></g>
      <g fill="#0468ff"><circle cx="137" cy="135" r="2.5"/><circle cx="373" cy="135" r="2.5"/><rect x="224" y="101" width="3" height="3"/></g>
      <path d="M30 24H52M30 24V2M488 256H510V234" stroke="#b7b7b7"/>
    </svg>
    <span>PROPOSED SYSTEM / HUMAN REVIEW REQUIRED</span>
  </div>;
}

function MiniProgress({ sim, steps }) {
  return <div className="mini-progress" aria-label="Simulation progress">{steps.map((s, i) => <div key={s} className={sim.step > i ? 'done' : sim.step === i && sim.state === 'running' ? 'active' : ''}><span/>{s}</div>)}<span className="sr-only" role="status">{sim.state === 'complete' ? 'Simulation complete' : sim.state === 'running' ? steps[sim.step] : 'Awaiting simulation'}</span></div>;
}

function PreviewRun({ sim, run, label = 'Run Agent' }) {
  return <button className="preview-run" onClick={run || sim.run} disabled={sim.state === 'running'}>{sim.state === 'running' ? 'Running…' : sim.state === 'complete' ? 'Run again' : label}{sim.state !== 'running' && <ArrowRight size={13}/>}</button>;
}

function PolicyPreview() {
  const [index, setIndex] = useState(1), [evidence, setEvidence] = useState(null);
  const steps = ['Receive', 'Extract', 'Validate', 'Review'];
  const sim = useSimulation(steps.length), item = policyCases[index], done = sim.state === 'complete';
  return <div className="product-preview policy-preview">
    <div className="preview-title"><span>POLICY SERVICING</span><span className="simulation-label">SIMULATED</span></div>
    <div className="preview-input"><div><label htmlFor="preview-case">Servicing request</label><select id="preview-case" value={index} disabled={sim.state === 'running'} onChange={e => { setIndex(Number(e.target.value)); setEvidence(null); sim.reset(); }}>{policyCases.map((c, i) => <option key={c.id} value={i}>{c.id} / {c.name}</option>)}</select></div><PreviewRun sim={sim}/></div>
    <div className="preview-record"><div><span>POLICY OWNER</span><strong>{item.person}</strong></div><div><span>REQUEST</span><strong>{item.type}</strong></div></div>
    <div className="preview-checks">{item.checks.map((c, i) => <button key={c.label} disabled={!done} onClick={() => setEvidence(evidence === i ? null : i)}><span className={`check-marker ${done ? c.pass ? 'passed' : 'issue' : ''}`}>{done ? c.pass ? <Check size={12}/> : <Minus size={12}/> : '·'}</span><span>{c.label}{evidence === i && <small>{c.evidence}</small>}</span><span className="check-state">{done ? c.pass ? 'Pass' : 'Review' : 'Pending'}</span></button>)}</div>
    <MiniProgress sim={sim} steps={steps}/>
    <div className="preview-footer"><span>{done ? `${item.checks.filter(c => !c.pass).length} exceptions · Human review pending` : `${item.documents.length} synthetic documents`}</span><span>{done ? 'INSPECT A CHECK ↗' : item.policy}</span></div>
  </div>;
}

function BenefitsPreview() {
  const steps = ['Ingest', 'Match', 'Compare', 'Report'];
  const sim = useSimulation(steps.length), done = sim.state === 'complete', results = reconcileRecords();
  return <div className="product-preview benefits-preview">
    <div className="preview-title"><span>RECONCILIATION WORKSPACE</span><span className="simulation-label">SIMULATED</span></div>
    <div className="preview-input"><div><label>October enrollment</label><span className="preview-subtitle">Member ID / Exact match</span></div><PreviewRun sim={sim} label="Reconcile"/></div>
    <div className="preview-data-pair">{[{ name: 'Enrollment', rows: enrollment }, { name: 'Benefits', rows: benefits }].map(source => <div key={source.name}><h4>{source.name}<span>{source.rows.length} RECORDS</span></h4><table><thead><tr><th>Member ID</th><th>Plan</th><th>Status</th></tr></thead><tbody>{source.rows.map(r => <tr key={r.id} className={done && !results.find(x => x.id === r.id).matched ? 'has-difference' : ''}><td>{r.id}</td><td>{r.plan}</td><td>{done ? results.find(x => x.id === r.id).matched ? 'Match' : 'Review' : '—'}</td></tr>)}</tbody></table></div>)}</div>
    <MiniProgress sim={sim} steps={steps}/>
    <div className="preview-footer"><span>{done ? `${results.filter(r => r.matched).length} matched / ${results.filter(r => !r.matched).length} exceptions` : '12 source rows / 7 unique members'}</span><span>{done ? 'HUMAN REVIEW PENDING' : 'SYNTHETIC RECORDS'}</span></div>
  </div>;
}

function CompliancePreview() {
  const [expanded, setExpanded] = useState(false);
  const steps = ['Retrieve', 'Compare', 'Assess', 'Review'];
  const sim = useSimulation(steps.length), done = sim.state === 'complete', update = regulations[0];
  return <div className="product-preview compliance-preview">
    <div className="preview-title"><span>REGULATORY INTELLIGENCE</span><span className="simulation-label">FICTIONAL EXAMPLE</span></div>
    <div className="preview-input"><div><label>{update.title}</label><span className="preview-subtitle">{update.id} / {update.state}</span></div><PreviewRun sim={sim} label="Analyze"/></div>
    <div className="preview-change"><span>REQUIREMENT CHANGE</span><p>Annual policyholder notices must include a servicing escalation contact.</p><small>{update.source}</small></div>
    <button className="preview-evidence" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><span>{done ? 'Potential gap / Escalation contact unspecified' : 'Internal evidence / Annual Notice Procedure'}</span>{expanded ? <Minus size={13}/> : <Plus size={13}/>}</button>
    {expanded && <div className="preview-evidence-body"><p>{update.excerpt}</p><small>{update.document} · § 1</small></div>}
    <MiniProgress sim={sim} steps={steps}/>
    <div className="preview-footer"><span>{done ? 'Draft finding / Source cited' : 'Version 1 → Version 2'}</span><span>{done ? 'SPECIALIST REVIEW PENDING' : 'NO LEGAL DETERMINATION'}</span></div>
  </div>;
}

const stories = [
  { agent: agents[0], title: <>Every document.<br/>Every detail.</>, copy: 'Check servicing requests. Find missing information. Prepare exceptions for human review.', preview: PolicyPreview },
  { agent: agents[1], title: <>Reconciliation,<br/>without the repetition.</>, copy: 'Compare enrollment and benefits records. Surface the differences that need attention.', preview: BenefitsPreview },
  { agent: agents[2], title: <>From regulatory change<br/>to operational clarity.</>, copy: 'Connect requirement changes to internal procedures, with sources attached.', preview: CompliancePreview },
];

export function Landing({ go, Comparison, section }) {
  useEffect(() => {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [section]);

  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.system-story').forEach(el => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return <div className="landing page-enter">
    <section className="intro-hero">
      <div className="hero-copy"><span className="eyebrow">IBM CONSULTING / EXPLORATORY CONCEPTS</span><h1>Intelligent systems.<br/><span>Real-world operations.</span></h1><p>Three proposed AI agents for insurance servicing,<br className="desktop-break"/> reconciliation, and regulatory operations.</p><button className="explore-link" onClick={() => document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' })}>Explore the systems <ArrowDown size={17}/></button></div>
      <SystemDrawing/>
      <div className="hero-system-index">{agents.map(a => <button key={a.id} onClick={() => go(a.id)}><span>{a.number}</span>{a.short}<ArrowUpRight size={15}/></button>)}</div>
    </section>
    <div id="systems" className="systems-showcase">{stories.map(({ agent, title, copy, preview: Preview }) => <section id={`system-${agent.id}`} key={agent.id} className={`system-story story-${agent.id}`}><div className="story-copy"><span className="eyebrow">{agent.number} / {agent.short.toUpperCase()}</span><h2>{title}</h2><p>{copy}</p><button className="editorial-link" onClick={() => go(agent.id)}>Open workspace <ArrowUpRight size={17}/></button></div><Preview/></section>)}</div>
    <section className="architecture-teaser"><div className="teaser-heading"><span className="eyebrow">THE SHARED FOUNDATION</span><h2>Follow the system.</h2><button className="editorial-link" onClick={() => go('architecture')}>Explore architecture <ArrowUpRight size={18}/></button></div><div className="teaser-flow">{['Data sources', 'Integration', 'Orchestration', 'Business logic', 'Human review', 'Governance'].map((label, i) => <React.Fragment key={label}>{i > 0 && <ArrowRight size={16}/>}<button onClick={() => go('architecture')}><span>0{i + 1}</span><strong>{label}</strong></button></React.Fragment>)}</div><div className="teaser-foot"><span>PROPOSED ARCHITECTURE</span><span>Authorized inputs. Traceable outputs. Human decisions.</span></div></section>
    <section className="overview-reference"><div className="reference-value"><span className="eyebrow">BUSINESS VALUE</span><h2>Start with your numbers.</h2><button className="editorial-link" onClick={() => go('value')}>Open value model <ArrowUpRight size={17}/></button></div><details className="disclosure comparison-disclosure"><summary>Compare the systems <Plus size={17}/></summary><Comparison go={go}/></details></section>
  </div>;
}

export function ValuePage({ values, onValues, CalculatorComponent }) {
  const [selected, setSelected] = useState('policy');
  const agent = agents.find(a => a.id === selected);
  return <div className="content-page value-page page-enter"><header className="editorial-page-header"><span className="eyebrow">BUSINESS VALUE / ILLUSTRATIVE MODEL</span><h1>What could change.</h1><p>Use your assumptions to estimate labor capacity value.</p></header><div className="value-system-tabs" aria-label="Value model agent">{agents.map(a => <button key={a.id} aria-pressed={selected === a.id} className={selected === a.id ? 'active' : ''} onClick={() => setSelected(a.id)}><span>{a.number}</span>{a.short}</button>)}</div><CalculatorComponent key={agent.id} agent={agent} values={values[agent.id]} onChange={next => onValues(agent.id, next)}/></div>;
}
