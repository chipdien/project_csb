def get_token_values(payload: dict, key: str) -> set[str]:
	return {
		str(value).lower()
		for value in payload.get(key, [])
		if value
	}
