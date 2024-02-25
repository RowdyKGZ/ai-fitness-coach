import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { prismadb } from "@/lib/prismadb";

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, sendNotifications, challengeId } = await request.json();

  if (!id || !sendNotifications || !challengeId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedChallengePreferences =
      await prismadb.challengePreferences.update({
        where: { id, userId: user.id },
        data: { challengeId, sendNotifications },
      });

    return NextResponse.json({
      success: true,
      data: updatedChallengePreferences,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Somthing went wrong" },
      { status: 500 }
    );
  }
}
