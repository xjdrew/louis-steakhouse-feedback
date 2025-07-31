import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Remove edge runtime to fix build issue
// export const runtime = "edge";

export async function POST(
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

    // Check if feedback exists
    const feedback = await db.feedback.findUnique({
      where: { feedbackId },
      select: { likes: true }
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Increment likes
    const updatedFeedback = await db.feedback.update({
      where: { feedbackId },
      data: { 
        likes: { increment: 1 }
      },
      select: {
        likes: true,
        dislikes: true
      }
    });

    return NextResponse.json({
      likes: updatedFeedback.likes,
      dislikes: updatedFeedback.dislikes
    });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}