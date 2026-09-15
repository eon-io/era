// Claude Agent SDK against an Era environment: the system's MCP endpoint is an
// ordinary remote MCP server — a URL and a credential header, both printed by
// `era mcp <tenant>`. Needs ANTHROPIC_API_KEY.

import { query } from "@anthropic-ai/claude-agent-sdk";

const url = required("SLACK_MCP_URL");
const [name, value] = required("SLACK_MCP_HEADER").split(/:\s(.+)/);

const result = query({
  prompt: "Which Slack channel has the most recent activity, and what is it about? Two sentences.",
  options: {
    mcpServers: {
      slack: { type: "http", url, headers: { [name]: value } },
    },
  },
});

const toolsUsed = [];
for await (const message of result) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "tool_use") toolsUsed.push(block.name);
    }
  }
  if (message.type === "result") {
    console.log(message.result);
    console.log(`\ntools used: ${toolsUsed.join(", ") || "none"}`);
  }
}

function required(key) {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set — see the README`);
  return v;
}
