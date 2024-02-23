"use client";
import { ThreadMessage } from "openai/src/resources/beta/threads/index.js";
import React, { useState } from "react";

const ChatPage = () => {
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  const fetchMessages = async () => {};

  return (
    <div className="w-screen h-full flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-hidden p-8 space-y-2">
        {fetching && <div className="text-center font-bold">Fetching...</div>}
        {messages.length === 0 && !fetching && (
          <div className="text-center font-bold">No messages</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
