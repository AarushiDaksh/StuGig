export type Post = {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
  time: string;
};
