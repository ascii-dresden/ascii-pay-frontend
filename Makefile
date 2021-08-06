build:
	docker run --rm -v $(shell pwd):/app -w /app node:16 yarn workspace @ascii-pay-frontend/terminal package --platform linux --arch armv7l
