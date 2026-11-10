import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateValue, reconcileRecords, policyCases } from '../src/data.js';

const assumptions = { volume: 1200, current: 20, assisted: 8, escalation: 20, labor: 55, operating: 40000 };

test('illustrative business case includes routine review once and weights escalations', () => {
  const r = calculateValue(assumptions);
  assert.ok(Math.abs(r.effective - 10.4) < 0.000001);
  assert.equal(r.monthlyHours, 192);
  assert.equal(r.annualHours, 2304);
  assert.equal(r.gross, 126720);
  assert.equal(r.net, 86720);
  assert.equal(r.roi, 216.8);
});

test('full escalation preserves all baseline labor and exposes operating cost', () => {
  const r = calculateValue({ ...assumptions, escalation: 100 });
  assert.equal(r.annualHours, 0);
  assert.equal(r.net, -40000);
  assert.equal(r.roi, -100);
});

test('zero volume and zero operating cost do not produce an infinite ROI', () => {
  const r = calculateValue({ ...assumptions, volume: 0, operating: 0 });
  assert.equal(r.net, 0);
  assert.equal(r.roi, null);
});

test('slower assisted handling retains negative capacity value', () => {
  const r = calculateValue({ ...assumptions, assisted: 30 });
  assert.ok(r.annualHours < 0);
  assert.ok(r.gross < 0);
  assert.ok(r.net < -assumptions.operating);
});

test('reconciliation accounts for members missing from either system', () => {
  const results = reconcileRecords();
  assert.equal(results.length, 7);
  assert.equal(results.filter(r => r.matched).length, 2);
  assert.equal(results.filter(r => !r.matched).length, 5);
  assert.equal(results.find(r => r.id === 'M-1003').category, 'Missing benefits record');
  assert.equal(results.find(r => r.id === 'M-1007').category, 'Missing enrollment');
  assert.equal(results.find(r => r.id === 'M-1002').category, 'Plan mismatch');
  assert.equal(results.find(r => r.id === 'M-1004').category, 'Eligibility conflict');
  assert.equal(results.find(r => r.id === 'M-1005').category, 'Date mismatch');
});

test('reconciliation joins by unique ID even when record ordering differs', () => {
  const a = [{ id: '1', name: 'A', plan: 'Core', eligible: 'Yes', effective: '2026-10-01' }, { id: '2', name: 'B', plan: 'Plus', eligible: 'No', effective: '2026-10-01' }];
  const r = reconcileRecords(a, [...a].reverse());
  assert.equal(r.filter(x => x.matched).length, 2);
  assert.deepEqual(reconcileRecords([], []), []);
});

test('synthetic policy scenarios expose complete, missing, and conflicting evidence', () => {
  assert.equal(policyCases[0].checks.filter(c => !c.pass).length, 0);
  assert.equal(policyCases[1].checks.filter(c => !c.pass).length, 2);
  assert.equal(policyCases[2].checks.filter(c => !c.pass).length, 1);
  assert.ok(policyCases.every(c => c.checks.every(check => check.evidence)));
});
