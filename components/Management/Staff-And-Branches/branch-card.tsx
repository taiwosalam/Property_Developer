import type { BranchCardProps } from "./types";
import DefaultBranchPicture from "@/public/empty/branch.png";
import DefaultBranchManagerAvatar from "@/public/icons/contact.svg";
import Image from "next/image";

const BranchCard: React.FC<BranchCardProps> = ({
  branch_title,
  branch_full_address,
  avatar,
  manager_name,
  manager_avatar,
  staff_count,
  property_count,
  unit_count,
}) => {
  return (
    <div className="relative mt-[2.9rem]">
      <div
        className="w-[83px] h-[88px] rounded-full absolute top-[-2.9rem] left-[50%] translate-x-[-50%] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #38bdf8 52%, #ffffff00 40%)",
        }}
      ></div>
      <div className="absolute left-[50%] translate-x-[-50%] top-[-2.8rem] bg-white rounded-full w-[80px] h-[80px] overflow-hidden border-[3px] border-white">
        <Image
          src={avatar || DefaultBranchPicture}
          alt={branch_title || ""}
          width={94}
          height={94}
          className="w-[94px] h-[94px] rounded-full object-cover"
        />
      </div>
      <div className="rounded-2xl bg-white px-[20px] pt-[55px] pb-[20px] items-center text-center flex flex-col border border-support-1 border-solid">
        <p className="font-bold text-base text-black leading-5 mb-[5px]">
          {branch_title}
        </p>
        <p className="text-xs text-text-tertiary font-normal mb-[6.5px]">
          {branch_full_address}
        </p>
        <div className="flex items-center gap-2 justify-center mb-5">
          <div className="bg-brand-1 rounded-full w-5 h-5 grid place-items-center">
            <Image
              alt={manager_name || ""}
              src={manager_avatar || DefaultBranchManagerAvatar}
            />
          </div>
          <p className="text-black font-medium text-sm">{manager_name}</p>
        </div>
        <div className="flex gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:items-center overflow-x-auto max-w-[100%]">
          <div>
            <p className="bg-support-3 text-white font-medium text-base p-1 rounded-lg w-8">
              {staff_count}
            </p>
            <p className="text-text-label text-base font-medium">Staffs</p>
          </div>
          <div>
            <p className="bg-support-2 text-white font-medium text-base p-1 rounded-lg w-8">
              {property_count}
            </p>
            <p className="text-text-label text-base font-medium">Properties</p>
          </div>
          <div>
            <p className="bg-support-1 text-white font-medium text-base p-1 rounded-lg w-8">
              {unit_count}
            </p>
            <p className="text-text-label text-base font-medium">Units</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
