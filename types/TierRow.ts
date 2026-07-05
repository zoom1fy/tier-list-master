import { TierItem } from "./TierItem";

export interface TierRow {
  id: string;
  name: string;
  label: string;
  backgroundColorClass: string;
  items: TierItem[];
}
