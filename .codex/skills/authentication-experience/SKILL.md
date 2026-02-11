---
name: authentication-experience
description: Covers the sign-in experience, including Google auth, email-link auth, and native deep-link handling.
---

# Authentication Experience

MomentAI uses Firebase authentication with low-friction sign-in options.

## Sign-In Methods

- Google sign-in
- Email magic link sign-in

## Email Link Flow

- User requests a sign-in link
- Link is sent to email
- Opening link signs the user in
- If needed, user confirms email manually

## Native App Deep Links

On Android, auth links open directly in the app and complete login in place.

## Session Security

- Frontend attaches the Firebase ID token to API calls
- Backend verifies token before protected API access
- Most app APIs are available only to authenticated users
