import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";
import BadgeIcon, { BadgeIconColors } from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";

export interface UserCardProps {
  picture_url?: string;
  name: string;
  email: string;
  phone_number: string;
  user_tag: string;
  badge_color?: BadgeIconColors;
  other_info?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  email,
  phone_number,
  picture_url,
  name,
  user_tag,
  badge_color,
  other_info,
}) => {
  return (
    <div
      className="border border-brand-tertiary bg-[#F9F9F9] dark:bg-[#020617] dark:border-[#3C3D37] p-2 rounded-lg flex gap-2 items-start"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative overflow-hidden flex-shrink-0 w-[82px] h-[90px]">
        <Image
          src={picture_url || empty}
          alt={name}
          fill
          sizes="300px"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="flex items-center font-bold text-black dark:text-darkText-1 text-sm capitalize">
          <span className="text-ellipsis line-clamp-1">{name}</span>
          {badge_color && <BadgeIcon color={badge_color} />}
        </p>
        <p className="font-normal text-black dark:text-darkText-1 text-xs mb-1 text-ellipsis line-clamp-2 break-all">
          {email}
        </p>
        {user_tag === "mobile" || user_tag === "web" ? (
          <UserTag type={user_tag} className="mb-2" />
        ) : (
          <p className="text-xs text-brand-10 dark:text-darkText-1 font-normal capitalize">
            {user_tag}
          </p>
        )}
        <p className="font-semibold text-xs text-[#8D8D8D] dark:text-darkText-2 text-ellipsis line-clamp-1">
          {phone_number}
        </p>
        {other_info && (
          <p className="font-medium text-xs text-black dark:text-darkText-1 mt-2 text-ellipsis line-clamp-2">
            {other_info}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
