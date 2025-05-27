import Image from "next/image";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import BadgeIcon, { tierColorMap } from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import { secondaryFont } from "@/utils/fonts";
import { useChatStore } from "@/store/message";
import { default_user_data } from "./data";
import { truncateText } from "../tasks/vehicles-record/data";

const MessageUserProfileModal = () => {
  const { data } = useChatStore();
  const receiver = data?.receiver;

  const {
    name = default_user_data.name,
    email = default_user_data.email,
    phone = default_user_data.phone,
    picture = default_user_data.picture,
    address = default_user_data.address,
    city = default_user_data.city,
    state = default_user_data.state,
    lga = default_user_data.lga,
    tier_id = default_user_data.tier_id,
  } = receiver || {};

  const badgeColor =    
    tierColorMap[tier_id as keyof typeof tierColorMap] || "gray";

  return (
    <LandlordTenantModalPreset
      style={{ maxWidth: "614px" }}
      heading="Profile Details"
    >
      <div className="flex gap-1 items-center justify-center gap-4">
        <div className="imwrapper h-[100px] w-[100px]">
          <Image
            src={picture ?? empty}
            alt="user profile"
            width={100}
            height={100}
            className="rounded-full w-full h-full object-cover rounded-full custom-secondary-bg"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
              {truncateText(name ?? default_user_data.name, 40)}
            </p>
            <BadgeIcon color={badgeColor} />
          </div>
          <div className="custom-flex-col">
            <p
              className={`${secondaryFont.className} text-sm font-normal dark:text-white text-[#151515B3]`}
            >
              {email ?? default_user_data.email}
            </p>
            <p
              className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
            >
              {phone ?? default_user_data.phone}
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="custom-flex-col gap-2 mt-5">
        <p className="text-black dark:text-white text-lg font-bold capitalize">
          Contact
        </p>
        <div className="custom-flex-col gap-3">
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              Adress
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {address ?? default_user_data.address}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              City
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {city ?? default_user_data.city}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              State
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
               {state ?? default_user_data.state}
            </p>
          </div>
          <div className="flex">
            <p className="w-1/3 text-text-neutral dark:text-white text-sm font-normal capitalize">
              L.G
            </p>
            <p className="w-2/3 text-black dark:text-white text-md font-semibold capitalize">
              {lga ?? default_user_data.lga}
            </p>
          </div>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default MessageUserProfileModal;
