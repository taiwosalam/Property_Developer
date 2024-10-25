"use client";

import React from "react";
import Image from "next/image";

// Images
import Signature from "@/public/accounting/signature.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useRouter } from "next/navigation";

const Exportexpense = () => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={1}
            direction="column"
            referenceObject={{
              "summary id": "",
              "start date": "",
              "end date": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black text-2xl font-medium text-center">
          Receipt Summary
        </h1>
        <AutoResizingGrid minWidth={330}>
          <InvoiceStatCards
            title="Total Amount"
            balance={12345432}
            downValue={53}
          />
          <InvoiceStatCards
            title="Total Credit"
            balance={12345432}
            upvalue={53}
          />
          <InvoiceStatCards
            title="Total Debit"
            balance={12345432}
            downValue={53}
          />
        </AutoResizingGrid>
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="min-w-[72px]" />
              <col span={5} />
              <col className="min-w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>payment ID</th>
                <th>details</th>
                <th>amount</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody>
              {Array(10)
                .fill(null)
                .map((_, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      (window.location.href = "/accounting/receipts/1/preview")
                    }
                    className="cursor-pointer"
                  >
                    <td>
                      <Picture
                        src={"/empty/avatar-1.svg"}
                        alt="profile picture"
                        rounded
                        size={40}
                      />
                    </td>
                    <td>
                      <p>Amori Ademakinwa</p>
                    </td>
                    <td>
                      <p>1234563456</p>
                    </td>
                    <td>
                      <p>Rent cost: Start date: Sept 22, 2023 - Expiry date:</p>
                    </td>
                    <td>
                      <p>₦35,000.00</p>
                    </td>
                    <td>
                      <p>02/03/2024</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
      </div>
      <FixedFooter className="flex gap-6 flex-wrap items-center justify-end">
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_bold" className="py-2 px-8">
            download
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            print
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default Exportexpense;
