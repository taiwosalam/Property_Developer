export interface AvatarsProps {
  onClick?: (url: string) => void;
  maxNumber?: number;
  branch?: boolean;
}

export interface AvatarLinksResponse {
  avatars: {
    id: string;
    image_url: string;
  }[];
}

export interface BranchAvatarLinksResponse {
  images: {
    id: string;
    image_url: string;
  }[];
}

