export interface MessageCardProps {
  id: string;
  pfp: string;
  desc: string;
  time: string;
  fullname: string;
  messages?: number;
  verified?: boolean;
  highlight?: boolean;
  groupDesc?: string;
  onClick?: () => void;
}

export interface MessagesProps {
  day?: string;
  messages?: any[];
  userId?: string | number;
}

export interface MessageProps {
  text: string;
  time: string;
  type: "to user" | "from user";
}
