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
}

export interface MessagesProps {
  day: string;
}

export interface MessageProps {
  text: string;
  time: string;
  type: "to user" | "from user";
}
