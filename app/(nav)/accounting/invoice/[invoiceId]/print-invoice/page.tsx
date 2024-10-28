"use client";

// Imports
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import { useRouter } from "next/navigation";
import Signature from "@/components/Signature/signature";
import ExportPageFooter from "@/components/reports/export-page-footer";

const PreviewExpenses = () => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
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
          <div className="p-6 rounded-lg space-y-5 bg-white">
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
          <Signature />
        </AccountingTitleSection>
      </div>
      <ExportPageFooter />
    </div>
  );
};

export default PreviewExpenses;
