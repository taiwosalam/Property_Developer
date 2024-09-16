"use client";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { RenewalRentDetails } from "@/components/Management/Rent And Unit/renewal-rent-detals";
import { ChevronLeft } from "@/public/icons/icons";

const RenewRent = () => {
  return (
    <main className="space-y-6 p-4">
      <div className="flex items-center space-x-3">
        <ChevronLeft />
        <h6 className="text-2xl font-medium">Renew Rent</h6>
      </div>
      <section className="space-y-6 pb-16">
        <EstateDetails title="Unit Details" />
        <EstateSettings title="Property Settings" />
        <RenewalRentDetails />
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
          Renew Rent
        </button>
      </div>
    </main>
  );
};

export default RenewRent;
