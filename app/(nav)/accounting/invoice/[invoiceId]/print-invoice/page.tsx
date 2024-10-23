"use client";

import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Signature from "@/public/accounting/signature.svg";
import Image from "next/image";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";
import { useRouter } from "next/navigation";

const PreviewExpenses = () => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <h1 className="text-center my-7 font-medium text-2xl">Invoice</h1>
        <div className="rounded-lg bg-white p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "Customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D]">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="p-6 rounded-lg space-y-5">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{}}
                chunkSize={2}
                direction="column"
                referenceObject={{
                  "Annual fee": "",
                  "non refundable agency fee": "",
                  "service charge": "",
                  "non refundable legal fee": "",
                  "refundable caution fee": "",
                }}
              />
            </div>
            <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total package</p>
              <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Account Details">
          <div className="p-6 rounded-lg bg-white">
            <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
              <KeyValueList
                data={{}}
                chunkSize={1}
                direction="column"
                referenceObject={{
                  "account number": "",
                  "account name": "",
                  "bank name": "",
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="custom-flex-col gap-2 text-text-quaternary text-base font-medium">
              <p>Authorized Signature </p>
              <div className="flex">
                <Image src={Signature} alt="signature" height={60} />
              </div>
              <p>
                ESQ Taiwo Salam
                <br />
                Legal Practitioner
              </p>
            </div>
          </div>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex gap-6 items-center justify-between">
        <Button
          onClick={back}
          variant="sky_blue"
          size="base_medium"
          className="py-2 px-8"
        >
          back
        </Button>
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
            download
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            print
          </Button>
        </div>
      </FixedFooter>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end"></div>
    </div>
  );
};

export default PreviewExpenses;
