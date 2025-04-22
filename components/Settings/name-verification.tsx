"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import WalletModalPreset from "../Wallet/wallet-modal-preset";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";

interface NameVerificationProps {
  fullName: string;
}
const NameVerification = ({ fullName }: NameVerificationProps) => {

    console.log(fullName);
  return (
    <>
      <WalletModalPreset title="Verify your identity">
        <div className="">
          <div className="p-[18px] rounded-2xl bg-neutral-2">
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <p className="font-bold text-lg text-black">{fullName}</p>
                <BadgeIcon color={"gray"} />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <p className="pb-2 border-b-2 border-dotted border-slate-400 text-black">
                Get a verified badge and build trust with clients and
                colleagues.
              </p>

              <p className="text-slate-500">
                We use your Bank Verification Number (BVN) to confirm your
                identity, prevent fraud, and comply with Know Your Customer
                (KYC) and Anti-Money Laundering (AML) regulations set by the
                Central Bank of Nigeria (CBN).
              </p>
            </div>
          </div>

          <div className="bg-neutral-2 rounded-2xl flex flex-col gap-2 mt-4 px-6 py-4">
            <p className="pb-2 text-slate-500">
              Your BVN is used solely as a unique identifier for verification
              purposes. It is collected with your consent and handled securely,
              in full compliance with data privacy laws. We do not store or use
              your BVN for any other purpose.
            </p>

            <div className="">
              <Input
                id="bvn"
                label="Initiate BVN"
                placeholder="Enter your BVN"
                className="rounded-[8px] "
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-500/70 dark:hover:bg-blue-500/70 text-white mt-5 py-2 h-9">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </WalletModalPreset>
    </>
  );
};

export default NameVerification;
