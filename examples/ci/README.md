# CI — running your suite against Era in GitHub Actions

Era environments are hosted, so CI needs no containers and no services: store
an environment's connection values as repository secrets and run your tests
against it. [`github-actions.yml`](github-actions.yml) runs the
[`node/`](../node) and [`python/`](../python) examples that way.

## Setup, once

```bash
era new --industry fintech --size mid --systems slack
era mcp <tenant>    # prints the values below
```

Then add these as repository secrets
(Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `SLACK_BASE_URL` | the system's REST base URL |
| `SLACK_MCP_URL` | the system's MCP endpoint |
| `SLACK_MCP_HEADER` | the credential header, e.g. `Authorization: Bearer ...` |
| `ERA_TENANT_TOKEN` | the environment's tenant token |

Rotate the token from the console (or its MCP `rotate_token` tool) whenever
you rotate other CI credentials.

## A note on isolation

A shared long-lived environment is fine for read-heavy suites. If your tests
write, prefer one environment per pipeline — `era new` in a setup step, `era rm`
in an always-run teardown — so runs can't see each other's writes.
