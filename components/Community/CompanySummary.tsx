import {
  FbIcon,
  InstagramIcon,
  Mail,
  MapIcon,
  PhoneIcon,
  SocialWebIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/public/icons/icons";
import Image from "next/image";
import { CompanySummarySkeleton } from "@/app/(nav)/management/agent-community/components";
import { empty } from "@/app/config";
import { calculateYearsInIndustry } from "@/app/(nav)/management/agent-community/data";
import { CompanySummaryTypes } from "./types";

const CompanySummary = ({
  loading,
  companySummary,
}: {
  loading?: boolean;
  companySummary: CompanySummaryTypes;
}) => {
  if (loading) {
    return <CompanySummarySkeleton />;
  }

  if (!companySummary) {
    return null;
  }

  const {
    addresses,
    company_logo,
    contact_details,
    details,
    email,
    join_ourproperty,
    name,
    services,
    social_handles,
    total_branch,
    total_review,
    total_staff,
    total_unit,
  } = companySummary;
  // Helper function to get non-null services, excluding metadata
  console.log("companysummary", companySummary);
  const getAvailableServices = (services: Record<string, any>) => {
    const serviceKeys = [
      "architect",
      "civil_engineer",
      "estate_surveyor_valuer",
      "hospitality",
      "land_surveyor",
      "legal_practitioner",
      "quantity_surveyor",
      "realtor",
      "town_planner",
    ];
    return Object.entries(services || {})
      .filter(([key, value]) => serviceKeys.includes(key) && value !== null)
      .map(([key]) => key.replace(/_/g, " "));
  };

  const companyStats = [
    { label: "Joined ourproperty.ng", value: join_ourproperty || "--- ---" },
    {
      label: "Years in Industry",
      value: calculateYearsInIndustry(details?.date_of_registration) ?? "__,__,__",
    },
    { label: "Total Branch", value: total_branch || 0 },
    { label: "Total Staff", value: total_staff || 0 },
    {
      label: "Property for sale",
      value: details?.property_for_sale || 0,
    },
    {
      label: "Property for Rent",
      value: details?.property_for_rent || 0,
    },
    {
      label: "Hospitality Property",
      value: details?.hospitality_property,
    },
    { label: "Total Unit Managing", value: total_unit || 0 },
    { label: "Total Reviews", value: total_review || 0 },
    {
      label: "Completed Transaction",
      value: details?.completed_transaction || 0,
    },
  ];

  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Company Summary
      </h2>

      {/* Logo and Name */}
      <div className="mt-4 flex flex-col items-center">
        <div className="h-[70px] w-[260px] rounded-lg border border-brand-9 p-2">
          <Image
            src={company_logo || empty}
            alt="Company Logo"
            width={500}
            height={500}
            className="h-full w-full object-contain"
          />
        </div>
        <h3 className="mt-2 text-xl font-bold text-black dark:text-white">
          {name || "--- ---"}
        </h3>
      </div>

      {/* Services */}
      <div className="mt-4">
        <p className="text-sm font-medium text-black dark:text-white">
          Services
        </p>
        <p className="text-sm text-text-disabled capitalize">
          {getAvailableServices(services).join(", ") || "--- ---"}
        </p>
      </div>

      {/* Contact Details */}
      <div className="mt-4">
        <p className="text-sm font-medium text-black dark:text-white">
          Contacts
        </p>
        <div className="mt-2 flex flex-col gap-2 text-sm text-text-disabled">
          <div className="flex items-center gap-2">
            <MapIcon />
            <span>{addresses?.head_office_address || "--- ---"}</span>
          </div>
          <div className="flex items-center gap-2">
            <WebsiteIcon />
            <span>{social_handles?.website || "--- ---"}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon />
            <span>
              {Array.isArray(contact_details) && contact_details.length > 0
                ? contact_details[0].phone_number
                : "--- ---"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail />
            <span>{email || "--- ---"}</span>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="mt-4 flex gap-2">
        <div className="rounded-full border border-black p-2 dark:border-white">
          <FbIcon />
        </div>
        <div className="rounded-full border border-black p-2 dark:border-white">
          <TwitterIcon />
        </div>
        <div className="rounded-full border border-black p-2 dark:border-white">
          <InstagramIcon />
        </div>
        <div className="rounded-full border border-black p-2 dark:border-white">
          <SocialWebIcon />
        </div>
      </div>

      {/* Company Stats */}
      <div className="mt-4">
        {companyStats.map((stat, index) => (
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
