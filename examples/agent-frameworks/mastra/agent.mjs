// Mastra against an Era environment: @mastra/mcp turns the system's MCP
// endpoint into Mastra tools. Needs ANTHROPIC_API_KEY.

import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";

const url = required("SLACK_MCP_URL");
const [name, value] = required("SLACK_MCP_HEADER").split(/:\s(.+)/);

const mcp = new MCPClient({
  servers: {
    slack: { url: new URL(url), requestInit: { headers: { [name]: value } } },
  },
});

const agent = new Agent({
  name: "support-triage",
  instructions: "Answer from the Slack workspace, briefly.",
  model: anthropic("claude-sonnet-5"),
  tools: await mcp.getTools(),
});

const result = await agent.generate(
  "Which channel has the most recent activity, and what is it about? Two sentences.",
);
console.log(result.text);

await mcp.disconnect();

function required(key) {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set — see the README`);
  return v;
}
