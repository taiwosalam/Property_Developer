export type AvatarType = "avatars" | "branchAvatar" | "images" | "documents";

export interface AvatarsProps {
  type: AvatarType;
  onClick?: (url: string) => void;
}
