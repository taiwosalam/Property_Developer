import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import Image from "next/image";
import { getBadgeColor } from "@/lib/utils";

interface IPersonProps {
  image?: string;
  name?: string;
  dateTime?: string;
  tier?: number;
}
const Person = ({ image, name, dateTime, tier }: IPersonProps) => {
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-10 h-10 rounded-full bg-neutral-2 dark:bg-darkText-primary overflow-hidden">
          <Image
            src={image || empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <p className="flex items-center gap-1">
          <span className="text-ellipsis line-clamp-1 text-base text-text-primary dark:text-darkText-1 font-medium capitalize pl-2 ">
            {name}
          </span>
          <BadgeIcon color={getBadgeColor(tier) ?? "gray"} />
        </p>
      </div>
      <p className="text-xs text-text-label font-medium">{dateTime}</p>
    </div>
  );
};

interface ReadAndDelivered {
  name: string;
  tier: number;
  image: string;
  dateTime: string;
}
interface ReadByProps {
  readBy?: ReadAndDelivered[];
  delivered?: ReadAndDelivered[];
}

const ReadBy = ({ readBy, delivered }: ReadByProps) => {
  return (
    <div className="p-[18px] rounded-lg bg-brand-1 dark:bg-darkText-primary space-y-6">
      <div className="space-y-3">
        <h6 className="text-sm text-text-label dark:text-white font-medium">
          Read by
        </h6>
        {readBy && readBy.length > 0 ? (
          <div className="space-y-4">
            {readBy.map((user, i) => (
              <Person
                key={i}
                name={user?.name}
                image={user?.image}
                dateTime={user?.dateTime}
                tier={user?.tier}
              />
            ))}
          </div>
        ) : (
          "No recent read by"
        )}
      </div>
      {/* <div className="space-y-3">
        <h6 className="text-sm text-text-label dark:text-white font-medium">
          Delivered To
        </h6>

        {delivered && delivered.length > 0 ? (
          <div className="space-y-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Person key={i} />
              ))}
          </div>
        ) : (
          "No recent delivered by"
        )}
      </div> */}
    </div>
  );
};

export default ReadBy;
