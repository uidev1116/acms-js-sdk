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
4. **Type Guards** (`src/lib/typeGuard/`): Utilities for runtime type checking

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
- Supports Node.js 20.11.1 (specified in volta config)

## Key Patterns

### API Client Usage
The SDK creates clients that interact with a-blog cms modules using URL contexts like blog codes, category codes, and entry codes.

### URL Context Handling
The `acmsPath` function handles complex URL construction for a-blog cms, supporting various context parameters like blog, category, entry, user, tags, fields, pagination, etc.

### Error Handling
Custom `AcmsFetchError` class for API errors with type guard `isAcmsFetchError` for proper error handling in applications.

### Type Safety
Extensive TypeScript types for API responses, client configuration, and URL context parameters.

## Working with ACMS Field Helper

Recent additions include `AcmsFieldList` class for handling field contexts and functions for parsing/stringifying ACMS field collections. When working with fields:

- Use `parseAcmsFieldString` for converting field strings to structured data
- Use `stringifyAcmsFieldCollection` for the reverse operation
- Field context includes escape handling and utid support

## Distribution

The package is published as `@uidev1116/acms-js-sdk` with multiple export points for different use cases (main SDK, path utilities, type guards).
