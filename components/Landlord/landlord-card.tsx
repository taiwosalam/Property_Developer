import type { LandlordCardProps } from "./types";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Image from "next/image";

const LandlordCard: React.FC<LandlordCardProps> = ({
  first_name,
  last_name,
  email,
  user_tag,
  phone_number,
  picture,
  avatar,
  picture_url,
}) => {
  // Determine background and text color based on user_tag
  const tagStyles =
    user_tag === "mobile"
      ? "bg-success-1 text-success-3"
      : "bg-brand-3 text-brand-9";
  return (
    <div className="border-brand-tertiary bg-[#F9F9F9] p-2 rounded-lg flex gap-2">
      <div className="rounded-lg bg-brand-2 p-3">
        <Image
          src={picture_url || DefaultLandlordAvatar}
          alt={first_name}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="font-bold text-black text-sm">
          {`${first_name} ${last_name}`}
        </p>
        <p className="font-normal text-black text-xs">{email}</p>
        <p className={`rounded-lg py-1 px-6 ${tagStyles}`}>{user_tag}</p>
        <p className="font-semibold text-xs text-[#8D8D8D]">{phone_number}</p>
      </div>
    </div>
  );
};

export default LandlordCard;
