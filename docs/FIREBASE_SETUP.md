Firebase Console Setup (required for demo/local)

This short guide lists the minimal Firebase Console steps to make the demo app work locally.

1) Create Firebase project
- In the Firebase Console create a new project (free Spark plan is fine for Auth/Firestore/Storage).

2) Enable Email/Password Auth
- Go to Authentication → Sign-in method → Email/Password → Enable.

3) Create Firestore database
- Go to Firestore Database → Create database → Start in test mode (or later import rules from `firestore.rules`).
- Note: test mode rules are permissive; for a portfolio demo you can import the provided `firestore.rules` used in the repo.

4) Create web app and copy config
- Go to Project Settings → General → Your apps → Add app → Web app.
- Copy the config object and set it in `.env.local` via the `NEXT_PUBLIC_FIREBASE_*` variables. Example:

  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...

5) Security & Rules
- If you want role-based access, update Firestore rules. The repo includes `firestore.rules` you can review.

6) Optional: Upload demo images to Storage
- If you want to host images in Firebase Storage, create a `demo/` folder and upload.

7) Local env
- Ensure `.env.local` is in `.gitignore` (the repo ignores `.env*` by default). Do not commit secrets.

8) Run locally
- Install deps: `npm install`
- Start dev server: `npm run dev`

If you want I can add a small setup script to pre-populate demo plans in Firestore via the Admin UI or a script. Let me know and I will add it.
