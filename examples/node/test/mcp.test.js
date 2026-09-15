// The same system over MCP — what your agent will actually be handed. An MCP
// client is a few lines, and for a deterministic test it beats running a
// model: no key, no flake.

import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const URL_ = required("SLACK_MCP_URL");
const [HEADER_NAME, HEADER_VALUE] = required("SLACK_MCP_HEADER").split(/:\s(.+)/);

test("the agent's view: tools are published and answer", async () => {
  const client = new Client({ name: "era-example", version: "1.0.0" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(URL_), {
      requestInit: { headers: { [HEADER_NAME]: HEADER_VALUE } },
    }),
  );

  const { tools } = await client.listTools();
  assert.ok(tools.length > 0, "the system publishes MCP tools");

  const list = tools.find((t) => /list.*channels/.test(t.name));
  assert.ok(list, `expected a list-channels tool, got: ${tools.map((t) => t.name)}`);

  const result = await client.callTool({ name: list.name, arguments: {} });
  assert.ok(!result.isError, JSON.stringify(result.content));

  await client.close();
});

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — see the README`);
  return value;
}
