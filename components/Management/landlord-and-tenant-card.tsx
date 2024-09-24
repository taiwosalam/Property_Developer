import type { LandlordProps } from "./Landlord/types";
import type { ServiceProviderProps } from "../tasks/service-providers/types";
import type { TenantProps } from "./Tenants/types";
// import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";

export type UserCardProps = LandlordProps | TenantProps | ServiceProviderProps;

const UserCard: React.FC<UserCardProps> = ({
  first_name,
  last_name,
  email,
  user_tag,
  phone_number,
  // id,
  picture_url,
  service,
}) => {
  return (
    <div
      className="border border-brand-tertiary bg-[#F9F9F9] p-[3%] rounded-lg flex gap-[3%]"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative w-[30%] overflow-hidden aspect-[0.9]">
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
          {`${first_name} ${last_name}`}
          <BadgeIcon color="red" />
        </p>
        <p className="font-normal text-black text-xs mb-1">{email}</p>
        <UserTag type={user_tag} className="mb-2" />
        <p className="font-semibold text-xs text-[#8D8D8D]">{phone_number}</p>
        {service && (
          <p className="font-medium text-xs text-black mt-2">{service}</p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
