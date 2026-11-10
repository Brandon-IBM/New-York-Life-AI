import { test, expect } from '@playwright/test';

test('overview, comparison, and responsive navigation', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('main h1')).toContainText('Intelligent systems.');
  await expect(page.locator('.system-story')).toHaveCount(3);
  await page.locator('.comparison-disclosure > summary').click();
  await expect(page.locator('.comparison-table tbody tr')).toHaveCount(7);
  await page.locator('.comparison-disclosure > summary').click();
  await page.getByRole('button', { name: 'Overview', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('overview.png'), fullPage: true });
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('.systems-nav > summary').click();
  await page.getByRole('navigation').getByRole('button', { name: 'Policy Servicing QA' }).click();
  await expect(page.locator('main h1')).toHaveText('Policy Servicing QA Agent');
  expect(errors).toEqual([]);
});

test('policy cases, evidence inspection, and recommendation review', async ({ page }) => {
  await page.goto('/#policy');
  for (const [value, exceptions] of [['0', 0], ['1', 2], ['2', 1]]) {
    await page.getByLabel('SAMPLE SERVICING CASE').selectOption(value);
    await page.getByRole('button', { name: 'Run Agent', exact: true }).click();
    await expect(page.locator('.report-panel')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.validation-list .failed')).toHaveCount(exceptions);
    await page.getByRole('button', { name: 'Accept recommendation' }).click();
    await expect(page.locator('.human-review-bar')).toContainText('Recommendation accepted by reviewer');
  }
  await page.locator('.document-chip').first().click();
  await expect(page.getByRole('dialog')).toContainText('DEMONSTRATION ONLY');
  await page.getByRole('button', { name: 'Close dialog' }).click();
});

test('benefits reconciliation and traceable exception inspection', async ({ page }) => {
  await page.goto('/#benefits');
  await page.getByRole('button', { name: 'Run Reconciliation' }).click();
  await expect(page.locator('.exception-table tbody tr')).toHaveCount(5, { timeout: 10000 });
  await page.getByLabel('Filter exceptions').selectOption('Missing enrollment');
  await page.locator('.member-link').click();
  await expect(page.getByRole('dialog')).toContainText('No record with this member ID');
  await page.getByRole('button', { name: 'Mark evidence reviewed' }).click();
  await expect(page.locator('.exception-table')).toContainText('Evidence reviewed');
});

test('regulatory impact draft and export', async ({ page }) => {
  await page.goto('/#compliance');
  await page.getByRole('button', { name: 'Analyze Impact' }).click();
  await page.getByRole('button', { name: 'Generate draft assessment' }).click();
  await expect(page.getByRole('dialog')).toContainText('requires specialist validation');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export draft' }).click();
  expect((await download).suggestedFilename()).toBe('SIM-REG-001-draft-assessment.txt');
});

test('calculator, component details, and roadmap', async ({ page }, testInfo) => {
  await page.goto('/#policy');
  await page.getByRole('tab', { name: 'Business value', exact: true }).click();
  await expect(page.locator('.value-output > strong')).toHaveText('$86,720');
  await page.getByLabel('Escalation rate').fill('100');
  await expect(page.locator('.value-output > strong')).toHaveText('-$40,000');
  await page.screenshot({ path: testInfo.outputPath('calculator.png'), fullPage: true });
  await page.goto('/#architecture');
  await page.getByRole('button', { name: 'Workflow orchestration', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('watsonx Orchestrate');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: /PHASE 04/ }).click();
  await expect(page.locator('.roadmap-detail')).toContainText('Documented deployment decision');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('architecture.png'), fullPage: true });
});
