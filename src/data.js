export const agents = [
  {
    id: 'policy', number: '01', title: 'Policy Servicing QA Agent', short: 'Policy Servicing QA', category: 'POLICY OPERATIONS', color: 'blue', icon: 'FileCheck2',
    description: 'A more complete request. A more confident review.',
    opportunity: 'Reduce manual document validation and processing delays.',
    capability: 'Automated completeness checking and exception preparation.',
    outcome: 'Faster, more consistent policy servicing.',
    summary: 'Check servicing documents for completeness and consistency, then prepare evidence-backed exceptions for a human reviewer.',
    problem: 'Beneficiary changes, ownership transfers, and policy information updates can require detailed document reviews. Missing supporting documents and inconsistent fields may lead to follow-up work. These are potential workflows, not confirmed New York Life bottlenecks.',
    data: 'Servicing requests, supporting documents, configurable requirements',
    human: 'Review all recommendations; approve and execute policy changes',
    kpis: ['Manual review time', 'First-pass completeness', 'Rework rate', 'Backlog volume', 'Processing consistency'],
    complexity: 'Moderate', dependencies: 'Document access, servicing rules, reviewer ownership',
    steps: ['Receive request', 'Classify request', 'Extract document fields', 'Validate requirements', 'Prepare exception report', 'Route to human reviewer'],
    sources: ['Policy administration', 'Document repository', 'Servicing requirements'],
    rules: 'Required fields, signature presence, and exact identifiers are evaluated against configurable rules. Document interpretation can use AI; final validation remains explicit.',
    boundary: 'The agent prepares recommendations. Only an authorized human can approve or execute a policy change.',
    action: 'Run Agent',
    questions: ['Are beneficiary changes or ownership transfers already supported by automation?', 'Which review steps take the most time, and what is the monthly request volume?', 'Which systems hold requests, documents, and authoritative servicing requirements?', 'Which missing documents or conflicting fields cause the most rework?', 'Who owns policy servicing, reviewer approvals, and baseline performance metrics?'],
  },
  {
    id: 'benefits', number: '02', title: 'Benefits Reconciliation Agent', short: 'Benefits Reconciliation', category: 'BENEFITS ADMINISTRATION', color: 'teal', icon: 'GitCompareArrows',
    description: 'Connected records. Fewer loose ends.',
    opportunity: 'Reduce manual reconciliation across enrollment and benefits records.',
    capability: 'Cross-system comparison and discrepancy detection.',
    outcome: 'Faster resolution of data inconsistencies.',
    summary: 'Compare enrollment and benefits records, surface discrepancies, and give reviewers a clear path to resolution.',
    problem: 'Benefits administration may involve comparing enrollment records, eligibility information, and plan data across different systems. Missing, conflicting, or unmatched records can require manual investigation and correction.',
    data: 'Enrollment records, benefits records, eligibility reference data',
    human: 'Investigate exceptions and authorize source-system corrections',
    kpis: ['Reconciliation time', 'Manual comparison effort', 'Unresolved exceptions', 'Repeated investigation work'],
    complexity: 'Moderate–high', dependencies: 'System access, matching keys, data ownership',
    steps: ['Ingest authorized records', 'Normalize and match records', 'Detect discrepancies', 'Classify exceptions', 'Generate reconciliation report'],
    sources: ['Enrollment system', 'Benefits administration', 'Eligibility references'],
    rules: 'Records are joined on a unique member ID. Plan, eligibility, and effective-date differences are compared using deterministic rules; missing records remain explicit exceptions.',
    boundary: 'Source records remain unchanged. Human reviewers authorize corrections through existing systems.',
    action: 'Run Reconciliation',
    questions: ['What reconciliation tools or matching rules already exist?', 'Which enrollment and benefits systems contain the authoritative records?', 'Are stable member IDs and effective dates available across both systems?', 'How often do unmatched records recur, and who resolves them?', 'What are the current monthly record volume, review time, and success metrics?'],
  },
  {
    id: 'compliance', number: '03', title: 'Product Compliance Agent', short: 'Product Compliance', category: 'REGULATORY & COMPLIANCE', color: 'purple', icon: 'ShieldCheck',
    description: 'From regulatory change to a clearer next step.',
    opportunity: 'Reduce regulatory research and documentation preparation.',
    capability: 'Regulatory change identification and impact assessment.',
    outcome: 'Faster, more traceable compliance preparation.',
    summary: 'Connect regulatory changes to internal documents and prepare a traceable draft impact assessment for specialists.',
    problem: 'State-level regulatory monitoring and evaluating potential effects on products, policies, and procedures can require research and coordination. Compliance specialists need traceable evidence to validate potential impacts.',
    data: 'Approved regulatory sources, product documents, internal procedures',
    human: 'Validate interpretations, assess impacts, and make compliance decisions',
    kpis: ['Regulatory research time', 'Documentation preparation', 'Assessment turnaround', 'Evidence traceability', 'Team capacity'],
    complexity: 'High', dependencies: 'Approved sources, document retrieval, compliance experts',
    steps: ['Monitor approved sources', 'Identify requirement changes', 'Retrieve internal documents', 'Compare requirements', 'Draft impact assessment', 'Route for specialist review'],
    sources: ['Approved regulatory feeds', 'Product documentation', 'Internal policies'],
    rules: 'Source versions are compared and cited. Retrieval and language models may propose gaps; evidence coverage and review status are shown without unsupported confidence scores.',
    boundary: 'Draft analysis requires specialist validation. The agent does not make legal interpretations or final compliance decisions.',
    action: 'Analyze Impact',
    questions: ['Which approved regulatory sources and monitoring tools are already in use?', 'Which product families and jurisdictions should an initial scope cover?', 'How are product documents and procedures versioned and retrieved?', 'Who validates interpretations and approves an impact assessment?', 'How long do research and documentation take today, and how is evidence quality measured?'],
  },
];

export const policyCases = [
  { id: 'PS-1042', name: 'Complete request', type: 'Beneficiary change', person: 'Alex Morgan', policy: 'SYN-482601', status: 'Complete', documents: [
    { name: 'Beneficiary change form', ref: 'DOC-101 · page 1', text: 'Synthetic document — beneficiary change request', fields: { 'Policy number': 'SYN-482601', 'Policy owner': 'Alex Morgan', 'Beneficiary': 'Jordan Morgan', 'Allocation': '100%', 'Signature': 'Present', 'Signed date': '2026-10-15' } },
    { name: 'Identity verification', ref: 'DOC-102 · page 1', text: 'Synthetic identity verification record', fields: { 'Verified name': 'Alex Morgan', 'Policy number': 'SYN-482601', 'Verification': 'Passed', 'Verified date': '2026-10-15' } },
  ], checks: [
    { label: 'Required form and identity record', pass: true, evidence: 'DOC-101 p.1; DOC-102 p.1' },
    { label: 'Policy number matches across documents', pass: true, evidence: 'SYN-482601 · DOC-101 p.1; DOC-102 p.1' },
    { label: 'Owner signature is present', pass: true, evidence: 'DOC-101 p.1 · Signature: Present' },
    { label: 'Beneficiary allocation totals 100%', pass: true, evidence: 'DOC-101 p.1 · Allocation: 100%' },
  ], report: 'All configured checks passed. The request is ready for human review. No policy change has been approved or executed.', recommendation: 'Recommend standard human review' },
  { id: 'PS-1043', name: 'Missing documentation', type: 'Ownership transfer', person: 'Taylor Reed', policy: 'SYN-482602', status: 'Missing document', documents: [
    { name: 'Ownership transfer form', ref: 'DOC-201 · page 1', text: 'Synthetic document — ownership transfer request', fields: { 'Policy number': 'SYN-482602', 'Current owner': 'Taylor Reed', 'Proposed owner': 'Casey Reed', 'Signature': 'Present', 'Signed date': '2026-10-16' } },
  ], checks: [
    { label: 'Ownership transfer form is present', pass: true, evidence: 'DOC-201 p.1' },
    { label: 'Identity verification for proposed owner', pass: false, evidence: 'No identity record supplied for Casey Reed' },
    { label: 'Owner signature is present', pass: true, evidence: 'DOC-201 p.1 · Signature: Present' },
    { label: 'Proposed owner acknowledgment', pass: false, evidence: 'No acknowledgment supplied in document package' },
  ], report: 'Two configured requirements are missing: identity verification and the proposed owner acknowledgment. A reviewer should request these documents before considering the transfer.', recommendation: 'Recommend requesting missing documents' },
  { id: 'PS-1044', name: 'Conflicting information', type: 'Policy information update', person: 'Sam Rivera', policy: 'SYN-482603', status: 'Field conflict', documents: [
    { name: 'Policy update form', ref: 'DOC-301 · page 1', text: 'Synthetic document — policy information update', fields: { 'Policy number': 'SYN-482603', 'Policy owner': 'Sam Rivera', 'Mailing address': '18 Oak Lane, Example City', 'Signature': 'Present' } },
    { name: 'Supporting address record', ref: 'DOC-302 · page 1', text: 'Synthetic supporting address record', fields: { 'Policy number': 'SYN-482603', 'Verified name': 'Sam Rivera', 'Mailing address': '81 Oak Lane, Example City', 'Verification': 'Present' } },
  ], checks: [
    { label: 'Required update and supporting record', pass: true, evidence: 'DOC-301 p.1; DOC-302 p.1' },
    { label: 'Policy number matches across documents', pass: true, evidence: 'SYN-482603 · DOC-301 p.1; DOC-302 p.1' },
    { label: 'Mailing address is consistent', pass: false, evidence: 'DOC-301 p.1: 18 Oak Lane; DOC-302 p.1: 81 Oak Lane' },
    { label: 'Owner signature is present', pass: true, evidence: 'DOC-301 p.1 · Signature: Present' },
  ], report: 'The mailing addresses conflict: the form lists 18 Oak Lane and the supporting record lists 81 Oak Lane. A reviewer should confirm the correct address with the policy owner.', recommendation: 'Recommend clarification of conflicting address' },
];

export const enrollment = [
  { id: 'M-1001', name: 'Alex Morgan', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1002', name: 'Taylor Reed', plan: 'Plus', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1003', name: 'Sam Rivera', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1004', name: 'Jamie Chen', plan: 'Plus', eligible: 'No', effective: '2026-10-01' },
  { id: 'M-1005', name: 'Drew Ellis', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1006', name: 'Casey Blake', plan: 'Plus', eligible: 'Yes', effective: '2026-10-01' },
];
export const benefits = [
  { id: 'M-1001', name: 'Alex Morgan', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1002', name: 'Taylor Reed', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1004', name: 'Jamie Chen', plan: 'Plus', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1005', name: 'Drew Ellis', plan: 'Core', eligible: 'Yes', effective: '2026-10-15' },
  { id: 'M-1006', name: 'Casey Blake', plan: 'Plus', eligible: 'Yes', effective: '2026-10-01' },
  { id: 'M-1007', name: 'Robin Hayes', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' },
];

export function reconcileRecords(left = enrollment, right = benefits) {
  const ids = [...new Set([...left, ...right].map(r => r.id))];
  return ids.map(id => {
    const a = left.find(r => r.id === id), b = right.find(r => r.id === id);
    const fields = a && b ? ['plan', 'eligible', 'effective'].filter(k => a[k] !== b[k]) : [];
    const category = !a ? 'Missing enrollment' : !b ? 'Missing benefits record' : fields.includes('plan') ? 'Plan mismatch' : fields.includes('eligible') ? 'Eligibility conflict' : fields.includes('effective') ? 'Date mismatch' : 'Matched';
    return { id, name: (a || b).name, a, b, fields, category, matched: Boolean(a && b && !fields.length) };
  });
}

export const regulations = [
  { id: 'SIM-REG-001', title: 'Policyholder notice requirements', state: 'Fictional jurisdiction A', category: 'Customer communications', previous: 'Provide an annual policyholder summary containing coverage and contact information.', updated: 'Provide an annual policyholder summary containing coverage, contact information, and a clearly labeled servicing escalation contact.', source: 'SIM-REG-001 § 4.2 · simulated update v2', document: 'Annual Notice Procedure · SYN-PROC-12 v1', excerpt: 'Annual summaries include coverage details and the general customer service contact.', gap: 'The internal procedure does not identify a dedicated servicing escalation contact.', recommendation: 'Ask the procedure owner to validate the applicability of the update and draft a revised notice template with an escalation contact.', severity: 'Potential documentation gap' },
  { id: 'SIM-REG-002', title: 'Beneficiary review documentation', state: 'Fictional jurisdiction B', category: 'Policy servicing', previous: 'Maintain a record of the beneficiary change request and its outcome.', updated: 'Maintain the request, its outcome, and an explicit reviewer acknowledgment in the beneficiary change record.', source: 'SIM-REG-002 § 2.1 · simulated update v2', document: 'Beneficiary Change Procedure · SYN-PROC-24 v1', excerpt: 'Store the submitted request and final outcome in the policy servicing record.', gap: 'An explicit reviewer acknowledgment is not addressed in the stored-record procedure.', recommendation: 'Have a compliance specialist confirm scope and assess whether the record template should capture a reviewer acknowledgment.', severity: 'Specialist review required' },
  { id: 'SIM-REG-003', title: 'Product disclosure version tracking', state: 'Fictional jurisdiction C', category: 'Product governance', previous: 'Provide current disclosure documents with new product materials.', updated: 'Provide current disclosure documents and retain the distributed document version in the product record.', source: 'SIM-REG-003 § 3.3 · simulated update v2', document: 'Product Disclosure Standard · SYN-PROC-31 v3', excerpt: 'Distribute approved current disclosures and record the disclosure version alongside the product materials.', gap: 'The retrieved procedure addresses version tracking. Confirm that execution and evidence retention follow the documented process.', recommendation: 'Request a sample product record from the process owner to validate operational evidence before closing the review.', severity: 'Evidence validation required' },
];

export const phases = [
  { title: 'Discovery', subtitle: 'Define the right problem', items: ['Confirm process owners and understand current workflows.', 'Identify existing automation and potential overlap.', 'Establish measurable baseline metrics.', 'Determine available data sources.'], gate: 'Agreed scope, baseline, and accountable process owner' },
  { title: 'Proof of Concept', subtitle: 'Demonstrate a narrow workflow', items: ['Use synthetic or explicitly approved data.', 'Build a narrow agent workflow.', 'Demonstrate core capabilities with traceable evidence.', 'Measure initial accuracy and processing time.'], gate: 'Evidence that the core workflow is feasible' },
  { title: 'Controlled Pilot', subtitle: 'Evaluate in a governed setting', items: ['Integrate approved enterprise systems.', 'Introduce human review and governance.', 'Test security, reliability, and exception handling.', 'Evaluate results against baseline metrics.'], gate: 'Validated controls and measured pilot outcomes' },
  { title: 'Production Evaluation', subtitle: 'Make an evidence-based decision', items: ['Review pilot outcomes with process owners.', 'Validate implementation costs and ROI.', 'Determine integration and operating requirements.', 'Decide whether further deployment is justified.'], gate: 'Documented deployment decision and operating model' },
];

const component = (name, purpose, input, output, technologies, dependencies, security) => ({ name, purpose, input, output, technologies, dependencies, security });
export const layers = [
  { label: 'Enterprise data sources', caption: 'Authorized information', icon: 'Database', components: [
    component('Policy administration', 'Provide authoritative policy and servicing context.', 'Policy IDs and approved servicing queries', 'Policy metadata and request records', 'Existing enterprise policy platforms', 'System owner approval; documented data contracts', 'Read-only access; field-level permissions; minimize policyholder data'),
    component('Document repositories', 'Supply source documents for evidence-backed review.', 'Document IDs and scoped search queries', 'Versioned source documents and metadata', 'Enterprise content management; object storage', 'Document access; stable references; retention policies', 'Document-level access checks; encryption; access audit trail'),
    component('Enrollment & benefits', 'Supply records for deterministic cross-system reconciliation.', 'Authorized batch or API queries', 'Enrollment, eligibility, and benefit records', 'Existing enrollment and benefits platforms', 'Stable member IDs; approved data owners', 'Restrict sensitive member data and enforce purpose-limited access'),
    component('Regulatory sources', 'Provide approved, versioned regulatory publications.', 'Approved source list and change criteria', 'Source publications and version changes', 'Approved publisher APIs or managed ingestion', 'Source approval; update rights; publication history', 'Validate provenance; isolate untrusted source content'),
    component('Internal policies', 'Provide versioned procedures and product documents.', 'Product scope and authorized retrieval query', 'Applicable procedures and product requirements', 'Enterprise knowledge repositories', 'Document owners; version metadata; access policy', 'Preserve entitlements during retrieval; audit source versions'),
  ] },
  { label: 'Integration & processing', caption: 'Connect, parse, validate', icon: 'Cable', components: [
    component('Authorized APIs', 'Read enterprise data through controlled interfaces.', 'Scoped service identity and validated requests', 'Authorized structured responses', 'API gateway; approved enterprise connectors', 'API availability; access approval; rate limits', 'Least privilege; authentication; secret management; no open write tools'),
    component('Document ingestion', 'Parse documents and preserve page-level provenance.', 'Approved documents and metadata', 'Extracted text, fields, and source locations', 'OCR; document parsers; watsonx.ai where appropriate', 'Document quality; supported formats; extraction evaluation', 'Malware checks; sensitive-data controls; treat text as untrusted input'),
    component('Data normalization', 'Map source records into a stable comparison model.', 'Source records and approved mapping rules', 'Normalized member, plan, and policy fields', 'ETL pipelines; schema validation; deterministic code', 'Agreed schemas; identifiers; date semantics', 'Minimize copied data; protect temporary storage; log transformations'),
    component('Validation & retrieval', 'Validate inputs and retrieve authorized supporting evidence.', 'Normalized data, query, and user access context', 'Validated records and cited evidence chunks', 'Schema validators; search or vector retrieval', 'Versioned rules; indexed sources; entitlement-aware search', 'Filter by access rights before retrieval; redact unnecessary data'),
  ] },
  { label: 'AI agent orchestration', caption: 'Reason within boundaries', icon: 'Workflow', components: [
    component('Workflow orchestration', 'Coordinate typed steps, retries, and human handoffs.', 'Validated request and workflow state', 'Traceable workflow execution and review tasks', 'watsonx Orchestrate as a possible orchestration component', 'Approved tools; explicit workflow states; failure handling', 'Bound execution; allowlist tools; enforce review gates'),
    component('Specialized agents', 'Prepare task-specific analysis for servicing, reconciliation, or compliance.', 'Scoped task context and allowed tools', 'Draft findings and evidence-backed recommendations', 'watsonx.ai models; task-specific agent implementations', 'Evaluated prompts; approved model endpoint; business owner', 'Prevent source prompt injection; disallow autonomous sensitive decisions'),
    component('Retrieval-augmented generation', 'Ground draft answers in authorized source material.', 'Task question and access-scoped evidence', 'Cited draft analysis', 'watsonx.ai; enterprise retrieval and vector search', 'Curated index; versioned source documents; retrieval evaluation', 'Enforce source entitlements and evaluate citation support'),
    component('Deterministic business rules', 'Perform auditable completeness and record comparison checks.', 'Normalized fields and versioned rule definitions', 'Pass/fail checks and classified exceptions', 'Rules engine; tested deterministic services', 'Process owner validation; explicit rule precedence', 'Version rules; test edge cases; separate rules from model prose'),
    component('Context & tool controls', 'Keep scoped execution state and constrain every tool action.', 'Case ID, permitted context, and tool requests', 'Minimal retained state and approved tool responses', 'State store; tool gateway; policy engine', 'Retention policy; access identity; tool contracts', 'Isolate cases; expiry; tool allowlists; no unapproved write access'),
  ] },
  { label: 'Human review', caption: 'People stay accountable', icon: 'Users', components: [
    component('Exception queues', 'Route incomplete or inconsistent cases to accountable reviewers.', 'Classified exceptions and case metadata', 'Assigned review tasks with status', 'Existing case management; watsonx Orchestrate tasks', 'Queue owner; routing rules; service expectations', 'Role-restricted queues; protect personal data; audit assignments'),
    component('Evidence inspection', 'Let reviewers inspect the source behind each finding.', 'Findings, source IDs, and extracted fields', 'Reviewer-validated evidence and notes', 'Document viewer; comparison interface', 'Stable citations; document entitlements', 'Authorize every source lookup; record reviewer actions'),
    component('Approval workflows', 'Capture explicit human decisions before sensitive downstream work.', 'Draft recommendation and supporting evidence', 'Approved, rejected, or escalated review decision', 'Enterprise workflow and case management', 'Named approvers; separation of duties', 'Authenticated approvals; prevent self-approval where required'),
    component('Escalation & overrides', 'Support manual handling and specialist escalation.', 'Unresolved exceptions or challenged findings', 'Documented manual resolution or specialist task', 'Case-management queues; escalation policies', 'Escalation owner; override reason; response policy', 'Require reasons; preserve original findings; log overrides'),
  ] },
  { label: 'Governance & security', caption: 'Controls across every layer', icon: 'ShieldCheck', components: [
    component('Identity & role-based access', 'Enforce authorized access for users and service identities.', 'Enterprise identity and role assignments', 'Scoped access decisions', 'Enterprise identity provider; IAM; RBAC', 'Identity federation; approved roles; entitlement mappings', 'Least privilege; periodic access review; scoped service credentials'),
    component('Encryption & data protection', 'Protect sensitive information in transit, at rest, and in model context.', 'Data classifications and approved retention rules', 'Encrypted, minimized, and protected data flows', 'TLS; key management; data-loss prevention', 'Key ownership; classification; retention approvals', 'Redact unnecessary identifiers; rotate keys; restrict model logging'),
    component('Audit & observability', 'Record execution, evidence versions, decisions, and operational health.', 'Workflow events, model metadata, and review decisions', 'Auditable traces, metrics, and alerts', 'Enterprise logging; OpenTelemetry; monitoring tools', 'Event schema; retention; alert owners', 'Protect audit integrity; redact sensitive fields; restrict log access'),
    component('Model & output evaluation', 'Assess quality, grounding, reliability, and drift before broader use.', 'Test cases, model outputs, and reviewer feedback', 'Evaluation results and release gates', 'watsonx.governance as a possible governance component', 'Representative test set; quality thresholds; risk owner', 'Test injection resistance, leakage, citation quality, and unfair outcomes'),
  ] },
];

export const riskTopics = [
  ['Existing tools & initiatives', 'Confirm whether current case management, reconciliation automation, regulatory monitoring, or AI initiatives already address this workflow. Align with existing owners before building.'],
  ['Data availability & quality', 'Assess source completeness, consistent identifiers, document legibility, version history, and representative exceptions. Synthetic demo results do not establish production accuracy.'],
  ['Integration dependencies', 'Validate authorized APIs, access patterns, environments, throughput limits, and ownership. No client integration or enterprise deployment is implemented in this prototype.'],
  ['Privacy & security', 'Confirm data classification, access controls, retention, encryption, and approved model hosting. Minimize sensitive data and evaluate source prompt injection.'],
  ['Compliance considerations', 'Validate applicable policies, legal requirements, record retention, and required approvals with qualified specialists. This prototype provides no legal or compliance determination.'],
  ['Human involvement', 'Name reviewers and escalation owners. Define approval authority, manual overrides, queue ownership, and response expectations before a pilot.'],
  ['Reliability & evaluation', 'Agree on test sets and thresholds for extraction, matching, evidence support, false exceptions, latency, and failure recovery. Measure against an observed baseline.'],
  ['Unknown business requirements', 'Confirm actual process pain points, monthly volumes, exception patterns, baseline handling time, costs, and the definition of success with process owners.'],
];

export function calculateValue({ volume, current, assisted, escalation, labor, operating }) {
  const effective = (1 - escalation / 100) * assisted + (escalation / 100) * current;
  const monthlyHours = volume * (current - effective) / 60;
  const annualHours = monthlyHours * 12;
  const gross = annualHours * labor;
  const net = gross - operating;
  return { effective, monthlyHours, annualHours, gross, net, roi: operating > 0 ? net / operating * 100 : null };
}
