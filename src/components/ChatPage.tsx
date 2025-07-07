"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ChatBox from "@/components/ChatBox";

interface Conversation {
  userId: string;
  username: string;
  role: "client" | "freelancer";
}

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useParams();
  const chatUserId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
    };
    fetchConversations();
  }, []);

  const filtered = conversations.filter((c) =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex h-screen bg-gray-50 text-black">
      {/* Left Sidebar */}
      <aside className="w-80 border-r bg-white p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          💬 Chats
        </h2>
        <input
          type="text"
          placeholder="Search conversations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded mb-4"
        />
        <div className="flex-1 overflow-auto space-y-2">
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <button
                key={user.userId}
                onClick={() => window.location.assign(`/chat/${user.userId}`)}
                className={`w-full text-left p-3 rounded hover:bg-gray-100 ${
                  chatUserId === user.userId ? "bg-gray-100" : ""
                }`}
              >
                <span className="font-medium">{user.username}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No conversations found.</p>
          )}
        </div>
      </aside>

      {/* Right Chat Panel */}
      <section className="flex-1 p-6 flex flex-col">
        {!chatUserId ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-2">
              WELCOME TO FREELANCE CHATS
            </h1>
            <p className="text-gray-600">
              Connect with freelancers and clients effortlessly
            </p>
          </div>
        ) : session?.user?.id ? (
          <ChatBox
            currentUserId={session.user.id}
            receiverId={chatUserId}
            role={session.user.role}
          />
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </main>
  );
}
