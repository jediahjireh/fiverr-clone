import { type NextRequest, NextResponse } from "next/server";

import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("cat");
    const search = searchParams.get("search");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const sort = searchParams.get("sort") || "createdAt";

    const where: any = {};

    if (userId) where.userId = userId;

    // match the category regardless of capitalisation
    if (category) {
      where.category = {
        equals: category.toLowerCase(),
      };
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (min || max) {
      where.price = {};
      if (min) where.price.gte = Number.parseInt(min);
      if (max) where.price.lte = Number.parseInt(max);
    }

    const orderBy: any = {};
    if (sort === "sales") {
      orderBy.sales = "desc";
    } else {
      orderBy[sort] = "desc";
    }

    // console.log("Filters:", { where });

    const gigs = await prisma.gig.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(gigs);
  } catch (error) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user || !session.user.isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = gigSchema.parse(body);

    const gig = await prisma.gig.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(gig, { status: 201 });
  } catch (error) {
    console.error("Error creating gig:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", errors: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
