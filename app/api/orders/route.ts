import { type NextRequest, NextResponse } from "next/server";

import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = session.user.isSeller
      ? { sellerId: session.user.id }
      : { buyerId: session.user.id };

    const orders = await prisma.order.findMany({
      where: {
        ...where,
        isCompleted: true,
      },
      include: {
        gig: {
          select: {
            title: true,
            cover: true,
          },
        },
        buyer: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntent } = body;

    const order = await prisma.order.update({
      where: { paymentIntent },
      data: { isCompleted: true },
    });

    return NextResponse.json({
      message: "Order confirmed successfully",
      order,
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
