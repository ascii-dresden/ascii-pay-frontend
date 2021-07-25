build:
	docker run --rm -v $(shell pwd):/app -w /app node:16 yarn make --platform linux --arch armv7l