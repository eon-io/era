# MCP clients — Claude Code, Claude Desktop, MCP Inspector

Every system in an Era environment serves MCP over streamable HTTP. From a
client's point of view it is an ordinary remote MCP server: a URL and a
credential header.

The fastest path is to let the CLI generate the wiring for you:

```bash
era mcp <tenant> --client claude
```

That prints ready-to-run `claude mcp add` commands with the credentials
embedded — one per system in the environment. Run them and ask Claude Code
something that requires the data:

> Which Salesforce accounts have an open Zendesk ticket?

## By hand

If you'd rather wire it yourself (or your client isn't listed), the recipe per
system is:

```bash
claude mcp add --transport http slack "$SLACK_MCP_URL" --header "$SLACK_MCP_HEADER"
```

For Claude Desktop and other JSON-configured clients:

```json
{
  "mcpServers": {
    "slack": {
      "type": "http",
      "url": "<SLACK_MCP_URL>",
      "headers": { "<header name>": "<header value>" }
    }
  }
}
```

## MCP Inspector — for looking, not asserting

The quickest way to see exactly what your agent will be handed:

```bash
# every tool the system publishes, with its schema
npx @modelcontextprotocol/inspector@latest --cli "$SLACK_MCP_URL" \
  --method tools/list --header "$SLACK_MCP_HEADER"

# one call
npx @modelcontextprotocol/inspector@latest --cli "$SLACK_MCP_URL" \
  --method tools/call --tool-name slack_list_channels \
  --header "$SLACK_MCP_HEADER"
```

Drop `--cli` for the browser UI.

## The console is an MCP server too

Add `https://console.era.eon.io/mcp` to an agent and it can manage
environments itself: `create_design_partner`, `list_connectors`,
`design_partner_options`, `usage`, `rotate_token`, `remove_design_partner`,
and more. Useful for agents that provision their own test beds.
