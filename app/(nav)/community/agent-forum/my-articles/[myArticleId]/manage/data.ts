export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  videoLink?: string;
  state?: string;
  lga?: string;
  published: boolean;
  media: { id: number; path: string }[];
  likesUp: number;
  likesDown: number;
  commentsCount: number;
  viewsCount: number;
  shareLink: string;
  toggleLike: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  id: number;
  name: string;
  phone: string;
  title: string;
  professionalTitle: string;
  role: string;
  tier: string;
  tierDescription: string;
  bio: string | null;
  picture: string;
  email: string;
}

export interface ArticleResponse {
  success: boolean;
  data: {
    post: any;
    company_summary: any;
    contributor: Contributor;
    comments: any[];
    readByData: {
      name: string;
      profile_picture: string;
      email_verified: boolean;
      viewed_at: string;
    }[];
  };
}

export interface TransformedArticleData {
  article: Article;
  contributor: Contributor;
  comments: any[];
  readByData: {
    name: string;
    profile_picture: string;
    email_verified: boolean;
    viewed_at: string;
  }[];
}

export const transformMyArticleResponse = (
  response: ArticleResponse
): TransformedArticleData => {
  const { post, contributor, comments, readByData } = response.data;
  return {
    article: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      videoLink: post.video_link,
      state: post.state,
      lga: post.lga,
      published: post.published,
      media: post.media || [],
      likesUp: post.likes_up,
      likesDown: post.likes_down,
      commentsCount: post.comments_count,
      viewsCount: post.views_count,
      shareLink: post.share_link,
      toggleLike: post.toggle_like,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    },
    contributor,
    comments: comments || [],
    readByData: readByData || [],
  };
};
