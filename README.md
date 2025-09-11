# WORK IN PROGRESS

# Subscription Box Service (Demo)

This project is a subscription box service built with Next.js (App Router), TailwindCSS, Firebase (Auth, Firestore, Storage), and Stripe (demo mode).

Quick start (development/demo mode):

1. Install deps

   ```powershell
   npm install
   ```

2. Add `.env.local` values

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_MOCK=1
   ```

3. Start dev server

   ```powershell
   npm run dev
   ```

4. Use the Admin → Seed Demo Plans button to populate demo plans.
5. Sign up as a user, then go to Plans and click Subscribe. Demo mode will redirect to a checkout success page and create a subscription document in Firestore.

Notes:

- Stripe webhooks and Cloud Functions are not deployed in demo mode. For production, deploy functions and enable Blaze billing.
- Firestore security rules are included in `firestore.rules` and should be reviewed for production.

What to show recruiters:

- Live demo on Vercel (frontend only) with mock checkout.
Backend functions run in Firebase Cloud Functions. See `functions/src/index.ts` for webhook logic.
