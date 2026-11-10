# New York Life | AI Agent Opportunities

An interactive enterprise solution showcase prepared by **Sid & Brandon | IBM Consulting** for internal discussion. All opportunities are exploratory concepts, not existing products or validated New York Life requirements.

## Run locally

Requires Node.js 22.12+ or 24+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Use `npm run build` for a production bundle in `dist/`, and `npm run preview` to preview that bundle.

## Explore

- **Overview:** a minimal product introduction, three working product previews, an expandable seven-area comparison, and clean PDF printing.
- **Policy Servicing QA:** complete, missing-document, and conflicting-information cases; fictional source documents; step-by-step execution; extracted fields; validation evidence; report downloads; and simulated reviewer decisions.
- **Benefits Reconciliation:** two fictional source tables, deterministic member-ID matching, field-level discrepancies, five exception categories, filterable evidence inspection, and reviewer status tracking.
- **Product Compliance:** three fictional regulatory changes, previous/updated requirements, cited internal procedure comparisons, potential gaps, and downloadable draft assessments for specialist review.
- **Architecture & Implementation:** six connected stages with 22 inspectable components, component detail drawers, scoped diagrams for each agent, candidate IBM technologies, four implementation stages with decision gates, and discovery questions.
- **Business Value:** a shared worksheet with independent assumptions for each agent and transparent formulas available on demand.

Each agent includes a business value calculator, workflow diagram, eight expandable risk topics, and workflow-specific discovery questions. Calculator assumptions persist across navigation for the current session. Demo runs reset when leaving their tab or page. No data is stored or transmitted to enterprise systems.

The visual system uses New York Life blue (`#0468FF`), white (`#FFFFFF`), and black (`#000000`), with neutral gray dividers and secondary text. Inter typography, simple top navigation, and expandable technical details keep the main experience minimal. The architecture explorer uses a black canvas. Motion respects reduced-motion preferences.

## Value model

Every starting value is labeled **Illustrative assumptions — not client data**. Assisted processing time represents human handling, including routine review, on a standard case. Escalated cases retain the entire current human handling time in place of standard assisted time.

```text
Weighted minutes = (1 − escalation fraction) × assisted minutes
                   + escalation fraction × current minutes
Monthly hours saved = monthly volume × (current − weighted minutes) ÷ 60
Annual hours saved = monthly hours saved × 12
Gross annual capacity value = annual hours saved × fully loaded hourly cost
Annual net benefit = gross capacity value − annual operating cost
ROI = annual net benefit ÷ annual operating cost × 100
```

Negative savings remain visible; ROI is undefined at zero operating cost. Human review is counted once. Capacity value does not necessarily represent cash savings. The recurring-cost model excludes one-time implementation costs, which must be evaluated separately.

## Verification

```sh
npm test
```

Builds the app and runs calculation/data tests and DOM interaction tests against the production JavaScript. Coverage includes all policy and regulatory scenarios, reconciliation exceptions, reviewer controls, source inspection, all architecture component details, roadmap phases, calculator edge cases, navigation, and print invocation. DOM checks do not verify visual layout.

For real browser checks and desktop/mobile screenshots:

```sh
npx playwright install chromium
npm run test:browser
```

To use an existing Google Chrome installation instead: `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`. Browser tests require permission to start a localhost server and a browser process.

## Print or host

Choose **Export overview**, then select **Save as PDF** in the browser print dialog. The print layout includes all three concepts, current calculator assumptions, formulas, human review boundaries, architecture, and roadmap.

The production output is a static site with hash-based navigation and relative asset paths, suitable for static hosting or GitHub Pages. Publish the contents of `dist/`; the existing `nyl.fncai.org` CNAME is preserved in the build.

### GitHub Pages

Vite requires a build step. Publishing the repository root directly will serve the development HTML without compiling the React application.

1. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
2. Commit and push `.github/workflows/deploy-pages.yml` and the application files to `main`.
3. Open **Actions → Deploy to GitHub Pages** and wait for both `build` and `deploy` to succeed. The workflow installs dependencies, builds the app, runs the automated checks, and publishes `dist/`.
4. Open the deployment URL shown by the workflow. Future pushes to `main` redeploy the site. You can also start a deployment with **Run workflow** on the Actions page.

The existing Vite `base: './'` supports both a repository Pages URL and the custom domain. Hash-based page navigation requires no server rewrite rules.

For `nyl.fncai.org`, keep **Settings → Pages → Custom domain** set to that hostname and configure its DNS CNAME to point to `Brandon-IBM.github.io`. Enable **Enforce HTTPS** when GitHub makes it available. If deployment succeeds but the custom domain fails, try the workflow's deployment URL and check the Pages DNS status. If the old page remains visible, hard-refresh the browser after deployment.

## Implementation boundaries

React, Vite, and Lucide power the interface. All simulations execute locally using fictional records, explicit fixture-based document checks, deterministic reconciliation rules, and scripted regulatory comparisons. Google Fonts supply Inter and IBM Plex Mono with local font fallbacks.

Live model inference, enterprise APIs, regulatory monitoring, production retrieval, authentication, and governance enforcement are **proposed capabilities**, not implemented integrations. watsonx Orchestrate, watsonx.ai, and watsonx.governance are candidate implementation components only. No sensitive policy changes, source-system corrections, legal interpretations, or final compliance decisions are executed.
