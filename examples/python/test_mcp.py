"""The same system over MCP — what your agent will actually be handed. For a
deterministic test, a bare MCP client beats running a model: no key, no
flake."""

import os
import re

import pytest
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client


@pytest.mark.asyncio
async def test_tools_are_published_and_answer() -> None:
    url = _required("SLACK_MCP_URL")
    name, value = _required("SLACK_MCP_HEADER").split(": ", 1)

    async with streamablehttp_client(url, headers={name: value}) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = (await session.list_tools()).tools
            assert tools, "the system publishes MCP tools"

            list_tool = next(
                (t for t in tools if re.search(r"list.*channels", t.name)), None
            )
            assert list_tool, f"expected a list-channels tool, got {[t.name for t in tools]}"

            result = await session.call_tool(list_tool.name, {})
            assert not result.isError, result.content


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is not set — see the README")
    return value
