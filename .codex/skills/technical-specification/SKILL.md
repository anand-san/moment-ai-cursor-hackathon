---
name: technical-specification
description: High-level technical snapshot of MomentAI architecture and external services.
---

# Technical Specification

## App Shape

- Monorepo with `frontend`, `server`, and `shared` packages
- Bun runtime and scripts across the workspace

## Frontend

- React + Vite + Tailwind
- Firebase Auth on client
- Type-safe API usage with Hono client
- Capacitor for Android-native capabilities

## Backend

- Bun + Hono API server
- Token auth verification for protected routes
- Firestore data persistence
- AI generation through Google model integration

## Shared Package

- Shared types and validation schemas used by frontend and backend

## Core External Services

- Firebase Authentication
- Firestore
- Google Generative AI
- Optional Sentry error reporting
