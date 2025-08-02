import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";
import BadgeIcon, { BadgeIconColors } from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import {
  FlagBadge,
  NoteBlinkingIcon,
} from "@/public/icons/dashboard-cards/icons";
import { Lock } from "lucide-react";
import { capitalizeWords } from "@/hooks/capitalize-words";
import Picture from "../Picture/picture";

export interface UserCardProps {
  picture_url?: string | null;
  name: string;
  title?: string;
  id?: string | null;
  email?: string | null;
  phone_number?: string | null;
  user_tag: string;
  badge_color?: BadgeIconColors;
  other_info?: string | null;
  className?: string;
  note?: boolean;
  is_flagged?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  isOnline?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  email,
  title,
  phone_number,
  picture_url,
  name,
  user_tag,
  badge_color,
  other_info,
  className,
  note,
  is_flagged,
  is_verified,
  is_active,
  isOnline,
}) => {
  const flagged = Boolean(is_flagged);
  return (
    <div
      className={`h-full border border-brand-tertiary bg-[#F9F9F9] dark:bg-[#020617] dark:border-[#3C3D37] p-2 rounded-lg flex gap-2 justify-center items-center ${className}`}
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* <div className="rounded-lg relative overflow-hidden flex-shrink-0 w-[82px] h-[90px] bg-[#F0F2F5]">
        <Image
          src={picture_url || empty}
          alt={name}
          fill
          sizes="300px"
          className="w-full h-full object-cover"
        />
      </div> */}
      <div className="relative">
        <Picture
          src={picture_url || empty}
          alt={name}
          className="w-full h-full object-cover rounded-lg custom-secondary-bg"
          width={82}
          height={82}
          status={isOnline}
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="flex items-center justify-center font-bold text-black dark:text-darkText-1 text-sm capitalize">
          <span className="text-ellipsis line-clamp-1 break-all">
            {title ?? ""} {capitalizeWords(name)}{" "}
          </span>
          {badge_color && user_tag !== "web" && (
            <BadgeIcon color={badge_color} />
          )}

          {is_active === false && (
            <div className="text-red-500 text-xs pl-2">
              <FlagBadge size={18} />
            </div>
          )}
        </p>
        <p className="font-normal text-black dark:text-darkText-1 text-xs mb-1 text-ellipsis line-clamp-1 break-all">
          {email}
        </p>
        {user_tag === "mobile" || user_tag === "web" ? (
          <div className="flex gap-2 mb-2 items-center">
            <UserTag type={user_tag} />
            {note && (
              <div className="flex items-center">
                <NoteBlinkingIcon size={20} className="blink-color" />
              </div>
            )}
            {user_tag === "mobile" && flagged && (
              <div className="flex text-red-500 items-center">
                <FlagBadge size={20} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-brand-10 font-normal capitalize">
            {user_tag === "manager" ? "Branch Manager" : user_tag}
          </p>
        )}
        <p className="font-semibold text-xs text-[#8D8D8D] dark:text-darkText-2 text-ellipsis line-clamp-1">
          {phone_number}
        </p>

        {other_info && (
          <p className="w-40 font-medium text-xs text-black dark:text-darkText-1 mt-2 text-ellipsis line-clamp-1">
            {other_info}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
