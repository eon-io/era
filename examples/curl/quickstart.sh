#!/usr/bin/env sh
# The whole model in one shell script: an Era system is plain HTTP.
# Its REST surface is the vendor's real API shape; its MCP surface is
# JSON-RPC over streamable HTTP. No SDK, no framework.
#
# Prerequisites (all printed by `era mcp <tenant>` after `era new`):
#   SLACK_BASE_URL     the system's vendor-shaped REST API
#   SLACK_MCP_URL      the same system's MCP endpoint
#   SLACK_MCP_HEADER   the credential header, e.g. "Authorization: Bearer ..."
#   ERA_TENANT_TOKEN   your environment's tenant token
set -eu

: "${SLACK_BASE_URL:?see the README}" "${SLACK_MCP_URL:?see the README}"
: "${SLACK_MCP_HEADER:?see the README}" "${ERA_TENANT_TOKEN:?see the README}"

echo "== REST: Slack's real API shape =========================="
# This is Slack's actual conversations API, answered by your synthetic company.
curl -sf "$SLACK_BASE_URL/api/conversations.list" \
  -H "Authorization: Bearer $ERA_TENANT_TOKEN"
echo

echo "== MCP: what an agent is handed ==========================="
# MCP over streamable HTTP is three POSTs: initialize, the initialized
# notification, then the call you care about. The session id rides a header.
rpc() { # $1 = body; extra args pass through to curl
  body=$1; shift
  curl -sf -X POST "$SLACK_MCP_URL" \
    -H "$SLACK_MCP_HEADER" \
    -H 'content-type: application/json' \
    -H 'accept: application/json, text/event-stream' \
    -d "$body" "$@"
}

headers=$(mktemp)
rpc '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}' \
  -D "$headers" -o /dev/null
session=$(awk -F': ' 'tolower($1)=="mcp-session-id"{gsub(/\r/,"",$2);print $2}' "$headers")
rm -f "$headers"

rpc '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  -H "Mcp-Session-Id: $session" -o /dev/null

# Every tool the system publishes, with its schema. (Responses may arrive as
# server-sent events; the JSON is on the `data:` lines.)
rpc '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  -H "Mcp-Session-Id: $session"
echo
