import type { LandlordProps } from "./Landlord/types";
import type { ServiceProviderProps } from "../tasks/service-providers/types";
import type { TenantProps } from "./Tenants/types";
import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";

// Staff Props. This is for Undo Modal Staff Profile
export interface StaffProps {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  picture_url: string;
  avatar: string;
}

export type UserCardProps =
  | (LandlordProps & { cardType: "landlord" })
  | (TenantProps & { cardType: "tenant" })
  | (ServiceProviderProps & { cardType: "service-provider" })
  | (StaffProps & { cardType: "staff" });

const UserCard: React.FC<UserCardProps> = (props) => {
  const { first_name, last_name, email, phone_number, picture_url, cardType } =
    props;
  return (
    <div
      className="border border-brand-tertiary bg-[#F9F9F9] p-[3%] rounded-lg flex gap-[3%]"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative w-[30%] overflow-hidden aspect-[0.9] flex-shrink-0">
        <Image
          src={picture_url || empty}
          alt={first_name}
          fill
          sizes="300px"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="flex items-center font-bold text-black text-sm capitalize">
          <span className="text-ellipsis line-clamp-1">{`${first_name} ${last_name}`}</span>
          <BadgeIcon color="red" />
        </p>
        <p className="font-normal text-black text-xs mb-1 text-ellipsis line-clamp-2 break-all">
          {email}
        </p>
        {cardType !== "staff" ? (
          <UserTag type={props.user_tag} className="mb-2" />
        ) : (
          <p className="text-xs text-brand-10 font-normal">{props.role}</p>
        )}
        <p className="font-semibold text-xs text-[#8D8D8D] text-ellipsis line-clamp-1">
          {phone_number}
        </p>
        {cardType === "service-provider" && (
          <p className="font-medium text-xs text-black mt-2 text-ellipsis line-clamp-2">
            {props.service}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
