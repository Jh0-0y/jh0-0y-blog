import type { TagGroup } from "./tag.enums";

export interface Tag {
  id: number;
  name: string;
  tagGroup: TagGroup;
}