import {
  Mail,
  MapIcon,
  PhoneIcon,
  VerifiedCompanyDiamond,
  WebsiteIcon,
} from "@/public/icons/icons";
import Image from "next/image";
import {
  CompanySummarySkeleton,
  formatCompanySummary,
} from "@/app/(nav)/community/agent-forum/components";
import { CompanySummaryTypes } from "./types";
import Link from "next/link";
import { empty } from "@/app/config";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { capitalizeWords } from "@/hooks/capitalize-words";
import BadgeIcon from "../BadgeIcon/badge-icon";

const CompanySummary = ({
  loading,
  companySummary,
}: {
  loading?: boolean;
  companySummary: CompanySummaryTypes;
}) => {
  const isDarkMode = useDarkMode();
  if (loading) {
    return <CompanySummarySkeleton />;
  }

  if (!companySummary) {
    return null;
  }

  const {
    logo,
    name,
    services,
    address,
    email,
    phoneNumber,
    website,
    socialHandles,
    stats,
    dark_logo,
    company_is_verified,
  } = formatCompanySummary(companySummary);

  const COMPANY_LOGO = isDarkMode ? dark_logo : logo;

  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Company Summary
      </h2>

      {/* Logo and Name */}
      <div className="mt-4 flex flex-col items-center">
        <div className="h-[70px] w-[260px] rounded-lg border border-brand-9 p-2">
          <Image
            src={COMPANY_LOGO}
            alt="Company Logo"
            width={500}
            height={500}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex items-center mt-4">
          <h3 className="text-xl font-bold text-black dark:text-white">
            {capitalizeWords(name)}
          </h3>
          {company_is_verified && <BadgeIcon color="gray" />}
        </div>
      </div>

      {/* Services (only show if services exist) */}
      {services.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-black dark:text-white">
            Services
          </p>
          <p className="text-sm text-text-disabled capitalize">
            {services.join(", ") || "--- ---"}
          </p>
        </div>
      )}

      {/* Contact Details */}
      <div className="mt-4">
        <p className="text-sm font-medium text-black dark:text-white">
          Contacts
        </p>
        <div className="mt-2 flex flex-col gap-2 text-sm text-text-disabled">
          <div className="flex items-center gap-2">
            <MapIcon />
            <span>{address}</span>
          </div>
          {website && (
            <div className="flex items-center gap-2">
              <WebsiteIcon />
              <span>{website}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <PhoneIcon />
            <span>{phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail />
            <span>{email}</span>
          </div>
        </div>
      </div>

      {/* Social Media Icons (only show valid links) */}
      {socialHandles.length > 0 && (
        <div className="mt-4 flex gap-2">
          {socialHandles.map(({ platform, link, icon }) => (
            <Link
              key={platform}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-black p-2 dark:border-white dark:text-white"
            >
              {icon}
            </Link>
          ))}
        </div>
      )}
      {/* Company Stats */}
      <div className="mt-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between py-1">
            <p className="text-sm text-text-label">{stat.label}</p>
            <p className="text-sm text-text-primary dark:text-white">
              {stat.value === 0 ? "0" : stat.value || "--- ---"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanySummary;
