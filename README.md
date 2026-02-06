# Stack Template

A modern full-stack monorepo template using Bun, React 19, Hono, and Firebase.

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Runtime    | Bun 1.3                        |
| Frontend   | React 19 + Vite + Tailwind CSS |
| Backend    | Hono (HTTP framework)          |
| Validation | Zod                            |
| Database   | Firebase (Firestore)           |
| Auth       | Firebase Authentication        |
| UI         | shadcn/ui + Radix              |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3+)
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
bun install
```

### Environment Setup

**Frontend** (`frontend/.env`):

- Copy `.env.example` to `.env` and fill in the values

**Server** (`server/.env`):

- Copy `.env.example` to `.env` and fill in the values

### Development

```bash
bun run dev          # Runs both frontend and server
bun run frontend:dev # Frontend only (port 5173)
bun run server:dev   # Server only (port 3000)
```

### Build

```bash
bun run build        # Builds both packages
```

Output:

- Frontend: `dist/frontend/` (static files)
- Server: `dist/index.js` (bundled)

### Android (Capacitor)

#### Prerequisites

- Java 21 (e.g. [Azul Zulu](https://www.azul.com/downloads/))
- Android Studio with SDK installed
- `JAVA_HOME` set to your JDK 21 path (e.g. `export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home`)

#### Firebase Setup

1. In [Firebase Console](https://console.firebase.google.com), go to **Project Settings > Your Apps** and add an Android app with package name `dev.sandilya.momentai`
2. Get your debug signing certificate fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android
   ```
3. Add the **SHA-1** fingerprint to the Android app in Firebase Console (Project Settings > Your Apps > Add fingerprint)
4. Download the updated `google-services.json` from Firebase Console and place it at `frontend/android/app/google-services.json`

#### Environment

Make sure `frontend/.env` has the production URLs set — these are baked into the build:

- `VITE_API_ENDPOINT` — your deployed API URL (not `localhost`)
- `VITE_APP_URL` — your deployed frontend URL (used for email auth redirect links)

#### Build and Run

```bash
bun run android:build   # Build frontend + sync to Android
bun run android:open    # Open in Android Studio
```

Or run directly on a connected device:

```bash
cd frontend && bun run android  # Build + sync + run on device
```

#### Deep Links (App Links)

The app is configured to handle `https://momentai.sandilya.dev` URLs via Android App Links. For verified App Links (no disambiguation dialog), host `/.well-known/assetlinks.json` on your domain with the app's SHA-256 fingerprint. The file is included in the frontend build output from `frontend/public/.well-known/assetlinks.json`.
