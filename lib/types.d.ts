export type Game = "WARS" | "DR" | "HIDE" | "SG" | "MURDER" | "SKY";
export interface LeaderboardEntry {
  index: number;
  human_index?: number;
  username: string;
  xp?: number;
  played?: number;
  victories?: number;
}