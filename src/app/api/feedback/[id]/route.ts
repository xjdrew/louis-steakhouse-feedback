import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Remove edge runtime to fix build issue
// export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: feedbackId } = await params;

    if (!feedbackId) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Fetch the specific feedback
    const feedback = await db.feedback.findUnique({
      where: {
        feedbackId: feedbackId,
      },
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
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}