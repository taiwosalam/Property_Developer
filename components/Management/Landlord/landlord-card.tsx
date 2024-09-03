import clsx from "clsx";
import type { LandlordCardProps } from "./types";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Image from "next/image";

const LandlordCard: React.FC<LandlordCardProps> = ({
  first_name,
  last_name,
  email,
  user_tag,
  phone_number,
  picture_url,
}) => {
  // Determine background and text color based on user_tag
  const tagClasses =
    user_tag === "mobile"
      ? "bg-success-1 text-success-3"
      : "bg-brand-3 text-brand-9";
  return (
    <div
      className="border border-brand-tertiary bg-[#F9F9F9] p-2 rounded-lg flex gap-[3%]"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative w-[30%] overflow-hidden">
        <Image
          src={picture_url || DefaultLandlordAvatar}
          alt={first_name}
          fill
          sizes="auto"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start gap-y-[5px]">
        <p className="font-bold text-black text-sm capitalize">
          {`${first_name} ${last_name}`}
        </p>
        <p className="font-normal text-black text-xs">{email}</p>
        <p
          className={clsx(
            "rounded-lg py-1 px-6 mb-2 text-[10px] capitalize",
            tagClasses
          )}
        >
          {user_tag}
        </p>
        <p className="font-semibold text-xs text-[#8D8D8D]">{phone_number}</p>
      </div>
    </div>
  );
};

export default LandlordCard;
