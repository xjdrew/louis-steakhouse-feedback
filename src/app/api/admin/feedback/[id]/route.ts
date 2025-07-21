import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const feedbackId = parseInt(id);

    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { error: "Invalid feedback ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, response } = body;

    if (!status || !["unprocessed", "processing", "processed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: unprocessed, processing, processed" },
        { status: 400 }
      );
    }

    const updatedFeedback = await db.feedback.update({
      where: { id: feedbackId },
      data: {
        status,
        response: response || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}