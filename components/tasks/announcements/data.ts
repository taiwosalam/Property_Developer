interface CommentData {
  id: number | string;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  likeCount?: number;
  dislikeCount?: number;
  commentsCount?: number;
  handleLike?: () => void;    // Added
  handleDislike?: () => void; // Added
  replies?: CommentData[];
}

export const comments: CommentData[] = [
  {
    id: 1,
    name: "Oloruntoba Morakinyo",
    text: "It is expected that cities and other states’ capitals without many security challenges will witness refinements. Many urban centres will witness positive changes in real estate",
    likes: 1,
    dislikes: 0,
    replies: [
      {
        id: 2,
        name: "John Doe",
        text: "It is expected that cities and other states capitals without many security challenges",
        likes: 4,
        dislikes: 2,
        likeCount: 0,
        dislikeCount: 0,
        commentsCount: 0,
        handleLike: () => {},
        handleDislike: () => {},
        replies: [
          {
            id: "12",
            name: "Star Trek",
            text: "Just making things complicated",
            likes: 0,
            dislikes: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentsCount: 0,
          },
        ],
      },
      {
        id: 3,
        name: "Amada Okeke",
        text: "I disagree with the above statement",
        likes: 0,
        dislikes: 12,
        likeCount: 0,
        dislikeCount: 0,
        commentsCount: 0,
      },
      {
        id: 4,
        name: "John Doe",
        text: "I agree with the above statement",
        likes: 4,
        dislikes: 0,
        likeCount: 0,
        dislikeCount: 0,
        commentsCount: 0,
      },
    ],
  },
  {
    id: 5,
    name: "Cythia Mordi",
    text: "What are the way we can reduce the rate of unemployment in Nigeria?",
    likes: 0,
    dislikes: 0,
    likeCount: 0,
    dislikeCount: 0,
      commentsCount: 0,
    handleLike: () => {},
    handleDislike: () => {}
    },
  {
    id: 6,
    name: "Copland Marker",
    text: "Have you watched Squid Game?",
    likes: 5,
    dislikes: 0,
    replies: [
      {
        id: 7,
        name: "Dont Check My Name",
        text: "I dont watch boring movies. Hahaha",
        likes: 500,
        dislikes: 0,
        likeCount: 0,
        dislikeCount: 0,
        commentsCount: 0,
        handleLike: () => {},
        handleDislike: () => {}
      },
    ],
  },
];
