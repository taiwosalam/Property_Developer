import Image from "next/image";
import {
  LocationIcon,
  EmailIcon,
  TelephoneIcon,
  WebIcon,
} from "@/public/icons/icons";

const ExportPageHeader: React.FC<{
  logo: string;
  location: string;
  website: string;
  phoneNumbers: string[];
  email: string;
}> = ({ logo, location, website, phoneNumbers, email }) => {
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
        <Image src={logo} alt="logo" fill className="object-cover" />
      </div>
      <div className="space-y-2">
        <h4 className="text-text-quaternary dark:text-white text-sm font-medium">Contact</h4>
        <ul className="space-y-2 [&>li]:flex [&>li]:items-center [&>li]:gap-[5px] [&>li]:text-text-quaternary [&>li]:text-sm">
          <li>
            <span className="text-brand-9">
              <LocationIcon />
            </span>
            <p className="dark:text-darkText-1">{location}</p>
          </li>
          <li>
            <span className="text-brand-9">
              <WebIcon />
            </span>
            <p className="dark:text-darkText-1">{website}</p>
          </li>
          <li>
            <span className="text-brand-9">
              <TelephoneIcon />
            </span>
            <p className="dark:text-darkText-1">{phoneNumbers.join(" || ")}</p>
          </li>
          <li>
            <span className="text-brand-9">
              <EmailIcon />
            </span>
            <p className="lowercase dark:text-darkText-1">{email}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExportPageHeader;
