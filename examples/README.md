# Examples

Self-contained starting points for pointing your code, tests, and agents at an
Era environment. Each directory assumes only two things:

1. You have the CLI installed and an environment created:

   ```bash
   curl -fsSL https://console.era.eon.io/install.sh | sh
   era init
   era new --industry fintech --size mid --systems salesforce,slack,zendesk
   ```

2. The environment's connection details are in your shell or a `.env` file.
   `era mcp <tenant>` prints them; per system you get
   `<SYSTEM>_BASE_URL` (the vendor-shaped REST API), `<SYSTEM>_MCP_URL`, and
   `<SYSTEM>_MCP_HEADER` (the credential header to send).

| Directory | What it shows |
| --- | --- |
| [`mcp-clients/`](mcp-clients) | Claude Code, Claude Desktop, and MCP Inspector against an environment |
| [`agent-frameworks/`](agent-frameworks) | OpenAI Agents SDK, LangGraph, Mastra, Vercel AI SDK, Claude Agent SDK |
| [`node/`](node) | Plain `fetch` + a bare MCP client in Node |
| [`python/`](python) | pytest tests over the REST API and MCP |

## Which system do the examples use?

Slack, because its API is small enough to read at a glance. Nothing in the
examples is Slack-specific except the route names — the connection recipe
(base URL + credential header, MCP URL + credential header) is identical for
every system Era emulates. Swap the env var prefix and the same code talks to
Salesforce, Zendesk, Jira, or anything `era systems` lists.
