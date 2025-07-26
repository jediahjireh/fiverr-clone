import { type NextRequest, NextResponse } from "next/server";

import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user || session.user.isSeller) {
      return NextResponse.json(
        { error: "Only buyers can create reviews" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Check if user already reviewed this gig
    const existingReview = await prisma.review.findUnique({
      where: {
        gigId_userId: {
          gigId: validatedData.gigId,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this gig" },
        { status: 400 },
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
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
    });

    // Update gig ratings
    await prisma.gig.update({
      where: { id: validatedData.gigId },
      data: {
        totalStars: { increment: validatedData.star },
        starNumber: { increment: 1 },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
