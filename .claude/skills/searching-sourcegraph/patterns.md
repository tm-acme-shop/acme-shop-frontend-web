# Query Patterns Reference

Common regex patterns for `keyword_search` and `nls_search` file filters.

## Contents
- [TypeScript / JavaScript](#typescript--javascript)
- [API and Routes](#api-and-routes)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Configuration and Infrastructure](#configuration-and-infrastructure)
- [Payments and Finance](#payments-and-finance)

---

## TypeScript / JavaScript

| Intent | Query |
|--------|-------|
| React hooks | `file:.*\.tsx$ use[A-Z].*= \(` |
| Type definitions | `file:types/ export (interface\|type)` |
| Exported functions | `file:.*\.ts$ export (async )?function [A-Z]` |
| Barrel exports | `file:index\.ts export \*` |
| Enums | `file:.*\.ts$ export enum` |
| Zod schemas | `file:.*\.ts$ z\.object\|z\.string\|z\.enum` |

## API and Routes

| Intent | Query |
|--------|-------|
| REST endpoints | `file:src/api app\.(get\|post\|put\|delete\|patch)` |
| Express middleware | `file:.*\.(ts\|js)$ router\.use\|app\.use` |
| gRPC/proto services | `file:.*\.proto$ service [A-Z]` |
| GraphQL resolvers | `file:.*resolver.*\.ts$ Query\|Mutation\|Subscription` |
| OpenAPI specs | `file:.*\.(yaml\|yml)$ openapi:` |

## Testing

| Intent | Query |
|--------|-------|
| Test setup | `file:.*\.test\. beforeEach\|beforeAll` |
| Mocks | `file:.*\.test\. jest\.mock\|vi\.mock` |
| Test fixtures | `file:(fixtures\|__fixtures__)/` |
| Integration tests | `file:.*\.integration\.test\. describe` |
| Snapshot tests | `toMatchSnapshot\|toMatchInlineSnapshot` |

## Error Handling

| Intent | Query |
|--------|-------|
| Error classes | `class.*Error extends` |
| Throw sites | `throw new [A-Z].*Error` |
| Error catching | `catch.*Error\|\.catch\(` |
| HTTP error codes | `status(Code)?: (4\|5)[0-9]{2}` |
| Retry logic | `retry\|backoff\|maxAttempts` |

## Configuration and Infrastructure

| Intent | Query |
|--------|-------|
| Config files | `file:(webpack\|vite\|rollup)\.config` |
| CI/CD pipelines | `file:\.github/workflows deploy` |
| Docker | `file:Dockerfile\|docker-compose` |
| Environment variables | `process\.env\.[A-Z_]+` |
| Feature flags | `file:.*\.(ts\|js)$ featureFlag\|isEnabled\|flagEnabled` |

## Payments and Finance

| Intent | Query |
|--------|-------|
| Webhook handlers | `file:.*webhook.* (post\|handler\|receive)` |
| Idempotency keys | `idempotencyKey\|idempotency_key\|Idempotency-Key` |
| Currency/amounts | `amount\|currency\|Money\|cents\|pence` |
| Stripe integration | `Stripe\|stripe\.` |
| Payment status | `(PENDING\|FAILED\|SUCCEEDED\|REFUNDED\|DISPUTED)` |
| Signature verification | `(webhook)?[Ss]ignature\|hmac\|HMAC` |
