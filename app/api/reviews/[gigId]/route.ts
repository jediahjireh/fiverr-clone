import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gigId: string }> },
) {
  try {
    // await the params since they're now a promise
    const { gigId } = await params;

    const reviews = await prisma.review.findMany({
      where: { gigId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
