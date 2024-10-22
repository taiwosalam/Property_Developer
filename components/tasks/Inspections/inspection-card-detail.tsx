// Imports
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { InspectionCardDetailProps } from "./types";

const InspectionCardDetail: React.FC<InspectionCardDetailProps> = ({
  desc,
  title,
  verirified,
}) => {
  return (
    <div className="custom-flex-col gap-2">
      <p className="text-text-tertiary dark:text-darkText-1 text-base font-medium capitalize">
        {title}:
      </p>
      <div className="flex items-center">
        <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium">{desc}</p>
        {verirified && <BadgeIcon color="blue" />}
      </div>
    </div>
  );
};

export default InspectionCardDetail;
