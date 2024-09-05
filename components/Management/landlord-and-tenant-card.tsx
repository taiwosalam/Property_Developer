import type { LandlordProps } from "./Landlord/types";
import SampleLandlord from "@/public/empty/SampleLandlord.jpeg";
import UserTag from "@/components/Tags/user-tag";
import Image from "next/image";

const LandlordAndTenantCard: React.FC<LandlordProps> = ({
  first_name,
  last_name,
  email,
  user_tag,
  phone_number,
  picture_url,
}) => {
  return (
    <a
      href=""
      className="border border-brand-tertiaryy bg-[#F9F9F9] p-[3%] rounded-lg flex gap-[3%] min-w-[284px]"
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="rounded-lg relative w-[30%] overflow-hidden aspect-[0.9]">
        {/* <Image
          src={picture_url || DefaultLandlordAvatar}
          alt={first_name}
          fill
          sizes="auto"
          className="w-full h-full object-cover"
        /> */}
        <Image
          src={SampleLandlord}
          alt={first_name}
          // sizes="auto"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-start">
        <p className="font-bold text-black text-sm capitalize">
          {`${first_name} ${last_name}`}
        </p>
        <p className="font-normal text-black text-xs mb-1">{email}</p>
        <UserTag type={user_tag} className="mb-2" />
        <p className="font-semibold text-xs text-[#8D8D8D]">{phone_number}</p>
      </div>
    </a>
  );
};

export default LandlordAndTenantCard;
