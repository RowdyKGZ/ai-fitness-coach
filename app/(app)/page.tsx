"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ThreadMessage } from "openai/src/resources/beta/threads/index.js";
import { useAtom } from "jotai";
import { userThreadAtom } from "@/atom";

const POLLING_FREQUENCY_MS = 10000;

const ChatPage = () => {
  const [userThread] = useAtom(userThreadAtom);

  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    if (!userThread) return;

    setFetching(true);

    try {
      const response = await axios.post<{
        success: boolean;
        error?: string;
        messages?: ThreadMessage[];
      }>("/api/message/list", { threadId: userThread.threadId });

      // Validation
      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? "Unknown error.");
        return;
      }

      let newMessages = response.data.messages;

      console.log(newMessages);

      // Sort in descending order
      newMessages = newMessages
        .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .filter(
          (message) =>
            message.content[0].type === "text" &&
            message.content[0].text.value.trim() !== ""
        );

      setMessages(newMessages);
    } catch (error) {
      console.error(error);
      setMessages([]);
    } finally {
      setFetching(false);
    }
  }, [userThread]);

  // useEffect(() => {
  //   const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

  //   // Clean up on unmount
  //   return () => clearInterval(intervalId);
  // }, [fetchMessages]);

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-scroll p-8 space-y-2">
        {/* 1. FETCHING MESSAGES */}
        {fetching && messages.length === 0 && (
          <div className="text-center font-bold">Fetching...</div>
        )}
        {/* 2. NO MESSAGES */}
        {messages.length === 0 && !fetching && (
          <div className="text-center font-bold">No messages.</div>
        )}
        {/* 3. LISTING OUT THE MESSAGES */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
              ["true", "True"].includes(
                (message.metadata as { fromUser?: string }).fromUser ?? ""
              )
                ? "bg-yellow-500 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {message.content[0].type === "text"
              ? message.content[0].text.value
                  .split("\n")
                  .map((text, index) => <p key={index}>{text}</p>)
              : null}
          </div>
        ))}
      </div>

      {/* {INPUT} */}
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default ChatPage;
