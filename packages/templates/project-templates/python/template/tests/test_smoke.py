from app import hello


def test_hello() -> None:
    assert hello() == "hello"
