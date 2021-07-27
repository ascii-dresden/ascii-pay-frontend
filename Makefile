build:
	docker run --rm -v $(shell pwd):/app -w /app node:16 yarn package --platform linux --arch armv7l
