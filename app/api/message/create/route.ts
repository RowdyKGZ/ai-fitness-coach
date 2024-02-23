import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { message, threadId } = await req.json();

  console.log("From user", { message, threadId });

  if (!threadId || !message) {
    return NextResponse.json(
      { error: "ThreadId and message are required", success: false },
      { status: 400 }
    );
  }

  const openai = new OpenAI();

  try {
    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    console.log("From openai", threadMessage);

    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
