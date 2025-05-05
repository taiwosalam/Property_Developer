export type ReviewResponse = {
  status: "success";
  data: Review[];
};

type Review = {
  id: number;
  review_type: number;
  user_id: number;
  property_id: number;
  review: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user: User;
  reactions: {
    likes: number;
    dislikes: number;
  };
  likes_count: number;
  dislikes_count: number;
  replies_count: number;
  reply_comments: any[]; // Adjust this if the structure of a reply is known
  time_ago: string;
};

type User = {
  id: number;
  name: string;
  tier_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  profile_picture_url: string;
};

export interface IReviewCard {
  reviews: {
    id: number;
    picture: string;
    fullname: string;
    review: string;
    up_vote: number;
    down_vote: number;
    reply_count: number;
    tier_id: number;
    timestamp: string;
  }[];
}
export const transformReviewCard = (data: ReviewResponse): IReviewCard => {
  const { data: reviews } = data;
  return {
    reviews: reviews.map((review) => {
      return {
        id: review.id,
        picture: review?.user?.profile_picture_url,
        fullname: review?.user.name || "",
        review: review?.review || "",
        up_vote: review?.likes_count || 0,
        down_vote: review?.dislikes_count || 0,
        reply_count: review?.replies_count || 0,
        tier_id: review?.user?.tier_id,
        timestamp: review?.time_ago,
      };
    }),
  };
};
