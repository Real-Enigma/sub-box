"use client";
import { Suspense } from "react";
import CheckoutSuccessInner from "./success-inner";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading checkout...</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
