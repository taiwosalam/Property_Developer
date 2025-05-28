export interface MessageCardProps {
  id: string;
  pfp: string;
  desc: string;
  time: string;
  fullname: string;
  messages?: number;
  verified?: boolean;
  online?: boolean;
  highlight?: boolean;
  groupDesc?: string;
  onClick?: () => void;
  content_type?: string;
  last_seen?: string;
}

export interface MessagesProps {
  day?: string;
  messages?: any[];
  userId?: string | number;
  noScroll?: boolean;
}

export interface MessageProps {
  text: string;
  seen: string;
  time: string;
  content_type?: string;
  type: "to user" | "from user";
  noScroll?: boolean;
}
