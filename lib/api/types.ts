import { z } from 'zod';

export const VOTE_VALUES = ['positive', 'negative'] as const;
export type VoteValue = (typeof VOTE_VALUES)[number];

export const VOTE_SCHEMA = z.object({
  id: z.uuid(),
  vote: z.enum(VOTE_VALUES),
  username: z.string(),
  createdAt: z.string(),
});

export const COMMENT_SCHEMA = z.object({
  id: z.uuid(),
  content: z.string(),
  username: z.string(),
  profileImageUrl: z.string().nullish(),
  createdAt: z.string(),
});

export const POST_SCHEMA = z.object({
  id: z.uuid(),
  content: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  authorUsername: z.string(),
  authorProfileImageUrl: z.string().nullish(),
  votes: z.array(VOTE_SCHEMA),
  comments: z.array(COMMENT_SCHEMA),
});

export const PAGINATION_SCHEMA = z.object({
  page: z.number(),
  limit: z.number(),
  totalPosts: z.number(),
  totalPages: z.number(),
  hasMore: z.boolean(),
});

export type Post = z.infer<typeof POST_SCHEMA>;
export type Vote = z.infer<typeof VOTE_SCHEMA>;
export type Comment = z.infer<typeof COMMENT_SCHEMA>;
export type Pagination = z.infer<typeof PAGINATION_SCHEMA>;
