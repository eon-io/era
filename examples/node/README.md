# Node — no framework

Two tests against one system of an Era environment, using nothing but
`node:test`, `fetch`, and the MCP SDK:

- [`test/rest.test.js`](test/rest.test.js) — the vendor-shaped REST API,
  exactly as a real integration would call it
- [`test/mcp.test.js`](test/mcp.test.js) — the same system over MCP, as your
  agent will see it

## Run

```bash
era new --industry fintech --size mid --systems slack   # once
export SLACK_BASE_URL=...     # from `era mcp <tenant>` / the written .env
export SLACK_MCP_URL=...
export SLACK_MCP_HEADER=...   # e.g. "Authorization: Bearer ..."
export ERA_TENANT_TOKEN=...

npm install
npm test
```

Slack reads its credential as an OAuth bearer, so the REST test sends
`Authorization: Bearer $ERA_TENANT_TOKEN`. Other systems read their vendor's
own shape (CircleCI a `Circle-Token` header, Zendesk Basic auth, ...) — see the
[docs](https://console.era.eon.io/docs.html) for the system you're testing.
