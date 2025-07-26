"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { toast } = useToast();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          toast({
            title: "Payment Successful!",
            description: "Redirecting you to your orders.",
          });
          // Redirect to success page or orders page after a short delay
          setTimeout(() => {
            router.push("/orders");
          }, 3000);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          toast({
            title: "Payment Processing",
            description: "Your payment is currently being processed.",
          });
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          toast({
            title: "Payment Failed",
            description: "Your payment was not successful, please try again.",
            variant: "destructive",
          });
          break;
        default:
          setMessage("Something went wrong.");
          toast({
            title: "Error",
            description: "An unexpected error occurred during payment.",
            variant: "destructive",
          });
          break;
      }
    });
  }, [stripe, toast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An error occurred.");
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment.",
        variant: "destructive",
      });
    } else {
      setMessage("An unexpected error occurred.");
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  } as const;

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full"
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="mt-2 text-sm text-red-500">
          {message}
        </div>
      )}
    </form>
  );
}
