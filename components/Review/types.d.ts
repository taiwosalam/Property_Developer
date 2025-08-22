export interface ReviewCardProps {
  id: string;
  pfp: string;
  desc: string;
  time: string;
  replies: number;
  fullname: string;
  verified?: boolean;
  highlight?: boolean;
}

export interface ReviewProps {
  id?: number;
  pfp?: string;
  desc?: string;
  main?: boolean;
  fullname?: string;
  verified?: boolean;
  tier_id?: number
}
