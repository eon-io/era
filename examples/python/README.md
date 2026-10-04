# Python — pytest against an Era environment

Two tests you can copy into your suite:

- [`test_rest.py`](test_rest.py) — the vendor-shaped REST API
- [`test_mcp.py`](test_mcp.py) — the same system over MCP, as your agent sees it

## Run

```bash
era new --industry fintech --size mid --systems slack   # once
export SLACK_BASE_URL=...     # from `era mcp <tenant>` / the written .env
export SLACK_MCP_URL=...
export SLACK_MCP_HEADER=...   # e.g. "Authorization: Bearer ..."
export ERA_TENANT_TOKEN=...

pip install -r requirements.txt
pytest -v
```

Slack reads its credential as an OAuth bearer, so the REST test sends
`Authorization: Bearer $ERA_TENANT_TOKEN`. Other systems read their vendor's
own shape — see the [docs](https://console.era.eon.io/docs.html) for the
system you're testing.
