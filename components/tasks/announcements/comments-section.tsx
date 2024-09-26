import Comment from "./comment";
import { SectionSeparator } from "@/components/Section/section-components";
const CommentsSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-black text-base font-medium">Comments</h3>
      <Comment replies />
    </div>
  );
};

export default CommentsSection;
