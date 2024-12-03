import Image from "next/image";
import {
  LocationIcon,
  EmailIcon,
  TelephoneIcon,
  WebIcon,
} from "@/public/icons/icons";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const ExportPageHeader: React.FC<{
}> = () => {
  const logo = usePersonalInfoStore((state) => state.company_logo);
  const state = usePersonalInfoStore((state) => state.company_state);
  const lga = usePersonalInfoStore((state) => state.company_local_government);
  const address = usePersonalInfoStore((state) => state.company_head_office_address);
  const phoneNumbers = usePersonalInfoStore((state) => state.company_phone_number);

  return (
    <div
      className="rounded-lg p-7 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-darkText-primary"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div
        className="w-[300px] h-[100px] relative overflow-hidden rounded-lg"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 4px 6px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <Image src={logo || ""} alt="logo" fill className="object-cover" />
      </div>
      <div className="space-y-2">
        <h4 className="text-text-quaternary dark:text-white text-sm font-medium">
          Contact
        </h4>
        <ul className="space-y-2 [&>li]:flex [&>li]:items-center [&>li]:gap-[5px] [&>li]:text-text-quaternary [&>li]:text-sm">
          <li>
            <span className="text-brand-9 -ml-1">
              <LocationIcon size={22} />
            </span>
            <p className="dark:text-darkText-1">{address || "___"}</p>
          </li>
          <li>
            <span className="text-brand-9">
              <WebIcon />
            </span>
            <p className="dark:text-darkText-1">website link not available</p>
          </li>
          <li>
            <span className="text-brand-9">
              <EmailIcon />
            </span>
            <p className="lowercase dark:text-darkText-1">example@mail.com</p>
          </li>
          <li>
            <span className="text-brand-9">
              <TelephoneIcon />
            </span>
            <p className="dark:text-darkText-1">{phoneNumbers?.join(" || ") || "___"}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExportPageHeader;
