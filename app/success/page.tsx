"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  const confirmOrderMutation = useMutation({
    mutationFn: async (payment_intent: string) => {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntent: payment_intent }),
      });
      if (!response.ok) throw new Error("Failed to confirm order");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Confirmed!",
        description: "Your order has been successfully placed.",
      });
      setTimeout(() => {
        router.push("/orders");
      }, 5000); // Redirect after 5 seconds
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: `Failed to confirm order: ${err.message}`,
        variant: "destructive",
      });
      // Redirect to orders page even on error after a delay
      setTimeout(() => {
        router.push("/orders");
      }, 5000);
    },
  });

  useEffect(() => {
    if (paymentIntent) {
      confirmOrderMutation.mutate(paymentIntent);
    } else {
      toast({
        title: "Error",
        description: "No payment intent found.",
        variant: "destructive",
      });
      router.push("/"); // Redirect to home if no payment intent
    }
  }, [paymentIntent, router, confirmOrderMutation, toast]);

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50 p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700">
          Your order has been placed. You are being redirected to the orders
          page.
        </p>
        <p className="text-sm text-gray-500">Please do not close this page.</p>
        {confirmOrderMutation.isPending && (
          <div className="mt-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
