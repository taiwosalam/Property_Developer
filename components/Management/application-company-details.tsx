import React from "react";
import { X, Printer } from "lucide-react";
import TruncatedText from "../TruncatedText/truncated-text";
import Button from "../Form/Button/button";
import Picture from "../Picture/picture";
import Image from "next/image";

interface ICompanyApplicantModal {
  business_logo: string;
  business_description: string;
  business_name: string;
  business_email: string;
  business_address: string;
  business_phone: string;
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  website: string;
}
const CompanyApplicantModal = ({ ...props }: ICompanyApplicantModal) => {
  const {
    business_address,
    business_description,
    business_name,
    business_email,
    business_logo,
    business_phone,
    facebook,
    x,
    instagram,
    youtube,
    tiktok,
    website,
  } = props;
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="">
      {/* Content */}
      <div className="p-6">
        {/* Business Logo and Basic Info */}
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-1/3 relative">
            <Image
              src={business_logo}
              alt="Business logo"
              width={100}
              height={100}
              fill
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 w-full">
            <div className="grid gap-6">
              <div className="flex gap-3 items-center">
                <div className="text-gray-500">Business Name</div>
                <div className="text-gray-800 font-medium">{business_name}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-gray-500">Business Details</div>
                <div className="text-gray-800 font-medium">
                  {"Ajadi Tijani"}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <TruncatedText className="text-gray-700 text-sm leading-relaxed">
                {business_description}
              </TruncatedText>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Business Email</div>
              <div className="text-gray-800 font-medium">{business_email}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Address</div>
              <div className="text-gray-800 font-medium">
                {business_address}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Business Contact</div>
              <div className="text-gray-800 font-medium">{business_phone}</div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Facebook</div>
              <div className="text-gray-800 font-medium lowercase">
                {facebook}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Twitter (X)</div>
              <div className="text-gray-800 font-medium">{x}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Instagram</div>
              <div className="text-gray-800 font-medium">{instagram}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Youtube</div>
              <div className="text-gray-800 font-medium">{youtube}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">TikTok</div>
              <div className="text-gray-800 font-medium">{tiktok}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">Website</div>
              <div className="text-gray-800 font-medium">{website}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end p-6 border-t border-gray-200">
        <Button
          onClick={handlePrint}
          variant="blank"
          className="flex items-center gap-2 px-4 py-2 text-primary-navy dark:text-darkText-1 text-lg"
        >
          <Printer className="w-4 h-4" />
          Print Company Details
        </Button>
      </div>
    </div>
  );
};

export default CompanyApplicantModal;
