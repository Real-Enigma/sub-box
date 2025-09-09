"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { addSubscription, setUserProfile } from "../../../lib/firestore";

export default function CheckoutSuccessInner() {
  const params = useSearchParams();
  const planId = params.get("planId") || "";
  const subId = params.get("subId") || "";
  const { user, loading } = useAuth();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    async function finalize() {
      if (!user) {
        setStatus("no-user");
        return;
      }
      await addSubscription({ userId: user.uid, planId, status: "active", nextBillingDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), stripeSubscriptionId: subId });
      await setUserProfile(user.uid, { activePlan: planId, subscriptionId: subId });
      setStatus("success");
    }
    finalize();
  }, [user, planId, subId]);

  if (loading) return <div className="text-center mt-10">Checking auth...</div>;
  if (status === "no-user") return <div className="text-center mt-10">Please log in to complete the demo checkout.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center">
      {status === "processing" && <div>Finishing checkout...</div>}
      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold">Subscription Active</h1>
          <p className="mt-4">Your demo subscription for <strong>{planId}</strong> is now active.</p>
          <p className="mt-2">Subscription ID: {subId}</p>
        </div>
      )}
    </div>
  );
}
