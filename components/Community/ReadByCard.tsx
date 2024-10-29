import { readyByData } from "@/app/(nav)/tasks/agent-community/data";
import Image from "next/image";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import user2 from "@/public/empty/user2.svg";

const ReadyByCard = () => {
  return (
    <div className="bg-[#EFF6FF] dark:bg-darkText-primary rounded-lg p-4">
      <h4 className="text-black dark:text-white font-semibold text-sm">
        Ready By
      </h4>
      {readyByData.map((item, index) => (
        <div key={index} className="flex w-full gap-3 mt-3 justify-between">
          <div className="flex gap-1 items-center">
            <div className="imgWrapper h-10 w-10">
              <Image
                src={user2}
                alt="user"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-black dark:text-white text-md font-semibold">
              {item.name}
            </p>
            <BadgeIcon color="blue" />
          </div>
          <p className="text-black dark:text-white text-sm"> {item.time} </p>
        </div>
      ))}
    </div>
  );
};

export default ReadyByCard;
