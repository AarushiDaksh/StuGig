"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

// ✅ Accept either conversationId OR receiverId + receiverRole
interface ChatProps {
  conversationId?: string;
  receiverId?: string;
  receiverRole?: "client" | "freelancer";
  currentUserId?: string; // used in /chat/[id] page
}

export default function Chat({
  conversationId: propConversationId,
  receiverId,
  receiverRole,
  currentUserId,
}: ChatProps) {
  const { data: session } = useSession();
  const userId = currentUserId || session?.user?.id;
  const [conversationId, setConversationId] = useState<string | null>(propConversationId || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔄 Load or create conversation if using receiverId mode
  useEffect(() => {
    const setupConversation = async () => {
      if (propConversationId || !receiverId || !userId) return;

      const res = await fetch(`/api/chat/conversation?user1=${userId}&user2=${receiverId}`);
      const data = await res.json();
      if (data.conversation?._id) {
        setConversationId(data.conversation._id);
      }
    };

    setupConversation();
  }, [receiverId, userId, propConversationId]);

  // 📥 Load messages when conversationId becomes available
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const res = await fetch(`/api/chat/message?conversationId=${conversationId}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    };

    fetchMessages();
  }, [conversationId]);

  // 📤 Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId || !userId) return;

    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        sender: userId,
        text: newMessage,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    }
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white border rounded shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[75%] px-4 py-2 rounded text-sm ${
              msg.sender === userId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 flex gap-2 bg-gray-50">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded text-sm"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
