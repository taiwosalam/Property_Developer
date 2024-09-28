import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import AccountingLogoContactHeader from "@/components/Accounting/accounting-logo-contact-header";

const PreviewDisbursement = () => {
  return (
    <div className="custom-flex-col gap-10 pb-10">
      <div className="custom-flex-col gap-[18px]">
        <AccountingLogoContactHeader />
        <div className="rounded-lg bg-white p-8 flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "transaction id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Disbursement Details">
          <div className="p-6 flex bg-white rounded-lg">
            <KeyValueList
              data={{
                "amount dusburse": "₦115,000.00",
              }}
              chunkSize={1}
              direction="column"
              referenceObject={{
                "transaction description": "",
                "amount dusburse": "",
              }}
            />
            <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
              <p className="text-[#747474]">total</p>
              <p className="text-brand-primary text-xl font-bold">₦1,950,000</p>
            </div>
          </div>
        </AccountingTitleSection>
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
          exit
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

export default PreviewDisbursement;
