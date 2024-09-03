export interface ReviewCardProps {
  id: string;
  pfp: string;
  desc: string;
  time: string;
  fullname: string;
  replies: number;
  verified?: boolean;
  highlight?: boolean;
}
