import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { planId, userEmail } = await req.json();
  // create a fake subscription id
  const subId = `demo-sub-${Date.now()}`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/checkout/success?planId=${encodeURIComponent(planId)}&subId=${encodeURIComponent(subId)}`;
  return NextResponse.json({ url });
}
