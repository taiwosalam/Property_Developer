"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import WalletModalPreset from "../Wallet/wallet-modal-preset";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "../Form/Input/input";
import { EmailIcon, PhoneIcon } from "./verification_icons";
import { Mail, RotateCw } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";

interface NameVerificationProps {
  fullName: string;
}
export const NameVerification = ({ fullName }: NameVerificationProps) => {
  const [isNameVerificationOpen, setIsNameVerificationOpen] = useState(true);
  const [isVerificationMethodOpen, setIsVerificationMethodOpen] =
    useState(false);

  const handleOpenVerificationMethod = () => {
    setIsNameVerificationOpen(false); // Close NameVerification modal
    setIsVerificationMethodOpen(true); // Open VerificationMethod modal
  };
  return (
    <>
      <WalletModalPreset title="Verify your identity" headerClassName="text-xl">
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
              <Modal>
                <ModalTrigger>
                  <Button className="bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-500/70 dark:hover:bg-blue-500/70 text-white mt-5 py-2 h-9">
                    Confirm
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <VerificationMethod />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
      </WalletModalPreset>
    </>
  );
};

const VERIFICATION_METHOD = [
  {
    icon: EmailIcon,
    title: "Email",
    description:
      "Selecting this option will send a verification code to the email linked to your BVN",
  },
  {
    icon: PhoneIcon,
    title: "Primary Number",
    description:
      "Selecting this option will send a verification code to the phone number linked to your BVN",
  },
  {
    icon: PhoneIcon,
    title: "Secondary Number",
    description:
      "Selecting this option will send a verification code to the second phone number linked to your BVN",
  },
  {
    icon: PhoneIcon,
    title: "Alternative Number",
    description:
      "If you can't remember the details linked to your BVN, use alternative number instead",
  },
];

export const VerificationMethod = () => {
  return (
    <>
      <WalletModalPreset title="Verify your BVN" headerClassName="text-xl">
        <div className="">
          {VERIFICATION_METHOD.map((method, index) => {
            return (
              <div
                className="p-[18px] rounded-2xl bg-neutral-2 mt-4 mb-4 cursor-pointer"
                key={index}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div>
                      <method.icon />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{method.title}</h2>
                      <p className="pr-3">{method.description}</p>
                    </div>
                  </div>

                  <div>
                    <Modal>
                      <ModalTrigger>
                        <Button className="h-5 py-4 bg-blue-800 hover:bg-blue-800/80">
                          Proceed
                        </Button>
                      </ModalTrigger>
                      <ModalContent>
                        <InputPinDialog />
                        {/* <AlternateMethod /> */}
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </WalletModalPreset>
    </>
  );
};

export const InputPinDialog = () => {
  return (
    <>
      <WalletModalPreset
        title="Input Pin"
        className="!rounded-[2rem] pb-6 w-[500px] max-h-[90%] "
        headerClassName="py-6 text-xl"
      >
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <p className="text-center text-gray-500">
              An OPT has been sent to your phone number
            </p>
            <p className="text-gray-500">
              ({<span className="text-blue-400">{"0803***73982"}</span>})
            </p>
            <p className="text-gray-500">for confirmation</p>

            <div className="flex flex-col justify-center items-center py-6">
              <div className="flex gap-3 justify-center items-center mt-10">
                <Input
                  id="first"
                  className="w-12 rounded-2xl"
                  inputClassName="rounded-[.6rem] text-[1.3rem] text-center text-blue-700 font-bold"
                  min={1}
                  max={1}
                  type="number"
                />
                <Input
                  id="second"
                  className="w-12 rounded-2xl"
                  inputClassName="rounded-[.6rem] text-[1.3rem] text-center text-blue-700 font-bold"
                  min={1}
                  max={1}
                  type="number"
                />
                <Input
                  id="third"
                  className="w-12 rounded-2xl"
                  inputClassName="rounded-[.6rem] text-[1.3rem] text-center text-blue-700 font-bold"
                  min={1}
                  max={1}
                  type="number"
                />
                <Input
                  id="fourth"
                  className="w-12 rounded-2xl"
                  inputClassName="rounded-[.6rem] text-[1.3rem] text-center text-blue-700 font-bold"
                  min={1}
                  max={1}
                  type="number"
                />
              </div>
              <Button className="bg-transparent mt-2 flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent">
                Change options
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <RotateCw className="text-blue-700" />
              <p className="text-blue-400">{"Resend code (40s)"}</p>
            </div>

            <Button className="w-full mt-8 py-4 bg-blue-800 hover:bg-blue-800/80">
              Proceed
            </Button>
          </div>
        </div>
      </WalletModalPreset>
    </>
  );
};

export const AlternateMethod = () => {
  return (
    <>
      <WalletModalPreset
        title="Alternative Number"
        className="!rounded-[2rem] pb-6 w-[500px] max-h-[90%] "
        headerClassName="py-6 text-xl"
      >
        <div className="">
          <div className="flex flex-col justify-center items-center space-y-6">
            <p className="text-center text-gray-500 max-w-2xl py-2">
              Enter your alternative phone number to receive an OTP for BVN
              verification
            </p>

            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex gap-3 justify-center flex-col items-center mt-10 w-full mb-10">
                <Input
                  id="first"
                  placeholder="Input your phone number"
                  inputClassName="py-4"
                  className="w-[80%] text-lg py-2"
                  min={1}
                  max={1}
                  type="number"
                />
                <Button className="bg-transparent flex justify-center items-center font-semibold text-center py-4 text-lg text-blue-700 hover:bg-transparent">
                  Change option
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full mt-8 py-4 bg-blue-800 hover:bg-blue-800/80">
              Proceed
            </Button>
          </div>
        </div>
      </WalletModalPreset>
    </>
  );
};
