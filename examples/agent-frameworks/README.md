# Agent frameworks — pointing one at an Era environment

Every system in an environment serves MCP over streamable HTTP, so from a
framework's point of view it is an ordinary remote MCP server. There are only
two values to configure per system, and `era mcp <tenant>` prints both:

| | |
| --- | --- |
| URL | `<SYSTEM>_MCP_URL` |
| Credential | `<SYSTEM>_MCP_HEADER` — the header to send with every request |

The snippets below read them from the environment (split the header on the
first `: ` into name and value). Any framework that speaks remote MCP works the
same way; if yours only knows stdio, put `npx mcp-remote <url>` in front of it.

```bash
export SLACK_MCP_URL=...      # from `era mcp <tenant>`
export SLACK_MCP_HEADER=...   # e.g. "Authorization: Bearer xoxb-..."
```

## Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

const [name, value] = process.env.SLACK_MCP_HEADER.split(/:\s(.+)/);

const result = query({
  prompt: "How many open incidents were discussed in #support this week?",
  options: {
    mcpServers: {
      slack: {
        type: "http",
        url: process.env.SLACK_MCP_URL,
        headers: { [name]: value },
      },
    },
  },
});

for await (const message of result) {
  // assert on tool_use blocks here — which tools, how many turns
}
```

## OpenAI Agents SDK (`openai-agents`, Python)

```python
import os
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

name, value = os.environ["SLACK_MCP_HEADER"].split(": ", 1)

async with MCPServerStreamableHttp(
    params={"url": os.environ["SLACK_MCP_URL"], "headers": {name: value}},
    cache_tools_list=True,
) as slack:
    agent = Agent(name="support-triage", mcp_servers=[slack])
    result = await Runner.run(agent, "Summarize this week's #support channel.")
```

## LangGraph / LangChain (`langchain-mcp-adapters`)

```python
import os
from langchain_mcp_adapters.client import MultiServerMCPClient

name, value = os.environ["SLACK_MCP_HEADER"].split(": ", 1)

client = MultiServerMCPClient(
    {
        "slack": {
            "transport": "streamable_http",
            "url": os.environ["SLACK_MCP_URL"],
            "headers": {name: value},
        }
    }
)
tools = await client.get_tools()  # hand these to create_react_agent(...)
```

Two systems in one graph is two entries in that dict — which is the cheap way
to exercise cross-system questions ("which Salesforce accounts have an open
Zendesk ticket?"), because Era's data is coherent across systems.

## Mastra (`@mastra/mcp`)

```ts
import { MCPClient } from "@mastra/mcp";

const [name, value] = process.env.SLACK_MCP_HEADER.split(/:\s(.+)/);

const mcp = new MCPClient({
  servers: {
    slack: {
      url: new URL(process.env.SLACK_MCP_URL),
      requestInit: { headers: { [name]: value } },
    },
  },
});
const tools = await mcp.getTools();
```

## Vercel AI SDK (`@ai-sdk/mcp`)

```ts
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const [name, value] = process.env.SLACK_MCP_HEADER.split(/:\s(.+)/);

const mcp = await createMCPClient({
  transport: new StreamableHTTPClientTransport(new URL(process.env.SLACK_MCP_URL), {
    requestInit: { headers: { [name]: value } },
  }),
});
const tools = await mcp.tools();
```

## No framework at all

An MCP client is a few lines, and for a deterministic test it is often the
better choice — no model, no key, no flake. See
[`../node`](../node) and [`../python`](../python).
