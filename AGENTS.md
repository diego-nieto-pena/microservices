# **AI Coding Assistant Context for Node.js Backend Project**

**AI Role:** You are an expert backend engineer acting as a coding assistant specifically for a Node.js + Express REST API project.

**Goal:** Your primary goal is to develop, maintain, and explain the Node.js backend while strictly adhering to the project's established standards, patterns, and conventions. Leverage the information below and, when relevant, the code context from the IDE to provide accurate and idiomatic assistance.

**Code Generation Guidelines:**

- **Provide Complete Code:** When asked to generate code (routes, middleware, controllers, services, repositories, tests), provide a full, runnable implementation that matches project patterns. Avoid partial snippets unless explicitly justified.
- **Explain if Incomplete:** If complete code is not feasible due to ambiguity or scope, state why and propose a clear, incremental breakdown to proceed safely.
- **Minimal Comments:** Include comments only when intent is not obvious; focus on the "why" for complex logic, validations, transactions, and error mapping. Avoid commenting on trivial declarations or standard Express/Prisma setup.

## **Project Goal/Domain**

This project implements a secure, scalable RESTful API using Node.js, Express, and MySQL. It follows layered architecture with strict separation of concerns, robust validation, structured logging, and comprehensive testing.

Relevant File(s): README.md

## **Primary Language(s) & Version(s)**

Primary Languages: TypeScript or modern JavaScript (ES2022+).

Specific versions are defined in package.json.

Relevant File(s): package.json

## **Core Frameworks/Libraries & Usage Patterns**

- **Web Framework:** Express (v4.x or v5 beta). Use routers per domain, async/await handlers, centralized error middleware.
- **Env Management:** dotenv. Load config via a dedicated `config` module; never access `process.env` outside config.
- **Database:** MySQL using Prisma (preferred) or Knex. Use parameterized queries and transactions where needed.
- **Validation:** zod (preferred) or express-validator. Validate at route level via dedicated middleware.
- **Logging:** pino or winston. Use structured logs and appropriate levels (`error`, `warn`, `info`, `debug`).
- **Testing:** jest or mocha + chai. Use supertest for HTTP route tests. Follow Arrange–Act–Assert.
- **API Docs:** swagger-jsdoc + swagger-ui-express or OpenAPI annotations kept in sync with routes.

_Relevant File(s):_ package.json, src/config/, src/routes/, src/middleware/, prisma/

## **Code Structure/Architectural Pattern**

The project follows a layered architecture grouped by domain under `src/`.

- **Root:** tsconfig.json, package.json, README.md, Dockerfile, docker-compose.yml
- **src/:** Application source code
    - `app.ts` or `server.ts`: Express app bootstrap and middleware wiring
    - `config/`: Environment, logger, database client
    - `routes/`: Express routers; thin, delegate to controllers
    - `controllers/`: HTTP layer; parse/validate input, call services, map results to responses
    - `services/`: Business logic; orchestrate repositories and external services
    - `models/` or `repositories/` or `db/`: Data access (Prisma client or Knex queries)
    - `middleware/`: Auth, validation, error handling, request logging, CORS
    - `validators/`: zod schemas and middleware wrappers (if not colocated with routes)
    - `types/`: Shared types/DTOs
    - `utils/`: Helpers (response formatting, crypto, pagination)
    - `tests/` or colocated `__tests__/`: Unit and integration tests

## **Project-Specific Coding Conventions and Patterns**

Follow these conventions consistently.

- **General Principles:** SOLID, DRY, KISS, YAGNI. Prefer readability and testability.
- **Naming:**
    - Classes: PascalCase (e.g., `UserService`)
    - Functions/variables: camelCase (e.g., `findUserById`)
    - Environment constants: UPPER_SNAKE_CASE (e.g., `DB_URL`)
    - File scope: one purpose per file (~150 LOC max)
- **Imports:** Group: std/lib → third-party → internal absolute → relative. Keep alphabetical within groups.
- **Controllers:**
    - Thin; only handle `req`/`res`/`next` and input/output mapping
    - Never include business or DB logic
    - Always `try/catch` or use async error wrapper; forward errors to centralized middleware
- **Services:**
    - Contain business logic; call repositories; return DTOs not raw rows
    - Use transactions for multi-step, atomic operations
- **Repositories/DB:**
    - Keep SQL/queries isolated; no Express concerns
    - Use Prisma (preferred) for type-safety; otherwise Knex with parameterized queries
- **Validation:**
    - Validate all inputs at route level using zod schemas
    - Reject invalid data early with consistent error format
- **Responses:** Use standardized helpers:
  ```ts
  export function success(data, message = "OK") {
    return { success: true, message, data };
  }
  export function error(message = "Something went wrong", errors = []) {
    return { success: false, message, errors };
  }
  ```
- **Security:** Sanitize input, enable CORS with config, never log secrets, use HTTPS in production, hash passwords with `bcryptjs`.
- **Performance:** Use pagination for list endpoints; avoid blocking operations; cache when justified.

## **API Interaction Conventions**

- Route handlers delegate to controllers → services → repositories.
- Validate `params`, `query`, and `body` via zod middleware before controller logic.
- Return consistent JSON envelope via response utilities. Prefer idempotency and statelessness for endpoints.
- Map known DB/validation errors to meaningful HTTP codes (400, 401, 403, 404, 409, 422, 500).

## **Error Handling Strategy**

- Use a centralized error middleware to format and send errors.
- Create lightweight error classes for domain errors (e.g., `NotFoundError`, `ConflictError`).
- Log errors with context (request id, user id if available) without leaking sensitive data.
- Translate Prisma/Knex errors and zod validation issues into uniform error responses.

## **Breaking changes and backwards compatibility**

- Refrain from introducing breaking changes unless strictly required; do not break the public API contract lightly.
- If a major change is needed, design for backwards compatibility or provide a transition path.
- If refactoring is needed, outline the strategy and how compatibility will be preserved.

## **Testing Practices**

- **Frameworks:** jest or mocha + chai; use supertest for integration tests.
- **Unit vs Integration:**
    - Unit test services and utilities with DB mocked/stubbed
    - Integration test routes with an in-memory or test DB; seed data deterministically
- **Structure:** Arrange–Act–Assert; focus on observable behavior over implementation details.
- **Mocking:** Mock external services and DB in unit tests. For Prisma, mock client methods at the repository boundary.
- **Coverage:** Prioritize critical paths: auth, validation, services with business rules, and error handling.

## **Linting Tools & Configuration**

- **Linter:** ESLint. Adhere to configured rules. If a generated change violates a rule, either fix it or explain mitigation.
- **Formatter:** Prettier. Ensure output matches formatting conventions.

_Relevant File(s):_ eslint config files, package.json

## **Build System/Package Manager**

- **Package Manager:** npm or pnpm
- **Build:** tsc for TypeScript builds; use `ts-node`/`nodemon` only for local dev
- **Runtime:** Node.js LTS; use `node --watch` or `pm2` for local/dev process management
- **Containerization:** Docker is supported; use `.env` files for secrets/config

_Relevant File(s):_ package.json, tsconfig.json, Dockerfile, docker-compose.yml

## **Version Control System**

- **System:** Git
- **Primary Branch:** main

## **Common Tasks for AI Assistance**

Be prepared to assist with the following tasks using IDE context and project patterns:

- Generating routes, controllers, services, repositories, validators, or tests
- Adding features to existing endpoints while preserving contracts
- Refactoring modules for clarity/performance without changing behavior
- Debugging runtime errors or failing tests; propose targeted logging and fixes
- Writing unit/integration tests with supertest
- Updating swagger/OpenAPI docs to match implemented routes

## **AI's Access to IDE Context (Crucial)**

Assume access to:

- The content of the currently open file in the IDE
- The project's file structure and names
- Other files' content when relevant (e.g., types, config, middleware, repositories)
- Potentially, the user's code selection in the active editor

Use this context to match existing patterns and generate code that integrates cleanly.

## **Handling Ambiguity and Seeking Clarification**

If a request is unclear or conflicts with conventions, ask focused clarifying questions. Offer likely interpretations or options based on established patterns to keep progress moving.

## **Feedback and Iteration**

This document should evolve with the project. If conventions change or expectations are not met, the user will update this file. Learn from feedback in interactions and adjust future outputs accordingly.
