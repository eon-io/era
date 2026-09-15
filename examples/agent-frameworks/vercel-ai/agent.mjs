// Vercel AI SDK against an Era environment: the system's MCP endpoint becomes
// an ordinary tool set for generateText. Needs ANTHROPIC_API_KEY.

import { generateText, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = required("SLACK_MCP_URL");
const [name, value] = required("SLACK_MCP_HEADER").split(/:\s(.+)/);

const mcp = await createMCPClient({
  transport: new StreamableHTTPClientTransport(new URL(url), {
    requestInit: { headers: { [name]: value } },
  }),
});

const { text, steps } = await generateText({
  model: anthropic("claude-sonnet-5"),
  tools: await mcp.tools(),
  stopWhen: stepCountIs(8),
  prompt:
    "Which channel has the most recent activity, and what is it about? Two sentences.",
});

console.log(text);
console.log(
  `\ntools used: ${steps
    .flatMap((s) => s.toolCalls.map((c) => c.toolName))
    .join(", ") || "none"}`,
);

await mcp.close();

function required(key) {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set — see the README`);
  return v;
}
