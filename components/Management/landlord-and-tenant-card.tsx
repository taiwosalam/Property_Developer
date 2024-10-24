import type { LandlordProps } from "./Landlord/types";
import type { ServiceProviderProps } from "../tasks/service-providers/types";
import type { TenantProps } from "./Tenants/types";
import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";

// Staff Props. This is for Undo Modal Staff Profile
export interface StaffProps {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  picture_url: string;
}

export interface BaseProps {
  full_name: string;
  email: string;
  phone_number: string;
  picture_url: string;
  user_tag: "mobile" | "web";
}

export type UserCardProps =
  | (LandlordProps & { cardType: "landlord" })
  | (TenantProps & { cardType: "tenant" })
  | (ServiceProviderProps & { cardType: "service-provider" })
  | (StaffProps & { cardType: "staff" })
  | (BaseProps & { cardType: "base" });

const UserCard: React.FC<UserCardProps> = (props) => {
  const { email, phone_number, picture_url, cardType } = props;
  return (
    <div
      className="border border-brand-tertiary bg-[#F9F9F9] dark:bg-[#020617] dark:border-[#3C3D37] p-2 rounded-lg flex gap-2 items-start"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative overflow-hidden flex-shrink-0 w-[82px] h-[90px]">
        <Image
          src={picture_url || empty}
          alt={cardType !== "base" ? props?.first_name : props?.full_name}
          fill
          sizes="300px"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="flex items-center font-bold text-black dark:text-darkText-1 text-sm capitalize">
          <span className="text-ellipsis line-clamp-1">
            {cardType !== "base"
              ? `${props.first_name} ${props.last_name}`
              : props.full_name}
          </span>
          <BadgeIcon color="red" />
        </p>
        <p className="font-normal text-black dark:text-darkText-1 text-xs mb-1 text-ellipsis line-clamp-2 break-all">
          {email}
        </p>
        {cardType !== "staff" ? (
          <UserTag type={props.user_tag} className="mb-2" />
        ) : (
          <p className="text-xs text-brand-10 dark:text-darkText-1 font-normal">
            {props.role}
          </p>
        )}
        <p className="font-semibold text-xs text-[#8D8D8D] dark:text-darkText-2 text-ellipsis line-clamp-1">
          {phone_number}
        </p>
        {cardType === "service-provider" && (
          <p className="font-medium text-xs text-black dark:text-darkText-1 mt-2 text-ellipsis line-clamp-2">
            {props.service}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
