export interface ReviewResponseApi {
  status: "success";
  message: string;
  data: ReviewData;
}

export interface ReviewData {
  id: number;
  review_type: number;
  user_id: number;
  property_id: number;
  review: string;
  created_at: string;
  updated_at: string;
  user: ReviewUser;
  reactions: {
    likes: number;
    dislikes: number;
  };
  likes_count: number;
  dislikes_count: number;
  replies_count: number;
  reply_comments: any[]; // Replace with specific type if reply objects exist
  time_ago: string;
}

export interface ReviewUser {
  id: number;
  name: string;
  tier_id: number;
  created_at: string;
  updated_at: string;
  profile_picture_url: string;
}
