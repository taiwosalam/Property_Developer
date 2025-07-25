import AnnouncementComment from "@/components/Community/announcement-comment";
import { CommentProps } from "./accouncement-comments";

interface ThreadCommentProps {
  comments?: CommentProps[];
}
const AnnouncementThread = ({ comments }: ThreadCommentProps) => {
  return (
    <div className="mt-4">
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <AnnouncementComment key={comment.id} {...comment} />
        ))
      ) : (
        <div>There is no comment yet</div>
      )}
    </div>
  );
};

export default AnnouncementThread;
