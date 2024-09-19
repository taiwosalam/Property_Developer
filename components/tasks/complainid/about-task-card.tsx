"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/public/icons/icons";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import clsx from "clsx";

const AboutTaskCard = () => {
  const router = useRouter();
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <button type="button" className="w-fit" onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <h1 className="text-base font-medium">About Complaints</h1>
        </div>
        <div className="flex items-center space-x-2 text-text-label text-sm font-medium">
          <p>Hide Complaints</p>
          <div className="-rotate-90">
            <ChevronLeft fill="#5A5D61" />
          </div>
        </div>
      </div>
      <div
        className="bg-white p-6 rounded-lg"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {details.map((detail, index) => (
            <DetailItem key={index} label={detail.label} value={detail.value} />
          ))}
        </div>
        <div className="my-2">
          <p className="text-[16px] font-medium text-text-tertiary">
            Description:
          </p>
          <TruncatedText
            className="text-sm text-[16px] font-normal text-text-secondary"
            lines={3}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus
            distinctio quaerat inventore temporibus. Eos adipisci maxime illum
            repellendus minus praesentium harum natus corrupti itaque! Excepturi
            possimus at totam? Tempora, non.
          </TruncatedText>
        </div>
      </div>
    </div>
  );
};

export default AboutTaskCard;

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="w-full">
    <p className="text-[16px] font-medium text-text-tertiary">{label}</p>
    <p
      className={clsx(
        "text-sm text-[16px] font-normal text-text-secondary",
        label === "Complaints sent by:" && "flex items-center"
      )}
    >
      {value}
      {label === "Complaints sent by:" && <BadgeIcon color="green" />}
    </p>
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
