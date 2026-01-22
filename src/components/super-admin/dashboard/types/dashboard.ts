export interface StatsData {
  visitsToday: number;
  rewardsRedeemed: number;
  pointsIssued: number;
}

export interface VisitData {
  month: string;
  visits: number;
}

export interface PointsData {
  name: string;
  value: number;
  fill: string;
}

export interface Notification {
  id: number;
  type: 'redemption' | 'visit';
  message: string;
  time: string;
  icon: string;
}