export interface BattleResult {
    type: "person" | "starship";
    name: string;
    attribute: number;
    winner: boolean;
  }
  