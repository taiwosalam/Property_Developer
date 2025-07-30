import { readyByData } from "@/app/(nav)/community/agent-forum/data";
import Image from "next/image";
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import user2 from "@/public/empty/user2.svg";
import { empty } from "@/app/config";
import { TextSkeleton } from "@/app/(nav)/community/agent-forum/components";
import { useEffect } from "react";
import dayjs from "dayjs";

const ReadyByCard = ({ data }: { data: any }) => {
  const isArray = Array.isArray(data);

  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  return (
    <div className="bg-[#EFF6FF] dark:bg-darkText-primary rounded-lg p-4">
      <h4 className="text-black dark:text-white font-semibold text-sm">
        Ready By
      </h4>
      <div className="max-h-500 h-450 overflow-auto">
        {isArray && data.length > 0 ? (
          data.map((item: any, index: number) => (
            <div key={index} className="flex w-full gap-3 mt-3 justify-between">
              <div className="flex gap-1 items-center">
                <div className="imgWrapper h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={item.profile_picture || empty}
                    alt="user"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full bg-brand-9"
                  />
                </div>
                <p
                  className="text-black dark:text-white text-md font-semibold capitalize
                "
                >
                  {item.name || <TextSkeleton />}
                </p>
                {item.tier_id && item.tier_id > 2 && (
                  <BadgeIcon color={"gray"} />
                )}
                {/* <BadgeIcon color="blue" /> */}
              </div>
              <p className="text-black dark:text-white text-sm">
                {dayjs(item.viewed_at).format("MMM Do YYYY") || (
                  <TextSkeleton />
                )}
              </p>
            </div>
          ))
        ) : (
          <div className="py-1">
            <p className="text-slate-500">No current reader</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadyByCard;
