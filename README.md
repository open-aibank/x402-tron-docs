# x402-tron Documentation

Documentation for [x402-tron](https://github.com/open-aibank/x402-tron) - TRON implementation of the x402 open payment standard.

## Prerequisites

- Node.js >= 18.x
- Yarn >= 1.22
- Docker (for containerized deployment)

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

## Deployment

### Docker Deployment

#### Build Docker Image

```bash
# Using the provided script
./start_docker.sh

# Or manually
docker build --build-arg APP_ENV=prod -t x402-tron-docs .
```

#### Run Docker Container

```bash
# Run on port 8080
docker run --name x402-tron-docs-container -p 8080:80 x402-tron-docs

# Run in detached mode
docker run -d --name x402-tron-docs-container -p 8080:80 x402-tron-docs

# With custom port
docker run -d --name x402-tron-docs-container -p 3000:80 x402-tron-docs
```

### GitHub Pages Deployment

Push to `main` branch will automatically deploy to GitHub Pages via GitHub Actions.

## Links

- [x402-tron GitHub](https://github.com/open-aibank/x402-tron)
- [x402-tron Demo](https://github.com/open-aibank/x402-tron-demo)
