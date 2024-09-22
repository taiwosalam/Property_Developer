"use client";

import { estateSettingsDta } from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { OccupantProfile } from "@/components/Management/Rent And Unit/occupant-profile";
import { ChevronLeft } from "@/public/icons/icons";
import Link from "next/link";

const StartCounting = () => {
  return (
    <div className="space-y-6 p-4">
      <Link
        href={"/management/rent-unit"}
        className="flex items-center space-x-3 w-fit"
      >
        <ChevronLeft />
        <h6 className="text-2xl font-medium">Start Counting</h6>
      </Link>
      <section className="space-y-6 pb-16">
        <EstateDetails />
        <EstateSettings estateSettingsDta={estateSettingsDta} />
        <OccupantProfile
          occupant={{
            name: "Abimbola Adedeji",
            email: "abimbola@gmail.com",
            avatar: "/empty/avatar-1.svg",
            gender: "Male",
            birthday: "12/12/12",
            religion: "Christianity",
            phone: "+2348132086958",
            maritalStatus: "Single",
            address: "U4 Joke Plaza Bodija Ibadan",
            city: "Ibadan",
            state: "Oyo State",
            lg: "Ibadan North Central",
          }}
          feeDetails={[
            { name: "Annual Fee", amount: 300000 },
            { name: "Security Fee", amount: 300000 },
            { name: "Service Charge", amount: 300000 },
            { name: "Other Charges", amount: 300000 },
          ]}
          onEdit={() => {
            console.log("Edit button clicked");
          }}
        />
      </section>
      <div className="fixed w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
        <button
          type="button"
          className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
          //   onClick={() => {}}
        >
          Exit
        </button>
        <button
          type="submit"
          className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
          //   onClick={() => {}}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default StartCounting;
