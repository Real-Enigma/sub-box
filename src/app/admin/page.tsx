"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile } from "../../lib/firestore";
import { getPlans, addPlan, updatePlan, deletePlan } from "../../lib/firestore";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<{ role?: string } | null>(null);
  const [plans, setPlans] = useState<import("../../lib/firestore").Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [form, setForm] = useState<{ name: string; price: number; frequency: string; description: string; imageUrl: string }>({ name: "", price: 0, frequency: "monthly", description: "", imageUrl: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    async function load() {
      const p = await getUserProfile(uid);
      if (p && typeof p === 'object' && 'role' in p) {
        setProfile({
          role: typeof (p as { role?: string }).role === 'string' ? (p as { role?: string }).role : undefined
        });
      } else {
        setProfile(null);
      }
      const all = await getPlans();
  setPlans(all);
      setLoadingPlans(false);
    }
    load();
  }, [user]);

  const refresh = async () => {
    setLoadingPlans(true);
    const all = await getPlans();
  setPlans(all);
    setLoadingPlans(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      await updatePlan(editingId, form);
      setEditingId(null);
    } else {
  await addPlan(form);
    }
    setForm({ name: "", price: 0, frequency: "monthly", description: "", imageUrl: "" });
    await refresh();
  };

  const handleEdit = (plan: import("../../lib/firestore").Plan) => {
    setEditingId(plan.id);
    setForm({ name: plan.name || "", price: plan.price || 0, frequency: plan.frequency || "monthly", description: plan.description || "", imageUrl: plan.imageUrl || "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await deletePlan(id);
    await refresh();
  };

  const seedDemo = async () => {
    const demo = [
      { name: "Basic", price: 10, frequency: "monthly", description: "Starter box — curated items.", imageUrl: "https://via.placeholder.com/240x160?text=Basic" },
      { name: "Premium", price: 25, frequency: "monthly", description: "Premium selection with extras.", imageUrl: "https://via.placeholder.com/240x160?text=Premium" },
      { name: "Quarterly", price: 60, frequency: "quarterly", description: "Bigger box every 3 months.", imageUrl: "https://via.placeholder.com/240x160?text=Quarterly" },
    ];
    for (const p of demo) {
      await addPlan(p);
    }
    await refresh();
  };

  if (loading) return <div className="text-center mt-10">Checking auth...</div>;
  if (!user) return <div className="text-center mt-10">Please log in to access admin.</div>;

  const isAdmin = profile?.role === "admin";

  return (
    <div className="max-w-5xl mx-auto mt-10 px-2">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Admin &mdash; Manage Plans</h1>
      {!isAdmin && (
        <div className="mb-4 p-3 border border-yellow-200 bg-yellow-50 text-yellow-900 rounded text-center">
          You are not an admin. For demo, you may still seed plans below.
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button className="px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition" onClick={seedDemo}>Seed Demo Plans</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded font-semibold shadow hover:bg-gray-700 transition" onClick={refresh}>Refresh</button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-8 mb-10">
        <h2 className="text-xl font-bold mb-6 text-blue-600 text-center">{editingId ? "Edit Plan" : "Create New Plan"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} placeholder="Price" className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input value={form.frequency} onChange={e=>setForm({...form, frequency:e.target.value})} placeholder="Frequency" className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} placeholder="Image URL" className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
          <div className="md:col-span-2 flex gap-4 justify-center mt-2">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition">{editingId ? "Save" : "Create Plan"}</button>
            {editingId && <button type="button" className="px-5 py-2 bg-gray-400 text-white rounded font-semibold shadow hover:bg-gray-500 transition" onClick={()=>{setEditingId(null); setForm({ name: "", price: 0, frequency: "monthly", description: "", imageUrl: "" });}}>Cancel</button>}
          </div>
        </form>
      </div>

      <div>
        {loadingPlans ? <div className="text-center text-slate-500">Loading plans...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow flex flex-col items-center p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl || 'https://via.placeholder.com/240x160'} alt={p.name} className="w-full h-36 object-cover rounded mb-4 border border-slate-100 dark:border-slate-800" />
                <div className="font-bold text-lg mb-1 text-blue-700 text-center">{p.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-2 text-center">{p.description}</div>
                <div className="mb-2 text-slate-900 dark:text-slate-100 font-semibold">${p.price} / {p.frequency}</div>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded font-semibold shadow hover:bg-yellow-600 transition" onClick={()=>handleEdit(p)}>Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded font-semibold shadow hover:bg-red-700 transition" onClick={()=>handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
