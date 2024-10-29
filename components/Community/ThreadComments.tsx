import Comment from "@/app/(nav)/tasks/agent-community/[threadId]/preview/comment";
import { comments } from "@/app/(nav)/tasks/agent-community/data";

const ThreadComments = () => {
  return (
    <div className="mt-4">
      {comments.map((comment, index) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export default ThreadComments;
