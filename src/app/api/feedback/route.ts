import FeedbackModel from "@/models/Feedback.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {  // Remove the response parameter
    await dbConnect();

    try {
        const { name, email, message } = await request.json();
        const newFeedback = new FeedbackModel({ name, email, message });
        await newFeedback.save();
        return NextResponse.json({ success: true, message: "Feedback submitted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json({ success: false, message: "Failed to submit feedback." }, { status: 500 });   
    }
}