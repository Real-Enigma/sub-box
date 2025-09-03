import Link from "next/link";

export default function Home() {
  const isMock =
    process.env.NEXT_PUBLIC_STRIPE_MOCK === "1" ||
    process.env.NEXT_PUBLIC_STRIPE_MOCK === "true";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-5xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-foreground text-background font-bold px-3 py-2 dark:bg-white/90 dark:text-black">SB</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Subscription Box — Demo</h1>
          </div>

          <nav className="flex gap-3">
            <Link href="/plans" className="text-sm font-medium hover:underline">
              Plans
            </Link>
            <Link href="/auth" className="text-sm font-medium hover:underline">
              Sign in
            </Link>
          </nav>
        </header>

        {isMock && (
          <div className="mb-6 rounded-md bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 p-3 text-sm">
            Demo mode: payments are mocked. Use the Admin → Webhook Simulator to emulate billing events.
          </div>
        )}

        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Deliver delightful boxes monthly.</h2>
            <p className="text-lg max-w-xl mb-6 text-muted-foreground">
              Build, sell, and manage subscription boxes with demo-ready Stripe + Firebase wiring — configured to run locally without paid services.
            </p>

            <div className="flex gap-3">
              <Link href="/plans" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-5 py-3 font-semibold shadow hover:brightness-95">
                Browse plans
              </Link>
              <Link href="/auth" className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-3 font-medium hover:bg-gray-100">
                Sign in / Sign up
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <li>✅ Demo Stripe checkout</li>
              <li>✅ Admin webhook simulator</li>
              <li>✅ Firestore rules & example data</li>
            </ul>
          </div>

          <div className="rounded-xl border p-6 bg-white dark:bg-gray-800 shadow">
            <h3 className="font-semibold mb-3">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Create an account and pick a plan.</li>
              <li>Checkout (mocked) creates a subscription document.</li>
              <li>Use Admin → Webhook Simulator to simulate billing events.</li>
            </ol>
          </div>
        </section>

        <footer className="mt-14 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:underline">
              Repo
            </a>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
