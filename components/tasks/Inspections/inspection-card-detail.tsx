// Imports
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { InspectionCardDetailProps } from "./types";

const InspectionCardDetail: React.FC<InspectionCardDetailProps> = ({
  desc,
  title,
  verirified,
  tier,
}) => {
  const getBadgeColor = (tier?: number): BadgeIconColors => {
    if (!tier || !verirified) return "blue";
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  return (
    <div className="custom-flex-col gap-2">
      <p className="text-text-tertiary dark:text-darkText-1 text-base font-medium capitalize">
        {title}:
      </p>
      <div className="flex items-center">
        <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium">
          {desc}
        </p>
        {verirified && <BadgeIcon color={getBadgeColor(tier)} />}
      </div>
    </div>
  );
};

export default InspectionCardDetail;
