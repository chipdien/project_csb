---
name: django-developer
description: End-to-end Django and Django REST Framework implementation, debugging, refactoring, and deployment guidance. Use when Codex needs to work on Django projects for model changes, migrations, settings and environment configuration, serializers, views, URLs, authentication, permissions, admin setup, API debugging, test fixes, or production-readiness checks.
---

# Django Developer

Use this skill to work on Django backends with a pragmatic, production-aware workflow. Favor minimal, correct changes that fit the existing project structure instead of rewriting the app around ideal patterns.

## Working Approach

1. Inspect the project shape before editing.
2. Identify the active app, settings module, URL wiring, and database backend.
3. Trace the request or data path end to end before changing code: `urls -> view -> serializer/form -> model -> migration -> tests`.
4. Change the smallest set of files that resolves the issue cleanly.
5. Run targeted validation after changes: tests, migrations, or framework checks.

## Implementation Rules

- Preserve existing project conventions unless they are clearly broken.
- Prefer explicit fixes over clever abstractions.
- For model changes, inspect existing migrations before adding a new one.
- For API changes, verify serializer validation, permissions, and response shape together.
- For settings work, avoid hardcoding secrets, hosts, tokens, or debug flags.
- For auth bugs, inspect both authentication classes and permission classes.

## References

- Read `references/deployment-checklist.md` when the task touches deployment, `.env`, or production settings.
