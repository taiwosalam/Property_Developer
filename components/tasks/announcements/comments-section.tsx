import Comment, { CommentData } from "./comment";
import { SectionSeparator } from "@/components/Section/section-components";

interface CommentsSectionProps {
  comments: CommentData[];
}

const CommentsSection = ({ comments }: CommentsSectionProps) => {
  return (
    <div>
      <h3 className="text-black dark:text-white text-base font-medium mb-4">
        Comments
      </h3>
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <Comment 
            {...comment} handleLike={() => {}} 
            handleDislike={() => {}} 
            handleSubmit={async (e) => {}}  
          />
          {index < comments.length - 1 && <SectionSeparator className="my-4" />}
        </div>
      ))}
    </div>
  );
};

export default CommentsSection;
