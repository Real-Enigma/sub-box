import { NextRequest, NextResponse } from "next/server";
import { updateSubscriptionStatus, getUserProfile, setUserProfile } from "../../../../lib/firestore";

export async function POST(req: NextRequest) {
  const { subId, event, nextBillingDate } = await req.json();
  if (event === 'invoice.paid') {
    await updateSubscriptionStatus(subId, 'active', nextBillingDate);
    // optionally update user next billing info
  } else if (event === 'invoice.payment_failed') {
    await updateSubscriptionStatus(subId, 'past_due');
    // optionally mark for cancellation after retries
  }
  return NextResponse.json({ ok: true });
}
