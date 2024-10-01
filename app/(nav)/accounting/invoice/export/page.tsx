import React from "react";
import Image from "next/image";

// Images
import Signature from "@/public/accounting/signature.svg";

import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingLogoContactHeader from "@/components/Accounting/accounting-logo-contact-header";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";

const ExportInvoice = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <AccountingLogoContactHeader />
        <div className="rounded-lg bg-white p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "customer name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <h1 className="text-black text-2xl font-medium text-center">Summary</h1>
        <AutoResizingGrid gap={6} minWidth={330}>
          <InvoiceStatCards
            title="Total Receipts Created"
            balance={12345432}
            upvalue={53}
          />
          <InvoiceStatCards
            title="Total Paid Receipts"
            balance={12345432}
            downValue={53}
          />
          <InvoiceStatCards
            title="Total Pending Receipts"
            balance={12345432}
            downValue={53}
          />
        </AutoResizingGrid>
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>date</th>
                <th>landlord / landlady</th>
                <th>payment ID</th>
                <th>amount</th>
                <th>description</th>
                <th>mode</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Picture
                        src={Avatar}
                        alt="profile picture"
                        size={40}
                        rounded
                      />
                    </td>
                    <td>
                      <p>02/03/2024</p>
                    </td>
                    <td>
                      <p>Amori Ademakinwa</p>
                    </td>
                    <td>
                      <p>1234567878</p>
                    </td>
                    <td>
                      <p>₦115,000.00</p>
                    </td>
                    <td>
                      <p>Property Rent for moniya house</p>
                    </td>
                    <td>
                      <p>Bank Transfer</p>
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
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button variant="sky_blue" size="base_bold" className="py-2 px-8">
          back
        </Button>
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_bold" className="py-2 px-8">
            download
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportInvoice;
