"use client";
import axios from "axios";
import { useAtom } from "jotai";
import { userThreadAtom } from "@/atom";
import { useEffect, useState } from "react";
import { UserThread } from "@prisma/client";

import { Nvabar } from "@/components/nvabar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [userThread, setUserThread] = useState<UserThread | null>(null);
  const [userThread, setUserThread] = useAtom(userThreadAtom);

  useEffect(() => {
    async function getUserThread() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          userThread: UserThread;
        }>("/api/user-thread");

        if (!response.data.success || !response.data.userThread) {
          console.error(response.data.message ?? "Unknow error");
          setUserThread(null);
          return;
        }

        setUserThread(response.data.userThread);
      } catch (error) {
        console.error(error);
        setUserThread(null);
      }
    }

    getUserThread();
  }, [setUserThread]);

  console.log("userthread", userThread);

  return (
    <div className="flex flex-col w-full h-full">
      <Nvabar />
      {children}
    </div>
  );
}
