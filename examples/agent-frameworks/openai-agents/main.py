"""OpenAI Agents SDK against an Era environment: the system's MCP endpoint is
an ordinary remote MCP server. Needs OPENAI_API_KEY.

    pip install -r requirements.txt && python main.py
"""

import asyncio
import os

from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp


def required(key: str) -> str:
    value = os.environ.get(key)
    if not value:
        raise RuntimeError(f"{key} is not set — see the README")
    return value


async def main() -> None:
    name, value = required("SLACK_MCP_HEADER").split(": ", 1)

    async with MCPServerStreamableHttp(
        params={"url": required("SLACK_MCP_URL"), "headers": {name: value}},
        cache_tools_list=True,
    ) as slack:
        agent = Agent(
            name="support-triage",
            instructions="Answer from the Slack workspace, briefly.",
            mcp_servers=[slack],
        )
        result = await Runner.run(
            agent,
            "Which channel has the most recent activity, and what is it about?",
        )
        print(result.final_output)


asyncio.run(main())
