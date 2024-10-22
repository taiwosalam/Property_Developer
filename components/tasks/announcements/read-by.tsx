import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import Image from "next/image";

const Person = () => {
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-10 h-10 rounded-full bg-neutral-2 dark:bg-darkText-primary overflow-hidden">
          <Image
            src={empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <p className="flex items-center">
          <span className="text-ellipsis line-clamp-1 text-base text-text-primary dark:text-darkText-1 font-medium">
            Salam Alaikum
          </span>
          <BadgeIcon color="blue" />
        </p>
      </div>
      <p className="text-xs text-text-label font-medium">
        12/01/2024 (02:30pm)
      </p>
    </div>
  );
};

const ReadBy = () => {
  return (
    <div className="p-[18px] rounded-lg bg-brand-1 dark:bg-darkText-primary space-y-6">
      <div className="space-y-3">
        <h6 className="text-sm text-text-label dark:text-white font-medium">
          Read by
        </h6>
        <div className="space-y-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Person key={i} />
            ))}
        </div>
      </div>
      <div className="space-y-3">
        <h6 className="text-sm text-text-label dark:text-white font-medium">
          Delivered To
        </h6>
        <div className="space-y-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Person key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReadBy;
