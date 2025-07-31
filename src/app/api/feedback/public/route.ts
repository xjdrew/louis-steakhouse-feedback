import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const rating = url.searchParams.get("rating");
    
    const offset = (page - 1) * limit;

    // Get Cloudflare environment
    const db = await getDb();

    // Build where clause
    const where: { rating?: number } = {};
    if (rating && rating !== "all") {
      where.rating = parseInt(rating);
    }

    // Fetch feedback with pagination
    const [feedback, total] = await Promise.all([
      db.feedback.findMany({
        where,
        select: {
          feedbackId: true,
          name: true,
          rating: true,
          content: true,
          diningTime: true,
          createdAt: true,
          likes: true,
          dislikes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      db.feedback.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching public feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}