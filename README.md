# AcmeShop Frontend Web

Customer-facing web application for the AcmeShop e-commerce platform. Built with React and TypeScript.

## Overview

This is the main web frontend for AcmeShop customers, providing:
- Product browsing and search
- Shopping cart functionality
- Checkout and payment processing
- Order history and tracking
- User profile management

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── cart/           # Cart-related components
│   ├── checkout/       # Checkout form components
│   ├── layout/         # Header, Footer, Navigation
│   ├── orders/         # Order history components
│   ├── products/       # Product listing components
│   └── profile/        # User profile components
├── config/             # Configuration and feature flags
├── hooks/              # Custom React hooks
├── logging/            # Logging utilities
├── pages/              # Page components
├── services/           # API services
├── store/              # State management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Demo Patterns

This codebase contains patterns for Sourcegraph demos:

### API Migration (v1 → v2)
- `getUserV1()` vs `getUser()` in services
- `/api/v1/` vs `/api/v2/` endpoints
- `UserV1` vs `User` types from shared-ts

### Logging Migration
- Legacy: `console.log()`, `legacyLog()`
- Modern: `logger.info({ ... })` with structured data

### Header Migration
- Legacy: `X-Legacy-User-Id` header
- Modern: `X-User-Id` header

### Feature Flags
- `ENABLE_LEGACY_AUTH`
- `ENABLE_V1_API`
- `ENABLE_LEGACY_PAYMENTS`

### TODO Comments
Search for team-tagged TODOs:
- `TODO(TEAM-FRONTEND)` - Frontend team tasks
- `TODO(TEAM-API)` - API team tasks
- `TODO(TEAM-SEC)` - Security team tasks

## Dependencies

- **@acme-shop/shared-ts** - Shared TypeScript types and API client
- **react** - UI framework
- **react-router-dom** - Client-side routing
- **vite** - Build tool and dev server

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_LEGACY_AUTH=false
VITE_ENABLE_V1_API=false
VITE_ENABLE_LEGACY_PAYMENTS=false
```

## License

MIT
