"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile, getUserSubscriptions, cancelSubscription, pauseSubscription } from "../../lib/firestore";


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [subs, setSubs] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    async function load() {
      const p = await getUserProfile(uid);
      setProfile(p);
      const s = await getUserSubscriptions(uid);
      setSubs(s);
      setLoadingSubs(false);
    }
    load();
  }, [user]);

  // Action handlers
  const handlePause = async (subId: string) => {
    await pauseSubscription(subId);
    setSubs((prev) => prev.map(s => s.id === subId ? { ...s, status: 'paused' } : s));
  };

  const handleCancel = async (subId: string) => {
    await cancelSubscription(subId);
    setSubs((prev) => prev.map(s => s.id === subId ? { ...s, status: 'canceled' } : s));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-300";
      case "paused": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "canceled": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Please log in</h2>
        <a href="/auth" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded font-semibold inline-block mt-2">Go to Login</a>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-2">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Your Dashboard</h1>
      <section className="mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold mb-1">{user.email}</div>
            <div className="text-slate-500 mb-1">Role: <span className="font-mono">{profile?.role ?? "user"}</span></div>
            <div className="text-slate-500">Active Plan: <span className="font-mono">{profile?.activePlan ?? ""}</span></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Subscriptions</h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow">
          {loadingSubs ? (
            <div className="text-center text-slate-500">Loading subscriptions...</div>
          ) : subs.length === 0 ? (
            <div className="text-center text-slate-500">No subscriptions found.</div>
          ) : (
            <div className="space-y-4">
              {subs.map((s) => (
                <div key={s.id} className="p-4 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg mb-1">Plan: <span className="font-mono">{s.planId}</span></div>
                    <div className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold mb-2 ${statusColor(s.status)}`}>{s.status}</div>
                    <div className="text-slate-500">Next Billing: <span className="font-mono">{s.nextBillingDate}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold" onClick={() => handlePause(s.id)}>Pause</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-semibold" onClick={() => handleCancel(s.id)}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
