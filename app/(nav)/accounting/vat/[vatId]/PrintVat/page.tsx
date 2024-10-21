"use client";

import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import Image from "next/image";
import Signature from "@/public/accounting/signature.svg";
import { useRouter } from "next/navigation";

const PrintVatPage = () => {
  const router = useRouter();
  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <h1 className="text-center my-7 font-medium text-2xl">VAT</h1>
        <div className="rounded-lg bg-white p-8 flex flex-col">
          <KeyValueList
            data={{
              "property status": "successful",
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "Vat id": "",
              "Payer name": "",
              "property status": "",
              "date and time": "",
              description: "",
            }}
          />
        </div>
        <AccountingTitleSection title="Payment Details">
          <div className="h-[2px] w-full max-w-[670px] bg-[#C0C2C8]" />
          <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
            <table className="dash-table">
              <colgroup>
                <col className="w-[72px]" />
                <col className="w-[62px]" />
              </colgroup>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Payment Date</th>
                  <th>VAT Paid</th>
                  <th>Details</th>
                  <th>Start Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {Array(2)
                  .fill(null)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1} </td>
                      <td>
                        <p>12/01/2023</p>
                      </td>
                      <td>
                        <p>₦115,000.00</p>
                      </td>
                      <td>
                        <p>Document Fee</p>
                      </td>
                      <td>
                        <p className="text-status-success-3">-- -- -- --</p>
                      </td>
                      <td>
                        <p>-- -- -- --</p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Account Details">
          <div className="p-6 bg-white rounded-lg space-y-5">
            <div className="flex flex-col">
              <KeyValueList
                data={{
                  "Account Number": "1234567879",
                  "Account Name": "John Doe & Co Estate surveyors",
                  "Bank Name": "Info Bank",
                }}
                chunkSize={1}
                direction="column"
                referenceObject={{
                  "Account Number": "",
                  "Account Name": "",
                  "Bank Name": "",
                }}
              />
            </div>
          </div>
        </AccountingTitleSection>
        <div className="flex justify-end">
          <div className="custom-flex-col gap-2 text-text-quaternary text-base font-medium">
            <p>Authorized Signature </p>
            <div className="flex">
              <Image src={Signature} alt="signature" height={60} />
            </div>
            <p>
              ESQ John Doe
              <br />
              Legal Practitioner
            </p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button
          variant="sky_blue"
          size="base_medium"
          className="py-2 px-8"
          onClick={() => router.back()}
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
      </div>
    </div>
  );
};

export default PrintVatPage;
