# curl — the whole model in one shell script

No SDK, no framework: [`quickstart.sh`](quickstart.sh) calls a system's
vendor-shaped REST API with `curl`, then speaks MCP to the same system by hand
(initialize → initialized → `tools/list`). Read it top to bottom and you know
how Era looks on the wire.

```bash
era new --industry fintech --size mid --systems slack   # once
export SLACK_BASE_URL=...     # from `era mcp <tenant>` / the written .env
export SLACK_MCP_URL=...
export SLACK_MCP_HEADER=...   # e.g. "Authorization: Bearer ..."
export ERA_TENANT_TOKEN=...

sh quickstart.sh
```
