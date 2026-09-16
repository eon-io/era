# Era, by Eon

**Super realistic synthetic companies.**

Era generates a complete, coherent, synthetic company on demand — its Salesforce
pipeline, Slack history, Zendesk queue, Jira board, Gong calls, shared drive and
more — and serves it over each vendor's **real API shape** and over **MCP**.
Point your agent at a full simulated enterprise to build, test, demo, and
benchmark — with zero real data.

**Console:** [console.era.eon.io](https://console.era.eon.io/) ·
**Docs:** [docs](https://console.era.eon.io/docs.html) ·
**Use cases:** [use cases](https://console.era.eon.io/use-cases.html) ·
**Machine-readable facts:** [llms.txt](https://console.era.eon.io/llms.txt) ·
**Community:** [Discord](https://discord.gg/FNC6nMeqbK)

## Why Era

- **One company, many systems.** The data is cross-system coherent: the account
  behind a Salesforce opportunity is the same account a Zendesk ticket
  references and a Gong call discusses. Cross-system questions — *"which
  accounts with an open ticket have a renewal this quarter?"* — have real
  answers.
- **Real API shapes.** Each emulated system speaks its vendor's actual REST
  surface with realistic authentication, so the SDK or integration you ship is
  the one you test.
- **MCP everywhere.** Every system exposes an MCP endpoint, so any MCP-capable
  agent or framework connects with a URL and a header. The console itself is an
  MCP server too, at `https://console.era.eon.io/mcp` — your agent can create
  its own environments.
- **Deterministic and disposable.** Environments are generated, not recorded:
  spin one up per experiment or per CI run, and tear it down when you're done.
- **100% synthetic.** No real records, no real people, no customer data —
  free for builders.

## Install

```bash
curl -fsSL https://console.era.eon.io/install.sh | sh
```

## Getting started

```bash
# Sign in from the browser; the credential is stored locally.
era init

# Generate a company: pick an industry, a size, and the systems it runs on.
era new --industry fintech --size mid --systems salesforce,slack,zendesk

# Wire the environment into an MCP client (Claude Code, here) —
# prints ready-to-run commands with the credentials embedded.
era mcp <tenant> --client claude
```

Useful along the way:

```bash
era ls        # your environments
era options   # industries, sizes, day-states
era systems   # every system Era can emulate
era usage     # what you've consumed
era rm        # tear an environment down
```

Prefer the browser? Generate a company from the
[web console](https://console.era.eon.io/synthesis.html) instead — same
environments, no CLI.

Each system in an environment gets its own base URL, MCP URL, and credential;
`era mcp` prints them, and the CLI can write them to a `.env`
(`<SYSTEM>_BASE_URL`, `<SYSTEM>_MCP_URL`, `<SYSTEM>_MCP_HEADER`) so your code
and the [examples](examples/) below pick them up with no editing.

## Examples

Runnable, self-contained starting points in [`examples/`](examples/):

| Directory | What it shows |
| --- | --- |
| [`curl/`](examples/curl) | The whole model in one shell script — the REST API and a by-hand MCP handshake, no SDK |
| [`mcp-clients/`](examples/mcp-clients) | Pointing Claude Code, Claude Desktop, and MCP Inspector at an environment |
| [`agent-frameworks/`](examples/agent-frameworks) | Runnable agents: Claude Agent SDK, OpenAI Agents SDK, LangGraph, Mastra, Vercel AI SDK |
| [`node/`](examples/node) | Plain `fetch` + an MCP client in Node — call a system's real API and its MCP tools, no framework |
| [`python/`](examples/python) | The same in Python, as pytest tests you can copy into your suite |
| [`ci/`](examples/ci) | A GitHub Actions workflow running those suites against a hosted environment |

## What Era is for

- **Agent development** — build against a full enterprise stack from day one,
  before you have a design partner's blessing (or their data).
- **Testing and CI** — a fresh, deterministic company per test run; assert on
  answers, tool choices, and that read-only agents stayed read-only.
- **Demos** — a believable company with history, not three rows of lorem ipsum.
- **Benchmarks** — the same questions, the same ground truth, every run.

## The research behind the data

"Realistic" is a measurable claim. Era's generation pipeline is built and
evaluated against the bar set by recent research on synthetic relational data:

- [Benchmarking the Fidelity and Utility of Synthetic Relational Data](https://arxiv.org/abs/2410.03411)
  (SyntheRela; Hudovernik et al.) — in relational data, error propagates down
  the hierarchy: child tables synthesize worse than their parents. Era tracks
  fidelity per reference depth.
- [Measuring the Dependency Gap](https://arxiv.org/abs/2607.21636)
  (Zhang et al.) — independently shuffled columns pass the usual marginal and
  pairwise metrics. Era's checks read finished rows *jointly*, so inter-column
  dependencies actually count.
- [Hollywood: Towards a Large Movie Dataset for Database Benchmarking](https://arxiv.org/abs/2607.19666)
  (Iachnyk et al.) — realism as cardinality behavior: synthetic data should
  mislead an independence assumption the way real data does. Data that a naive
  estimator predicts perfectly is data whose columns say nothing about each
  other.
- [TabQueryBench: A Query-Centric Benchmark for Synthetic Tabular Data](https://arxiv.org/abs/2607.03926)
  (Zhang et al.) — query-centric fidelity collapses under local filters and
  rare values, so tail predicates, missingness, and high-cardinality grouping
  are measured as their own query families rather than averaged away.

## Honest limits

Every environment is 100% synthetic. That's the point — and it also means Era
is no substitute for a staging system that carries your real data. Use Era to
get correct, tested, demoable software sooner; validate against your own
staging before you ship.

## Community

Questions, feedback, or something you want Era to emulate? Join the
[Era Discord](https://discord.gg/FNC6nMeqbK) — it's where builders and the team
hang out.

---

All data generated by Era is synthetic — no real records, no real people. Era
is not affiliated with, endorsed by, or sponsored by any referenced vendor;
product names refer to API and schema compatibility only.

© Eon. All rights reserved.
