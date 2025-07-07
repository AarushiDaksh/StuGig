"use client";

import { useEffect, useState } from "react";

type ChatBoxProps = {
  currentUserId: string;
  receiverId: string;
  role: "client" | "freelancer";
};

export default function ChatBox({ currentUserId, receiverId, role }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages for this chat (example)
    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/messages/${receiverId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    };
    fetchMessages();
  }, [receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const res = await fetch(`/api/chat/send`, {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId,
        text: newMessage,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto border p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.sender === currentUserId ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
