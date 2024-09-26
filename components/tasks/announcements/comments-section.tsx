import Comment from "./comment";
import { SectionSeparator } from "@/components/Section/section-components";
import { comments } from "./data";
const CommentsSection = () => {
  return (
    <div>
      <h3 className="text-black text-base font-medium mb-4">Comments</h3>
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <Comment {...comment} />
          {index < comments.length - 1 && <SectionSeparator className="my-4" />}
        </div>
      ))}
    </div>
  );
};

export default CommentsSection;
