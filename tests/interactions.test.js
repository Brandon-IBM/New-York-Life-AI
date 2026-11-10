import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const bundlePath = html.match(/<script[^>]*src="([^"]+)"/)[1];
const bundle = fs.readFileSync(new URL(`../dist/${bundlePath}`, import.meta.url), 'utf8');

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, message = 'condition', timeout = 3000) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeout) throw new Error(`Timed out waiting for ${message}`);
    await pause(10);
  }
}

async function setup(hash = 'overview') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: `https://showcase.test/#${hash}`, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
  });
  const { window } = dom;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.print = () => { window.printCalled = true; };
  const interval = window.setInterval.bind(window);
  window.setInterval = (fn, delay) => interval(fn, Math.min(delay, 20));
  window.eval(bundle);
  await until(() => window.document.querySelector('main h1'), 'application render');
  const document = window.document;
  const button = text => [...document.querySelectorAll('main button'), ...document.querySelectorAll('button')].find(el => el.textContent.trim() === text);
  const click = async text => { const el = button(text); assert.ok(el, `Button exists: ${text}`); assert.equal(el.disabled, false, `Button enabled: ${text}`); el.click(); await pause(25); };
  const select = async (id, value) => { const el = document.getElementById(id); el.value = String(value); el.dispatchEvent(new window.Event('change', { bubbles: true })); await pause(25); };
  const input = async (id, value) => { const el = document.getElementById(id); Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, String(value)); el.dispatchEvent(new window.Event('input', { bubbles: true })); await pause(25); };
  return { dom, window, document, errors, button, click, select, input, close: () => dom.window.close() };
}

test('overview supports comparison, agent navigation, and print export', async () => {
  const app = await setup();
  try {
    assert.equal(app.document.querySelectorAll('.system-story').length, 3);
    assert.equal(app.document.querySelector('.sidebar'), null);
    assert.ok(app.document.querySelector('.hero-copy').textContent.trim().split(/\s+/).length <= 45);
    const comparison = app.document.querySelector('.comparison-disclosure');
    assert.equal(comparison.open, false);
    comparison.querySelector('summary').click();
    assert.equal(comparison.open, true);
    assert.equal(app.document.querySelectorAll('.comparison-table tbody tr').length, 7);
    await app.click('Policy Servicing QA');
    assert.equal(app.window.location.hash, '#policy');
    await app.click('Export overview');
    assert.equal(app.window.printCalled, true);
    assert.equal(app.document.querySelectorAll('.print-overview section').length, 4);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('all three policy scenarios show the correct issues and human decision controls', async () => {
  const app = await setup('policy');
  try {
    for (const [index, issueCount] of [[0, 0], [1, 2], [2, 1]]) {
      await app.select('policy-case', index);
      await app.click('Run Agent');
      assert.equal(app.document.getElementById('policy-case').disabled, true);
      await until(() => app.document.querySelector('.report-panel'), 'policy report');
      assert.equal(app.document.querySelectorAll('.validation-list .failed').length, issueCount);
      assert.equal(app.document.querySelectorAll('.field-list > div').length > 0, true);
      await app.click('Accept recommendation');
      assert.match(app.document.querySelector('.human-review-bar').textContent, /Recommendation accepted by reviewer/);
      assert.equal(app.button('Accept recommendation').disabled, true);
      assert.equal(app.button('Return for rework').disabled, true);
      await app.select('policy-case', (index + 1) % 3);
      assert.equal(app.document.querySelector('.report-panel'), null);
    }
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('fictional policy documents can be inspected and dismissed with Escape', async () => {
  const app = await setup('policy');
  try {
    app.document.querySelector('.document-chip').click();
    await until(() => app.document.querySelector('[role="dialog"]'), 'source document');
    assert.match(app.document.querySelector('.document-preview').textContent, /SYN-482601/);
    app.document.dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await pause(30);
    assert.equal(app.document.querySelector('[role="dialog"]'), null);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('reconciliation shows five traceable exceptions and preserves review versus correction', async () => {
  const app = await setup('benefits');
  try {
    assert.equal(app.document.querySelectorAll('.record-table tbody tr').length, 12);
    await app.click('Run Reconciliation');
    await until(() => app.document.querySelector('.exception-table'), 'exception queue');
    assert.equal(app.document.querySelectorAll('.exception-table tbody tr').length, 5);
    await app.select('exception-filter', 'Missing enrollment');
    assert.equal(app.document.querySelectorAll('.exception-table tbody tr').length, 1);
    app.document.querySelector('.member-link').click();
    await until(() => app.document.querySelector('[role="dialog"]'), 'exception evidence');
    assert.match(app.document.querySelector('[role="dialog"]').textContent, /No record with this member ID/);
    await app.click('Mark evidence reviewed');
    assert.equal(app.document.querySelector('[role="dialog"]'), null);
    assert.match(app.document.querySelector('.exception-table').textContent, /Evidence reviewed/);
    assert.match(app.document.querySelector('.toast').textContent, /Source correction remains pending/);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('all regulatory scenarios generate cited drafts and simulated human review handoffs', async () => {
  const app = await setup('compliance');
  try {
    for (let i = 0; i < 3; i++) {
      app.document.querySelectorAll('.update-item')[i].click();
      await pause(30);
      await app.click('Analyze Impact');
      await until(() => app.button('Generate draft assessment'), 'impact results');
      assert.match(app.document.querySelector('.evidence-doc').textContent, /SYN-PROC/);
      await app.click('Generate draft assessment');
      assert.match(app.document.querySelector('[role="dialog"]').textContent, /requires specialist validation/);
      assert.equal(app.document.querySelectorAll('.assessment-content h3').length, 4);
      await app.click('Send to simulated review');
      assert.equal(app.button('Queued for specialist review').disabled, true);
      app.document.querySelector('[aria-label="Close dialog"]').click();
      await pause(25);
    }
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('value assumptions update outputs, handle zero cost, and persist across page navigation', async () => {
  const app = await setup('policy');
  try {
    await app.click('Business value');
    assert.equal(app.document.querySelector('.value-output > strong').textContent, '$86,720');
    await app.input('policy-escalation', 100);
    assert.equal(app.document.querySelector('.value-output > strong').textContent, '-$40,000');
    await app.input('policy-operating', 0);
    assert.match(app.document.querySelector('.output-roi').textContent, /N\/A/);
    await app.click('Overview');
    await app.click('Policy Servicing QA');
    await app.click('Business value');
    assert.equal(app.document.getElementById('policy-escalation').value, '100');
    await app.click('Reset');
    assert.equal(app.document.getElementById('policy-escalation').value, '20');
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('all architecture components open details and roadmap phases expose decision gates', async () => {
  const app = await setup('architecture');
  try {
    assert.equal(app.document.querySelectorAll('.architecture-layer').length, 6);
    const components = [...app.document.querySelectorAll('.layer-components button')];
    assert.equal(components.length, 22);
    for (const el of components) {
      el.click();
      await until(() => app.document.querySelector('[role="dialog"]'), 'component detail');
      assert.equal(app.document.querySelectorAll('.component-details > div').length, 5);
      assert.match(app.document.querySelector('[role="dialog"]').textContent, /Security considerations/);
      app.document.querySelector('[aria-label="Close dialog"]').click();
      await pause(20);
    }
    for (let i = 0; i < 4; i++) {
      app.document.querySelectorAll('.roadmap-tabs button')[i].click();
      await pause(25);
      assert.equal(app.document.querySelectorAll('.roadmap-detail li').length, 4);
      assert.ok(app.document.querySelector('.phase-gate > strong').textContent.length > 10);
    }
    [...app.document.querySelectorAll('.architecture-switch button')].find(el => el.textContent.trim() === 'Benefits Reconciliation').click();
    await pause(30);
    assert.match(app.document.querySelector('.scope-strip').textContent, /Enrollment system/);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('agent discovery accordions expose eight risks and workflow-specific questions', async () => {
  const app = await setup('policy');
  try {
    await app.click('Discovery');
    assert.equal(app.document.querySelectorAll('.accordion-item').length, 8);
    assert.equal(app.document.querySelectorAll('.discovery-card li').length, 5);
    await app.click('Privacy & security');
    assert.match(app.document.querySelector('.accordion-item.is-open').textContent, /prompt injection/);
    await app.click('Architecture');
    assert.equal(app.document.querySelectorAll('.workflow-nodes button').length, 6);
    app.document.querySelectorAll('.workflow-nodes button')[5].click();
    await pause(25);
    assert.match(app.document.querySelector('.workflow-step-detail').textContent, /Only an authorized human/);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('homepage product previews run real synthetic checks and reveal supporting evidence', async () => {
  const app = await setup();
  try {
    const policy = app.document.querySelector('.policy-preview');
    assert.equal(policy.querySelectorAll('.check-marker.issue').length, 0);
    policy.querySelector('.preview-run').click();
    await until(() => policy.querySelector('.preview-run').textContent.includes('Run again'), 'policy preview results');
    assert.equal(policy.querySelectorAll('.check-marker.issue').length, 2);
    policy.querySelectorAll('.preview-checks button')[1].click();
    await pause(25);
    assert.match(policy.textContent, /No identity record supplied for Casey Reed/);
    await app.select('preview-case', 2);
    assert.equal(policy.querySelectorAll('.check-marker.issue').length, 0);
    policy.querySelector('.preview-run').click();
    await until(() => policy.querySelector('.preview-run').textContent.includes('Run again'), 'conflicting request preview');
    assert.equal(policy.querySelectorAll('.check-marker.issue').length, 1);

    const reconciliation = app.document.querySelector('.benefits-preview');
    assert.equal(reconciliation.querySelectorAll('tbody tr').length, 12);
    reconciliation.querySelector('.preview-run').click();
    await until(() => reconciliation.querySelector('.preview-run').textContent.includes('Run again'), 'reconciliation preview');
    assert.match(reconciliation.querySelector('.preview-footer').textContent, /2 matched \/ 5 exceptions/);

    const compliance = app.document.querySelector('.compliance-preview');
    compliance.querySelector('.preview-evidence').click();
    await pause(25);
    assert.match(compliance.querySelector('.preview-evidence-body').textContent, /SYN-PROC-12/);
    compliance.querySelector('.preview-run').click();
    await until(() => compliance.querySelector('.preview-run').textContent.includes('Run again'), 'regulatory preview');
    assert.match(compliance.textContent, /SPECIALIST REVIEW PENDING/);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('shared business-value page retains separate assumptions for every agent', async () => {
  const app = await setup('value');
  try {
    await app.input('policy-volume', 100);
    app.document.querySelectorAll('.value-system-tabs button')[1].click();
    await pause(25);
    assert.equal(app.document.getElementById('benefits-volume').value, '1200');
    await app.input('benefits-volume', 500);
    app.document.querySelectorAll('.value-system-tabs button')[0].click();
    await pause(25);
    assert.equal(app.document.getElementById('policy-volume').value, '100');
    const method = app.document.querySelector('.method-disclosure');
    assert.equal(method.open, false);
    method.querySelector('summary').click();
    assert.equal(method.open, true);
    assert.match(method.textContent, /review is counted once/);
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});

test('mobile navigation and keyboard tabs expose the redesigned workspaces', async () => {
  const app = await setup();
  try {
    app.document.querySelector('[aria-controls="site-navigation"]').click();
    await pause(25);
    assert.equal(app.document.querySelector('[aria-controls="site-navigation"]').getAttribute('aria-expanded'), 'true');
    app.document.querySelector('.systems-nav > summary').click();
    const nav = app.document.querySelector('.systems-nav');
    assert.equal(nav.open, true);
    [...nav.querySelectorAll('button')].find(el => el.textContent.trim() === '01Policy Servicing QA').click();
    await pause(30);
    assert.equal(app.window.location.hash, '#policy');
    assert.equal(nav.open, false);
    assert.equal(app.document.querySelector('[aria-controls="site-navigation"]').getAttribute('aria-expanded'), 'false');
    const tabs = [...app.document.querySelectorAll('.page-tabs [role="tab"]')];
    tabs[0].focus();
    tabs[0].dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await pause(25);
    assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
    assert.ok(app.document.querySelector('.value-output'));
    assert.deepEqual(app.errors, []);
  } finally { app.close(); }
});
