// import { comments } from "@/app/(nav)/management/agent-community/data";
import { comments } from "@/app/(nav)/accountant/management/agent-community/data";
import { CommentProps } from "@/app/(nav)/accountant/management/agent-community/type";
import Comment from "@/app/(nav)/management/agent-community/threads/[threadId]/preview/comment";

interface ThreadCommentProps {
  comments?: CommentProps[];
  slug?: string;
}
const ThreadComments = ({ comments, slug }: ThreadCommentProps) => {
  return (
    <div className="mt-4">
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <Comment key={comment.id} {...comment} slug={slug} />
        ))
      ) : (
        <div>There is no comment yet</div>
      )}
    </div>
  );
};

export default ThreadComments;
