import type { TagGroup } from "../types/tag.enums";

export interface CreateTagRequest {
  name: string;
  tagGroup?: TagGroup;
}

export interface UpdateTagRequest {
  name: string;
  tagGroup?: TagGroup;
}