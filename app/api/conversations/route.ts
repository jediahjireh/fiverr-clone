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

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        buyer: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { to } = body;

    const conversation = await prisma.conversation.create({
      data: {
        sellerId: session.user.isSeller ? session.user.id : to,
        buyerId: session.user.isSeller ? to : session.user.id,
        readBySeller: session.user.isSeller,
        readByBuyer: !session.user.isSeller,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
