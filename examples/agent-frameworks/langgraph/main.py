"""LangGraph against an Era environment, via langchain-mcp-adapters. Needs an
LLM key for the model you pick below (ANTHROPIC_API_KEY as written).

    pip install -r requirements.txt && python main.py

Two systems in one graph is two entries in the client dict — the cheap way to
exercise cross-system questions ("which Salesforce accounts have an open
Zendesk ticket?"), because Era's data is coherent across systems.
"""

import asyncio
import os

from langchain.chat_models import init_chat_model
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent


def required(key: str) -> str:
    value = os.environ.get(key)
    if not value:
        raise RuntimeError(f"{key} is not set — see the README")
    return value


async def main() -> None:
    name, value = required("SLACK_MCP_HEADER").split(": ", 1)

    client = MultiServerMCPClient(
        {
            "slack": {
                "transport": "streamable_http",
                "url": required("SLACK_MCP_URL"),
                "headers": {name: value},
            }
        }
    )
    tools = await client.get_tools()

    agent = create_react_agent(init_chat_model("anthropic:claude-sonnet-5"), tools)
    result = await agent.ainvoke(
        {
            "messages": [
                (
                    "user",
                    "Which channel has the most recent activity, and what is it about? Two sentences.",
                )
            ]
        }
    )
    print(result["messages"][-1].content)


asyncio.run(main())
