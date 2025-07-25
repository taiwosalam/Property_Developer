// // import { comments } from "@/app/(nav)/management/agent-community/data";
// import { comments } from "@/app/(nav)/accountant/management/agent-community/data";
// import { CommentProps } from "@/app/(nav)/accountant/management/agent-community/type";
import Comment from "@/app/(nav)/community/agent-forum/threads/[threadId]/preview/comment";
import { CommentProps } from "./PropertyRequestComments";

interface ThreadCommentProps {
  comments?: CommentProps[];
}
const ThreadComments = ({ comments }: ThreadCommentProps) => {
  return (
    <div className="mt-4">
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <Comment key={comment.id} {...comment} />
        ))
      ) : (
        <div>There is no comment yet</div>
      )}
    </div>
  );
};

export default ThreadComments;
