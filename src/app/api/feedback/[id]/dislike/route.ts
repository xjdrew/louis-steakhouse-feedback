import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "edge";

export async function POST(
  request: NextRequest,
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
      select: { dislikes: true }
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Increment dislikes
    const updatedFeedback = await db.feedback.update({
      where: { feedbackId },
      data: { 
        dislikes: { increment: 1 }
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
    console.error("Error updating dislikes:", error);
    return NextResponse.json(
      { error: "Failed to update dislikes" },
      { status: 500 }
    );
  }
}