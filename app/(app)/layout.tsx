"use client";
import axios from "axios";
import { useAtom } from "jotai";
import { assistantAtom, userThreadAtom } from "@/atom";
import { useEffect, useState } from "react";
import { Assistant, UserThread } from "@prisma/client";

import { Nvabar } from "@/components/nvabar";
import toast, { Toaster } from "react-hot-toast";
import useServiceWorker from "@/hooks/useServiceWorker";
import { NotificationModal } from "@/components/notification-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [userThread, setUserThread] = useState<UserThread | null>(null);

  // Atom state
  const [, setUserThread] = useAtom(userThreadAtom);
  const [assistant, setAssistant] = useAtom(assistantAtom);

  // State
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] =
    useState(false);

  // hook
  useServiceWorker();

  const handleNotificationModalClose = (didConstent: boolean) => {
    setIsNotificationsModalVisible(false);

    if (didConstent) {
      toast.success("You will now receive notifications");
    }
  };

  const saveSubscription = async () => {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    try {
      const response = await axios.post("/api/subscription", { subscription });

      if (!response.data.success) {
        console.error(response.data.message ?? "Unknow error");
        toast.error("Failed to save subscription");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save subscription");
    }
  };

  useEffect(() => {
    if (assistant) return;

    async function getAssistant() {
      try {
        const response = await axios.get<{
          success: boolean;
          message?: string;
          assistants: Assistant;
        }>("/api/assistant");

        if (!response.data.success || !response.data.assistants) {
          console.error(response.data.message ?? "Unknown error.");
          toast.error("Failed to fetch assistant.");
          setAssistant(null);
          return;
        }

        setAssistant(response.data.assistants);
      } catch (error) {
        console.error(error);
        setAssistant(null);
      }
    }

    getAssistant();
  }, [assistant, setAssistant]);

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

  useEffect(() => {
    if ("Notification" in window) {
      setIsNotificationsModalVisible(Notification.permission === "default");
      console.log("Notification permission:", Notification.permission);
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Nvabar />
      {children}
      {isNotificationsModalVisible && (
        <NotificationModal
          saveSubscription={saveSubscription}
          onRequestClose={handleNotificationModalClose}
        />
      )}
      <Toaster />
    </div>
  );
}
