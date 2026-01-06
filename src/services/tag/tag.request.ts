import type { TagGroup } from "@/domains/blog/types";

export interface CreateTagRequest {
  name: string;
  tagGroup?: TagGroup;
}

export interface UpdateTagRequest {
  name: string;
  tagGroup?: TagGroup;
}