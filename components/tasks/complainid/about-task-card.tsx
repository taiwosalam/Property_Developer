"use client";
import { ChevronLeft } from "@/public/icons/icons";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { useState } from "react";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import BackButton from "@/components/BackButton/back-button";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { getBadgeColor } from "@/lib/utils";

export interface AboutTaskCardProps {
  description?: string;
  tier_id?: number;
  aboutCard?: {
    label: string;
    value: string | null;
  }[];
}
const AboutTaskCard = ({ description, aboutCard, tier_id }: AboutTaskCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <BackButton textClassName="text-base lg:text-base">
          About Complaint
        </BackButton>
        <button
          type="button"
          onClick={toggleVisibility}
          className="flex items-center gap-2 text-text-label text-sm font-medium"
        >
          <p>{isVisible ? "Hide Complaints" : "Show Complaints"}</p>
          <div
            className={clsx(
              isVisible ? "-rotate-90" : "rotate-90",
              "transition-transform"
            )}
          >
            <ChevronLeft fill="#5A5D61" />
          </div>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            key="about-complaint"
            className="bg-white dark:bg-darkText-primary p-6 rounded-lg"
            style={{
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <div className="grid grid-cols-4 gap-4">
              {aboutCard?.map((detail, index) => (
                <DetailItem
                  key={index}
                  label={detail.label}
                  value={detail.value ?? "___ ___"}
                  tier_id={tier_id}

                />
              ))}
            </div>
            <div className="my-2">
              <p className="text-[16px] font-medium text-text-tertiary dark:text-darkText-1">
                Description:
              </p>
              <TruncatedText
                className="text-sm text-[16px] font-normal text-text-secondary dark:text-darkText-2"
                lines={3}
              >
                {description ? description : "___ ___"}
              </TruncatedText>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutTaskCard;

const DetailItem = ({
  label,
  value,
  tier_id,
}: {
  label: string;
  value: string | number;
  tier_id?: number;
}) => (
  <div className="w-full">
    <p className="text-[16px] font-medium text-text-tertiary dark:text-white">
      {label}:
    </p>
    <div className="flex items-center">
      <p className="text-sm text-[16px] font-normal  text-text-secondary dark:text-darkText-1 capitalize">
        {typeof value === "string" ? value.toLowerCase() : value}
      </p>
      {label === "Complainant" ? (
        <BadgeIcon color={getBadgeColor(tier_id) || "gray"} />
      ) : (
        ""
      )}
    </div>
  </div>
);

const details = [
  {
    label: "Complaints sent by:",
    value: "Muibi Saheed",
  },
  {
    label: "Complaints ID:",
    value: "123456",
  },
  {
    label: "Complaints ID:",
    value: "123456",
  },
  {
    label: "Property Name:",
    value: "Lekki Gardens",
  },
  {
    label: "Property Address:",
    value: "Lekki Gardens",
  },
  {
    label: "Account Officer:",
    value: "Muibi Saheed",
  },
];
