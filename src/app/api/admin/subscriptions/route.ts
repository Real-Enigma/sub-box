import { NextRequest, NextResponse } from "next/server";
import { getAllSubscriptions } from "../../../../lib/firestore";

export async function GET() {
  const subs = await getAllSubscriptions();
  return NextResponse.json(subs);
}
