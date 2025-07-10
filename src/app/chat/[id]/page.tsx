"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Chat from "@/components/Chat";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const conversationId = params?.id as string;

  if (status === "loading") return <p className="p-6">Loading...</p>;
  if (!session?.user?.id) return <p className="p-6 text-red-500">Unauthorized</p>;
  if (!conversationId) return <p className="p-6 text-red-500">Invalid conversation ID</p>;

  return (
    <main className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-500 hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold mb-4">Chat Room</h1>
      <Chat conversationId={conversationId} currentUserId={session.user.id} />

    </main>
  );
}
