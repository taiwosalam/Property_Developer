// import { comments } from "@/app/(nav)/management/agent-community/data";
// import { comments } from "@/app/(nav)/accountant/management/agent-community/data";
// import { CommentProps } from "@/app/(nav)/accountant/management/agent-community/type";
import { CommentProps } from "@/app/(nav)/staff/management/agent-community/threads/[threadId]/preview/comment"; 
// import Comment from "@/app/(nav)/community/agent-forum/threads/[threadId]/preview/comment";
import AnnouncementComment from "@/components/Community/announcement-comment";

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
