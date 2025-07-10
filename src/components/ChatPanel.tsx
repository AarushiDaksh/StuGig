"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Chat from "./Chat";

type ChatUser = {
  _id: string;
  name?: string;
  username?: string;
};

export default function ChatPanel({ role }: { role: "client" | "freelancer" }) {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!session?.user?.id) return;

      const res = await fetch(
        `/api/chat/connections?userId=${session.user.id}&role=${role}`
      );
      const data = await res.json();

      if (data.success) {
        setConnections(data.connections);
      }
    };

    fetchConnections();
  }, [session?.user?.id, role]);

  return (
    <div className="flex h-[75vh] border rounded overflow-hidden shadow">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Chats</h2>
        {[...new Map(connections.map(u => [u._id, u])).values()].map((user) => (
          <button
            key={user._id}
            onClick={() => setActiveChat(user)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition
              ${activeChat?._id === user._id 
                ? "bg-blue-100 text-blue-800" 
                : "hover:bg-gray-100 text-gray-700"}`}
          >
            {user.name ?? user.username ?? "Unknown"}
          </button>
        ))}
        {connections.length === 0 && (
          <p className="text-gray-400 text-sm mt-4">No active connections yet.</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-5 bg-gray-50">
        {activeChat ? (
          <Chat
            receiverId={activeChat._id}
            receiverRole={role === "client" ? "freelancer" : "client"}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
