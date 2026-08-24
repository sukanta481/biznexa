import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getChatbotReply } from "@/lib/chatbot";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please send a message between 1 and 1000 characters." },
        { status: 400 },
      );
    }

    return NextResponse.json({ reply: getChatbotReply(parsed.data.message) });
  } catch (error) {
    console.error("Chatbot reply failed", error);
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
