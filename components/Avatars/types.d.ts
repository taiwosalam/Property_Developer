export type AvatarType = "avatars" | "branchAvatar" | "images" | "documents";

export interface AvatarsProps {
  size?: number;
  maxSize?: number;
  type: AvatarType;
  onClick?: (url: string) => void;
}
