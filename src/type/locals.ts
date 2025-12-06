export interface TopSplit {
  score: number;
  username: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export interface CategoryStat {
  average: number;
  percentGood: number;
}

export interface PubStats {
  taste: CategoryStat;
  temperature: CategoryStat;
  head: CategoryStat;
}

export interface Pub {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  topSplit: TopSplit | null;
  qualityRating: number | null;
  pintsLogged: number;
  avgPrice: number | null;
  leaderboard: LeaderboardEntry[];
  stats?: PubStats;
}
