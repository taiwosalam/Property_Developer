import { comments } from "@/app/(nav)/management/agent-community/data";
import Comment from "@/app/(nav)/management/agent-community/threads/[threadId]/preview/comment";

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
