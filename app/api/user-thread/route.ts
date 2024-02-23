import OpenAI from "openai";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

import { prismadb } from "@/lib/prismadb";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ success: "unauthorized" }, { status: 401 });
  }

  const userThread = await prismadb.userThread.findUnique({
    where: { userId: user.id },
  });

  if (userThread) {
    return NextResponse.json({ userThread, success: true }, { status: 200 });
  }

  try {
    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();

    const newUserThread = await prismadb.userThread.create({
      data: { userId: user.id, threadId: thread.id },
    });

    return NextResponse.json(
      { userThread: newUserThread, success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "error creating thread", success: false },
      { status: 400 }
    );
  }
}
