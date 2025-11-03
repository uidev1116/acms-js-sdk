# README for agents

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **acms-js-sdk** - a JavaScript SDK for a-blog cms that works in Node.js and modern browsers. The SDK provides a client for interacting with a-blog cms APIs, URL path utilities, and TypeScript type definitions.

## Development Commands

- **Build**: `npm run build` - Builds TypeScript and creates distribution files using Vite
- **Development**: `npm run dev` - Starts Vite development server
- **Testing**: `npm test` - Runs tests using Vitest in watch mode
- **Test CI**: `npm run test:ci` - Runs tests once (for CI/CD)
- **Lint**: Use ESLint via the Vite plugin (runs automatically during build)
- **Type Check**: TypeScript checking is handled by `tsc -b` during build
- **Dependency Updates**: `npm run check-update` - Checks for package updates using npm-check-updates

## Architecture

### Core Structure

- **src/core/**: Contains the main `AcmsClient` class and `AcmsFetchError` for API communication
- **src/lib/**: Utility libraries including:
  - `acmsPath/`: URL path construction and parsing utilities for a-blog cms contexts
  - `typeGuard/`: Type checking utilities
  - `fetch/`: HTTP client abstraction
- **src/utils/**: General utility functions
- **src/types/**: TypeScript type definitions

### Key Components

1. **AcmsClient** (`src/core/AcmsClient.ts`): Main client class that handles API requests to a-blog cms
2. **acmsPath** (`src/lib/acmsPath/acmsPath.ts`): Constructs a-blog cms URL paths with context (blog, category, entry, etc.)
3. **parseAcmsPath** (`src/lib/acmsPath/parseAcmsPath.ts`): Parses a-blog cms URL paths into structured context objects
4. **AcmsFieldList** (`src/lib/acmsPath/acmsField.ts`): Class for building and parsing field filter contexts
5. **Type Guards** (`src/lib/typeGuard/`): Utilities for runtime type checking

### Build System

The project uses **Vite** for building with multiple entry points:
- Main SDK: `src/index.ts` → `acms-js-sdk`
- ACMS Path utilities: `src/lib/acmsPath/index.ts` → `acms-path`
- Type guards: `src/lib/typeGuard/index.ts` → `type-guard`

Outputs both ESM and CommonJS formats with TypeScript declarations.

### Testing

- Uses **Vitest** for testing
- Test files use `.test.ts` extension
- Tests are located alongside source files

### Code Quality

- **ESLint** with TypeScript support using `standard-with-typescript` and Prettier
- **Husky** for git hooks with lint-staged for pre-commit formatting
- **TypeScript** with strict mode enabled
- Supports Node.js >=18.0.0 (volta config specifies 24.11.0)

## Key Patterns

### API Client Usage
The SDK creates clients that interact with a-blog cms modules using URL contexts like blog codes, category codes, and entry codes.

### URL Context Handling
The `acmsPath` function handles complex URL construction for a-blog cms, supporting various context parameters like blog, category, entry, user, unit, tags, fields, pagination, etc. It also supports API version specification (v1 or v2) through the `apiVersion` option.

### Error Handling
Custom `AcmsFetchError` class for API errors with type guard `isAcmsFetchError` for proper error handling in applications.

### Type Safety
Extensive TypeScript types for API responses, client configuration, and URL context parameters.

### API Version Support
The SDK supports both v1 and v2 API versions:
- **Default**: v2 (generates paths like `api/v2/MODULE_ID/`)
- **v1**: Legacy format (generates paths like `api/MODULE_ID/`)
- Configurable via `acmsPathOptions.apiVersion` in `createClient()` or per-request in `acmsPath()`
- `parseAcmsPath()` automatically detects and returns the API version from paths

## Working with AcmsFieldList

The `AcmsFieldList` class provides a powerful interface for handling field filter contexts in a-blog cms:

### Main Methods

- **`AcmsFieldList.fromString(input: string)`**: Parse field strings into structured `AcmsFieldList` instances
- **`toString()`**: Convert `AcmsFieldList` back to a-blog cms field path string format
- **`AcmsFieldList.fromFormData(formData: FormData)`**: Create from FormData for form processing
- **`getFields()`**: Get all fields as an array of `AcmsField` objects
- **`push()`, `pop()`, `shift()`, `unshift()`**: Array-like manipulation methods

### Field Structure

Fields consist of:
- **key**: The field name
- **filters**: Array of filter conditions with operator, value, and connector
- **separator**: How fields are combined (`'_and_'` or `'_or_'`)

### Operators

Supported operators: `eq`, `neq`, `gt`, `lt`, `gte`, `lte`, `lk`, `nlk`, `re`, `nre`, `em`, `nem`

### Usage Patterns

1. **String format**: `'color/eq/red/_and_/size/gte/10'`
2. **Programmatic**: Pass `AcmsFieldList` instance to `acmsPath()` or client methods
3. **Parsing**: Use `parseAcmsPath()` which returns field as `AcmsFieldList` instance

## Distribution

The package is published as `@uidev1116/acms-js-sdk` with multiple export points:

### Main Exports (`@uidev1116/acms-js-sdk`)
- `createClient`: Factory function to create an AcmsClient instance
- `acmsPath`: URL path builder function
- `parseAcmsPath`: URL path parser function
- `AcmsFieldList`: Class for field filter manipulation
- `isAcmsFetchError`: Type guard for AcmsFetchError
- Type definitions for all interfaces and types

### Sub-exports
- `@uidev1116/acms-js-sdk/acmsPath`: Standalone path utilities (acmsPath, parseAcmsPath, AcmsFieldList, types)
- `@uidev1116/acms-js-sdk/typeGuard`: Type guard utilities (isAcmsFetchError)

All exports support both ESM and CommonJS formats with full TypeScript type definitions.
