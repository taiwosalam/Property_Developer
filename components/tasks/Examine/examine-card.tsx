// Images
import ExamineIcon from "@/public/icons/examine-icon.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

interface ExamineCardProps {
  viewOnly?: boolean;
}

const ExamineCard: React.FC<ExamineCardProps> = ({ viewOnly }) => {
  return (
    <div
      className="custom-flex-col gap-4 pb-[18px] rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div
        className="h-[174px] flex items-center justify-center bg-[#00000033] dark:bg-white"
        // style={{ backgroundColor: "rgba(0, 0, 0, 0.20) dark:bg-white" }}
      >
        <Picture src={ExamineIcon} alt="examine" size={100} />
      </div>
      <div className="custom-flex-col gap-[22px] px-[18px]">
        <div className="custom-flex-col gap-2">
          <div className="cusotm-flex-col gap-1 font-medium">
            <p className="text-black dark:text-white text-base">Examine (House inspection)</p>
            <p className="text-text-tertiary dark:text-darkText-1 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, and
            </p>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <p className="text-text-label dark:text-darkText-2">ID: 123568765</p>
            <p className="text-neutral-4">12/01/24</p>
          </div>
        </div>
        {!viewOnly && (
          <div className="flex gap-2 justify-end">
            <Button size="xs_normal" variant="border" className="py-2 px-6">
              manage
            </Button>
            <Button size="xs_normal" className="py-2 px-6">
              report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamineCard;
