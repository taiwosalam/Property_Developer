import { PropertyRequestCardProps, RequestCardBaseProps } from "@/components/tasks/CallBack/types";

export type ThreadCardProps = {
  picture_url: string;
  user_pics: string;
  name: string;
  role: string;
  time: string;
  title: string;
  desc: string;
  myArticle?: boolean;
  id: string | number;
  comments: string;
  slug: string;
  likes: string;
  dislikes: string;
  shareLink: string;
};

export interface CommentProps {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
}


export interface AgentCommunityRequestCardProps extends RequestCardBaseProps {
  cardType: "agent-community";
  targetAudience?: string;
  state: string;
  lga: string;
  propertyType: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  subType: string;
  requestType: string;
  description: string;
  phoneNumber: string;
  cardViewDetails: {
    label: string;
    accessor: keyof PropertyRequestCardProps;
  }[];
}