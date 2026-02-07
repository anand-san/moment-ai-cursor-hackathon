# MomentAI Frontend

React + Vite frontend packaged with Capacitor for Android.

## Scripts

```bash
bun run dev          # Web dev server (http://localhost:5173)
bun run build        # Production web build to ../dist/frontend
bun run test         # Vitest unit tests
bun run cap:sync     # Sync web assets + plugins to Android project
bun run cap:open     # Open Android project in Android Studio
bun run android      # Build + sync + run on Android
```

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_API_ENDPOINT`
- `VITE_APP_URL`
- Firebase web config vars (`VITE_FIREBASE_*`)

For native builds, do not use localhost URLs unless you are explicitly proxying traffic from device/emulator.
