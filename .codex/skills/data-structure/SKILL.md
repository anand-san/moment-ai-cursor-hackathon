---
name: data-structure
description: Non-technical map of how user sessions, analyses, and preferences are organized in Firestore.
---

# Data Structure

MomentAI stores each user's data in their own Firestore space.

## Main Data Groups

### Sessions

- Path: `users/{userId}/sessions/{sessionId}`
- Stores: original brain dump text, timestamp, current analysis, older tip batches

### Preferences

- Path: `users/{userId}/preferences/preferences`
- Stores: per-tag helpfulness counts used for personalization

## Analysis Contents

Inside a session analysis:

- empathy message
- identified problems
- tips (with category, priority, time estimate, action type, swipe state)

## Important Product Memory

- Current tips stay in `analysis`
- Regenerated older tips move into `previousTips`
- This preserves helpful history instead of replacing it
