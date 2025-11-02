"use client";

import Image from "next/image";
import { MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send } from "lucide-react";
import { ReactNode } from "react";

// ---- Types that PostCard can accept ----
export type ApiPost = {
  _id: string;
  author: { username: string; image?: string | null };
  content: string;
  image?: string;
  createdAt?: string | Date;
  likes?: number;
  comments?: number;
  reposts?: number;
};

export type MockPost = {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  time?: string;      // e.g., "2h"
  likes?: number;
  comments?: number;
  reposts?: number;
};

type CommonProps = {
  currentUserId?: string;
  onDeleted?: (id: string) => void;
  onMutate?: () => void;
};

type Props =
  | ({ post: ApiPost } & CommonProps)
  | ({ post: MockPost } & CommonProps);

// Type guard
function isApiPost(p: ApiPost | MockPost): p is ApiPost {
  return (p as any)?._id !== undefined || (p as any)?.author !== undefined;
}

// Utility
function timeFrom(created?: string | Date): string {
  if (!created) return "";
  const d = new Date(created);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString();
}

export default function PostCard(props: Props) {
  const { post } = props;

  // Normalize fields to render
  const id = isApiPost(post) ? post._id : post.id;
  const authorName = isApiPost(post) ? post.author?.username ?? "User" : post.authorName;
  const authorAvatar = isApiPost(post) ? post.author?.image ?? undefined : post.authorAvatar;
  const authorTitle = isApiPost(post) ? undefined : post.authorTitle;
  const created = isApiPost(post) ? timeFrom(post.createdAt) : post.time ?? "";
  const content = post.content;
  const image = post.image;
  const likes = post.likes ?? 0;
  const comments = post.comments ?? 0;
  const reposts = post.reposts ?? 0;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex items-start gap-3 p-4">
        {authorAvatar ? (
   
<Image
  src="/h.jpg"
  alt={authorName}
  width={44}
  height={44}
  className="h-11 w-11 rounded-full object-cover"
/>

        ) : (
          <div className="h-11 w-11 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {authorName}
              </h3>
              {authorTitle ? (
                <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{authorTitle}</p>
              ) : null}
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500">{created}</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-zinc-500" />
          </div>
        </div>
      </header>

      <div className="px-4 pb-3 text-sm text-zinc-800 dark:text-zinc-200">{content}</div>

      {image ? (
        <div className="relative h-64 w-full bg-zinc-200 dark:bg-zinc-800">
          <Image src={image} alt="" fill className="object-cover" />
        </div>
      ) : null}

      <footer className="border-t border-zinc-200 p-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-3">
            <span>👍 {likes}</span>
            <span>💬 {comments}</span>
            <span>↻ {reposts}</span>
          </div>
        </div>
        <div className="mt-1 grid grid-cols-4 text-sm">
          <FeedAction icon={<ThumbsUp className="h-4 w-4" />} label="Like" />
          <FeedAction icon={<MessageCircle className="h-4 w-4" />} label="Comment" />
          <FeedAction icon={<Repeat2 className="h-4 w-4" />} label="Repost" />
          <FeedAction icon={<Send className="h-4 w-4" />} label="Send" />
        </div>
      </footer>
    </article>
  );
}

function FeedAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-md py-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
      {icon}
      <span className="text-xs sm:text-sm">{label}</span>
    </button>
  );
}
