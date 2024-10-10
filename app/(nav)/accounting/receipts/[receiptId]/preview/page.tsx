import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";

const ReceiptPreviewPage = () => {
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
        <h1 className="text-center my-7 font-medium text-2xl">Receipt</h1>
        <div className="rounded-lg bg-white p-8 flex">
          <KeyValueList
            data={{
              "property status": "successful",
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "Payment id": "",
              "client name": "",
              "property status": "",
              "date and time": "",
              description: "",
            }}
          />
        </div>
        <AccountingTitleSection title="Breakdown">
          <div className="p-6 bg-white rounded-lg space-y-5">
            <div className="flex">
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
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
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

export default ReceiptPreviewPage;
