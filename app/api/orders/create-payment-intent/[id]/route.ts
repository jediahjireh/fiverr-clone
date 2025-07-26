import { type NextRequest, NextResponse } from "next/server";

import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // await the params since they're now a promise
    const { id } = await params;

    const gig = await prisma.gig.findUnique({
      where: { id },
    });

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100, // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const order = await prisma.order.create({
      data: {
        gigId: gig.id,
        buyerId: session.user.id,
        sellerId: gig.userId,
        title: gig.title,
        price: gig.price,
        image: gig.cover,
        paymentIntent: paymentIntent.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
