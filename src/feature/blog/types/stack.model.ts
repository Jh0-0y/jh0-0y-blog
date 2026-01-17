import type { StackGroup } from "../../../services/stack/stack.enums";

export interface Stack {
  id: number;
  name: string;
  stackGroup: StackGroup;
}