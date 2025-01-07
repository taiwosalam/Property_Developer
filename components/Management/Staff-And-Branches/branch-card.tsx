import { empty } from "@/app/config";
import DefaultBranchManagerAvatar from "@/public/icons/contact.svg";
import Image from "next/image";

export interface BranchCardProps {
  id: string;
  branch_picture: string;
  branch_title: string;
  branch_full_address: string;
  manager_name: string;
  manager_picture?: string | null;
  staff_count: number;
  property_count: number;
  unit_count: number;
}

const BranchCard: React.FC<BranchCardProps> = ({
  branch_title,
  branch_full_address,
  branch_picture,
  manager_name,
  manager_picture,
  staff_count,
  property_count,
  unit_count,
}) => {
  return (
    <div className="relative mt-[3rem]">
      <div
        className="w-[99px] h-[104px] rounded-full absolute top-[-2.92rem] left-[50%] translate-x-[-50%] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #38bdf8 46%, #ffffff00 0%)",
        }}
      />
      <div className="absolute left-[50%] translate-x-[-50%] top-[-2.8rem] bg-white dark:bg-darkText-primary rounded-full w-[95px] h-[95px] overflow-hidden border-[3px] border-transparent">
        <Image
          src={branch_picture || empty}
          alt={branch_title}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="rounded-2xl bg-white dark:bg-darkText-primary px-[20px] pt-[60px] pb-[20px] items-center text-center flex flex-col border-2 border-support-1 border-solid h-full">
        <p className="font-bold text-base text-black dark:text-white leading-5 mb-[5px]">
          {branch_title}
        </p>
        <p className="text-xs text-text-tertiary font-normal mb-[6.5px] line-clamp-1 truncate">
          {branch_full_address}
        </p>
        <div className="flex items-center gap-2 justify-center mb-5">
          <Image
            alt={manager_name}
            src={manager_picture || DefaultBranchManagerAvatar}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full object-cover"
          />
          <p className="text-black dark:text-darkText-1 font-medium text-sm">
            {manager_name}
          </p>
        </div>
        <div className="flex gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:items-center overflow-x-auto max-w-[100%]">
          <div>
            <p className="bg-support-3 text-white font-medium text-base p-1 rounded-lg w-8">
              {staff_count}
            </p>
            <p className="text-text-label text-base font-medium dark:text-darkText-1">
              Staffs
            </p>
          </div>
          <div>
            <p className="bg-support-2 text-white font-medium text-base p-1 rounded-lg w-8">
              {property_count}
            </p>
            <p className="text-text-label text-base font-medium dark:text-darkText-1">
              Properties
            </p>
          </div>
          <div>
            <p className="bg-support-1 text-white font-medium text-base p-1 rounded-lg w-8">
              {unit_count}
            </p>
            <p className="text-text-label text-base font-medium dark:text-darkText-1">
              Units
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
