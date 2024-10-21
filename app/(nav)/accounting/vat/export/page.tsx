import React from "react";

// Images
import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Signature from "@/components/Signature/signature";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ExpensesStatCard from "@/components/Accounting/expenses/expenses-stat-card";
import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";

const ExportVat = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white p-8 flex">
          <KeyValueList
            data={{
              "summary id": "123456",
              "start date": "02/03/2024",
              "end date": "02/03/2024",
            }}
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
          VAT Summary
        </h1>
        <AutoResizingGrid gap={24} minWidth={330}>
          <InvoiceStatCards
            title="Total Vat Created"
            balance={12345432}
            upvalue={53}
          />
          <InvoiceStatCards
            title="Total Paid Vat"
            balance={12345432}
            downValue={53}
          />
          <ExpensesStatCard
            title="Total Pending Vat"
            balance={12345432}
            downValue={53}
          />
        </AutoResizingGrid>
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
              <col className="w-[62px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>vat ID</th>
                <th>payment reason</th>
                <th>total vat</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <Picture
                        src={Avatar}
                        alt="profile picture"
                        size={40}
                        rounded
                      />
                    </td>
                    <td>
                      <p>Abimbola Adedeji</p>
                    </td>
                    <td>
                      <p>22132876554444</p>
                    </td>
                    <td>
                      <p>Rent cost: Start date: Sept 22, 2020</p>
                    </td>
                    <td>
                      <p className="text-status-success-3">₦ 100,000</p>
                    </td>
                    <td>
                      <p>12/12/12</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Signature />
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

export default ExportVat;
