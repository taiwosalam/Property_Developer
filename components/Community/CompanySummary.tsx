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
import { CompanySummarySkeleton, TextSkeleton } from "@/app/(nav)/tasks/agent-community/components";
import { empty } from "@/app/config";
import { calculateYearsInIndustry } from "@/app/(nav)/tasks/agent-community/data";

const CompanySummary = ({ loading, companySummary }: { loading?: boolean, companySummary?: any }) => {
  
 const companyStats = [
    { label: "Joined ourproperty.ng", value: companySummary?.join_ourproperty },
    { label: "Years in Industry", value: calculateYearsInIndustry(companySummary?.details?.date_of_registration) },
    { label: "Total Branch", value: companySummary?.total_branch },
    { label: "Total Staff", value: companySummary?.total_staff },
    { label: "Property for sale", value: companySummary?.property_for_sale },
    { label: "Property for Rent", value: companySummary?.property_for_rent },
    { label: "Hospitality Property", value: companySummary?.hospitality_property },
    { label: "Total Unit Managing", value: companySummary?.total_unit },
    { label: "Total Reviews", value: companySummary?.total_review },
    { label: "Completed Transaction", value: companySummary?.completed_transaction },
  ];

  if (loading) {
    return <CompanySummarySkeleton />;
  }

  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Company Summary
      </h2>
      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex items-center justify-center w-[260px] h-[70px] border border-brand-9 py-2 rounded-lg">
          <Image
            src={companySummary?.logo || empty}
            alt="company logo"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="details mt-3">
        <h3 className="text-black leading-50 font-bold text-6 dark:text-white">
          {companySummary?.name || <TextSkeleton />}
        </h3>
        <div className="service flex flex-col gap-1 mt-1">
          <p> Services </p>
          <p className="text-sm text-text-disabled">
            {companySummary?.services || <TextSkeleton />}
          </p>
        </div>
        <div className="contacts-details flex flex-col gap-3 mt-4">
          <p> Contacts </p>
          <div className="flex gap-2 text-sm text-text-disabled">
            <MapIcon />
            <span> {companySummary?.addresses?.head_office_address || <TextSkeleton />} </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <WebsiteIcon />
            <span> {companySummary?.website || <TextSkeleton />} </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <PhoneIcon />
            <span> {companySummary?.contact_details?.[0]?.phone_number || <TextSkeleton />} </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <Mail />
            <span> {companySummary?.email || <TextSkeleton />} </span>
          </div>
        </div>
      </div>
      <div className="socials flex gap-2 mt-4">
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <FbIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white   w-fit">
          <TwitterIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <InstagramIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <SocialWebIcon />
        </div>
      </div>

      {/* Joined */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col gap-2 mt-4">
          {companyStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <p className="text-sm text-text-label">{stat.label}</p>
              <p className="text-sm text-text-primary dark:text-white">
                {stat.value === 0 ? '0' : (stat.value || <TextSkeleton />)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySummary;