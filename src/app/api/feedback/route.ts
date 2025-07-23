import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name?: string; contact?: string; diningTime?: string; rating?: number; content?: string };
    const { name, contact, diningTime, rating, content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Feedback content is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const feedback = await db.feedback.create({
      data: {
        name: name || null,
        contact: contact || null,
        diningTime: diningTime ? new Date(diningTime) : null,
        rating: rating || 1,
        content,
        status: "unprocessed",
      },
    });

    return NextResponse.json({
      success: true,
      feedbackId: feedback.feedbackId,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get("id");

    if (!feedbackId) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const feedback = await db.feedback.findUnique({
      where: { feedbackId },
      select: {
        feedbackId: true,
        name: true,
        rating: true,
        content: true,
        status: true,
        response: true,
        createdAt: true,
        updatedAt: true,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}