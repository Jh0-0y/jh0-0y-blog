import type { TagGroup } from "../types/tag.enums";

export interface TagWithCount {
  id: number;
  name: string;
  tagGroup: TagGroup;
  postCount: number;
}

export interface GroupedTags {
  groupedTags: Record<TagGroup, TagWithCount[]>;
}

export interface PopularTag {
  rank: number;
  id: number;
  name: string;
  postCount: number;
}