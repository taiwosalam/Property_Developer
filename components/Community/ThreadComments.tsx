import { comments } from "@/app/(nav)/tasks/agent-community/data";
import Comment from "@/app/(nav)/tasks/agent-community/threads/[threadId]/preview/comment";

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
