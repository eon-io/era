# Agent frameworks — pointing one at an Era environment

Every system in an environment serves MCP over streamable HTTP, so from a
framework's point of view it is an ordinary remote MCP server. There are only
two values to configure per system, and `era mcp <tenant>` prints both:

| | |
| --- | --- |
| URL | `<SYSTEM>_MCP_URL` |
| Credential | `<SYSTEM>_MCP_HEADER` — the header to send with every request |

Each directory below is a runnable agent that connects to your environment's
Slack over MCP and answers a question about the company. All of them read the
two values from the environment (splitting the header on the first `": "`),
and each needs the model key named in its file.

| Directory | Framework | Run |
| --- | --- | --- |
| [`claude-agent-sdk/`](claude-agent-sdk) | Claude Agent SDK | `npm install && npm start` |
| [`openai-agents/`](openai-agents) | OpenAI Agents SDK (Python) | `pip install -r requirements.txt && python main.py` |
| [`langgraph/`](langgraph) | LangGraph / LangChain | `pip install -r requirements.txt && python main.py` |
| [`mastra/`](mastra) | Mastra | `npm install && npm start` |
| [`vercel-ai/`](vercel-ai) | Vercel AI SDK | `npm install && npm start` |

```bash
export SLACK_MCP_URL=...      # from `era mcp <tenant>`
export SLACK_MCP_HEADER=...   # e.g. "Authorization: Bearer xoxb-..."
```

Any framework that speaks remote MCP works the same way; if yours only knows
stdio, put `npx mcp-remote <url>` in front of it.

Two systems in one agent is two MCP server entries — the cheap way to exercise
cross-system questions ("which Salesforce accounts have an open Zendesk
ticket?"), because Era's data is coherent across systems.

## What to assert, if you're testing

The point of an agent test is not that the model produced prose. Assert:

1. **The answer.** A generated company is deterministic, so questions have
   checkable answers.
2. **The tools it chose**, and how many turns it took — regressions in a prompt
   show up here long before the answer changes.
3. **That it did not write**, if it wasn't supposed to.

For deterministic checks, a bare MCP client beats running a model — no key, no
flake. See [`../node`](../node) and [`../python`](../python).
