"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { CheckoutForm } from "@/components/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// * make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const { id: gigId } = useParams() as { id: string };
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(
          `/api/orders/create-payment-intent/${gigId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        toast({
          title: "Payment Error",
          description:
            err.message || "Could not initiate payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    createPaymentIntent();
  }, [gigId, toast]);

  const appearance = {
    theme: "stripe",
  } as const;

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Complete Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
              <p className="text-gray-600">Loading payment options...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
