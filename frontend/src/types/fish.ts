export interface Fish {
  id: string;
  name: string;
  image_url: string | null;
  drawing_data: string | null;
  creator_name: string;
  speed: number;
  direction: string;
  likes: number;
  created_at: string;
}

export interface TankStats {
  total_fish: number;
  total_creators: number;
}

export interface FishListResponse {
  fish: Fish[];
  stats: TankStats;
}

export interface SwimmingFish extends Fish {
  x: number;
  y: number;
  direction: "left" | "right";
  depth: number;
  inCave: boolean;
  isHiding: boolean;
  isSettling: boolean;
  phase: number;
}
