"""The vendor-shaped REST API: Slack's real conversations surface, served by
the synthetic Slack in your Era environment."""

import os

import httpx
import pytest


@pytest.fixture(scope="session")
def slack() -> httpx.Client:
    base = _required("SLACK_BASE_URL")
    token = _required("ERA_TENANT_TOKEN")
    return httpx.Client(base_url=base, headers={"Authorization": f"Bearer {token}"})


def test_channels_exist_and_have_history(slack: httpx.Client) -> None:
    channels = slack.get("/api/conversations.list").raise_for_status().json()
    assert channels["ok"], channels
    assert channels["channels"], "a generated company has channels"

    history = (
        slack.get(
            "/api/conversations.history",
            params={"channel": channels["channels"][0]["id"]},
        )
        .raise_for_status()
        .json()
    )
    assert history["ok"], history
    assert history["messages"], "a generated company has chat history"


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is not set — see the README")
    return value
