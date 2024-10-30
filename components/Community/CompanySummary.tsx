import {
  ChevronLeft,
  FbIcon,
  InstagramIcon,
  Mail,
  MapIcon,
  PhoneIcon,
  SocialWebIcon,
  ThumbsDown,
  ThumbsUp,
  TwitterIcon,
  WebsiteIcon,
} from "@/public/icons/icons";
import CompanyLogo from "@/public/empty/company-logo.svg";
import { companyStats } from "@/app/(nav)/tasks/agent-community/data";
import Image from "next/image";

const CompanySummary = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Company Summary
      </h2>
      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex items-center justify-center w-[260px] h-[70px] border border-brand-9 py-2 rounded-lg">
          <Image
            src={CompanyLogo}
            alt="company logo"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="details mt-3">
        <h3 className="text-black leading-50 font-bold text-6 dark:text-white">
          {" "}
          Pat Onukwuli & Co.{" "}
        </h3>
        <div className="service flex flex-col gap-1 mt-1">
          <p> Services </p>
          <p className="text-sm text-text-disabled">
            {" "}
            Sales, Purchase, Rent of Resident Property & Commercial Property{" "}
          </p>
        </div>
        <div className="contacts-details flex flex-col gap-3 mt-4">
          <p> Contacts </p>
          <div className="flex gap-2 text-sm text-text-disabled">
            <MapIcon />
            <span> States and Local Govt. </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <WebsiteIcon />
            <span> https://www.hprealestate.co.in </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <PhoneIcon />
            <span>08132086958 || 09123435487 || 9848848488 </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <Mail />
            <span> emailaddress@gmail.com </span>
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
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySummary;
