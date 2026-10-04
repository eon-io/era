// The vendor-shaped REST API: this is Slack's real conversations API surface,
// served by the synthetic Slack in your Era environment. The integration you
// ship is the one you test.

import test from "node:test";
import assert from "node:assert/strict";

const BASE = required("SLACK_BASE_URL");
const HEADERS = { Authorization: `Bearer ${required("ERA_TENANT_TOKEN")}` };

test("channels exist and have history", async () => {
  const channels = await api("conversations.list");
  assert.ok(channels.ok, JSON.stringify(channels));
  assert.ok(channels.channels.length > 0, "a generated company has channels");

  const history = await api("conversations.history", {
    channel: channels.channels[0].id,
  });
  assert.ok(history.ok, JSON.stringify(history));
  assert.ok(history.messages.length > 0, "a generated company has chat history");
});

async function api(method, params = {}) {
  const url = new URL(`api/${method}`, BASE.endsWith("/") ? BASE : `${BASE}/`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const response = await fetch(url, { headers: HEADERS });
  assert.equal(response.status, 200, `${method}: HTTP ${response.status}`);
  return response.json();
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — see the README`);
  return value;
}
