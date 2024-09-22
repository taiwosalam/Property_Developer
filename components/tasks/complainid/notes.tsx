import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
const Notes = () => {
  return (
    <div
      className="bg-white px-4 pt-4 pb-6 font-medium rounded-lg border border-[rgba(193,194,195,0.40)]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <h6 className="text-black text-base mb-4">Notes</h6>
      <p className="text-xs">
        <span className="text-text-secondary">Created by:</span>{" "}
        <span className="text-brand-9">Ayobami. January 23, 2024 (2:20pm)</span>
      </p>
      <hr className="my-2 border-t border-dashed border-brand-9" />
      <TruncatedText
        lines={5}
        className="text-text-secondary text-xs mb-[18px]"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        pulvinar facilisis blandit. In augue nibh, bibendum vel sapien eu,
        aliquam mollis enim. Bibendum vel sapien eu, aliquam mollis enim.
        Bibendum vel sapien eu, aliquam mollis enim.
      </TruncatedText>
      <div className="flex items-center justify-between">
        <Button size="xs_medium" className="px-4 py-2">
          Edit Note
        </Button>
        <div className="flex gap-3 text-text-tertiary">
          <button type="button" aria-label="Previous">
            <ArrowLeft color="#696B70" size={20} strokeWidth={1} />
          </button>
          <button type="button" aria-label="Next">
            <ArrowRight color="#696B70" size={20} strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
