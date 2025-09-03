
"use client";
import { useEffect, useState } from "react";
import { getPlans } from "../../lib/firestore";
import { useAuth } from "../../hooks/useAuth";
import type { Plan } from "../../lib/firestore";

const USE_MOCK = process.env.NEXT_PUBLIC_STRIPE_MOCK === "1" || process.env.NEXT_PUBLIC_STRIPE_MOCK === "true";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const data = await getPlans();
      setPlans(data as Plan[]);
      setLoading(false);
    }
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user?.email) {
      alert("Please log in to subscribe.");
      return;
    }
    setSubscribing(planId);
    try {
      const url = USE_MOCK
        ? (await (await fetch("/api/mock-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planId, userEmail: user.email }),
          })).json()).url
        : (await (await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planId, userEmail: user.email }),
          })).json()).url;
      window.location.href = url;
    } catch (err) {
      alert("Error redirecting to Checkout.");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-2">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Choose Your Subscription Plan</h1>
      {USE_MOCK && (
        <div className="mb-6 p-3 rounded bg-blue-50 border border-blue-200 text-blue-700 text-center">
          Demo mode: payments are mocked. Sign in and click Subscribe to simulate a subscription.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg flex flex-col items-center p-6 hover:shadow-xl transition-all duration-150"
          >
            <img
              src={plan.imageUrl || "https://via.placeholder.com/240x160?text=Plan"}
              alt={plan.name}
              className="w-48 h-32 object-cover rounded mb-4 border border-slate-100 dark:border-slate-800"
            />
            <h2 className="text-xl font-bold mb-2 text-blue-700 text-center">{plan.name}</h2>
            <p className="mb-3 text-center text-slate-600 dark:text-slate-300">{plan.description}</p>
            <div className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
              ${plan.price} <span className="text-sm font-normal">/ {plan.frequency}</span>
            </div>
            <button
              className={`bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition-all duration-150 mt-2 disabled:opacity-60`}
              onClick={() => handleSubscribe(plan.id)}
              disabled={subscribing === plan.id}
            >
              {subscribing === plan.id ? "Redirecting..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
