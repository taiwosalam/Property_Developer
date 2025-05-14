import { readyByData } from "@/app/(nav)/management/agent-community/data";
import Image from "next/image";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import user2 from "@/public/empty/user2.svg";
import { empty } from "@/app/config";
import { TextSkeleton } from "@/app/(nav)/management/agent-community/components";
import { useEffect } from "react";
import dayjs from "dayjs";

const ReadyByCard = ({ data }: { data: any }) => {
  useEffect(() => {
    // console.log("data", data);
  }, [data]);

  const isArray = Array.isArray(data);
  return (
    <div className="bg-[#EFF6FF] dark:bg-darkText-primary rounded-lg p-4">
      <h4 className="text-black dark:text-white font-semibold text-sm">
        Ready By
      </h4>
      {isArray
        ? data.map((item: any, index: number) => (
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
                <p className="text-black dark:text-white text-md font-semibold">
                  {item.name || <TextSkeleton />}
                </p>
                {item.email_verified && <BadgeIcon color="blue" />}
                {/* <BadgeIcon color="blue" /> */}
              </div>
              <p className="text-black dark:text-white text-sm">
                {dayjs(item.viewed_at).format("MMM Do YYYY") || (
                  <TextSkeleton />
                )}
              </p>
            </div>
          ))
        : null}
    </div>
  );
};

export default ReadyByCard;
