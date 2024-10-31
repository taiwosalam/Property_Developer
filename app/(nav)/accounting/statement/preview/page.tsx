import ExportPageHeader from "@/components/reports/export-page-header";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { empty } from "@/app/config";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import Button from "@/components/Form/Button/button";
import TruncatedText from "@/components/TruncatedText/truncated-text";

const StatementPreviewPage = () => {
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
        <div className="rounded-lg bg-white dark:bg-darkText-primary   p-8 flex flex-col md:flex-row">
          <KeyValueList
            data={{
              "payment id": "12345678",
              "client name": "John Doe",
              " transaction date and time": "25 January 2024 (3:30pm)",
            }}
            chunkSize={1}
            direction="column"
            referenceObject={{
              "payment id": "",
              "client name": "",
              " transaction date and time": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Preview">
          <div className="p-6 bg-white dark:bg-darkText-primary rounded-lg space-y-5">
            <div className="flex flex-col md:flex-row gap-y-6 gap-x-2">
              <div className="flex flex-col md:flex-row md:w-[66%]">
                <KeyValueList
                  data={{
                    amount: "12345678",
                    "Payment Method": "Wallet",
                    "Payment Type": "Credit",
                  }}
                  chunkSize={2}
                  direction="column"
                  referenceObject={{
                    amount: "",
                    "Payment Method": "",
                    "Payment Type": "",
                  }}
                />
              </div>
              <div className="md:flex-1 capitalize custom-flex-col gap-2">
                <p className="text-[#747474] dark:text-darkText-1 text-base font-medium">
                  Description
                </p>
                <TruncatedText className="text-black dark:text-darkText-2 text-sm font-normal">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Accusantium facere aliquam blanditiis, aperiam tempore qui
                  sequi quibusdam perferendis consequatur quia molestias culpa
                  excepturi, reiciendis nobis eum! Adipisci ullam totam cumque!
                </TruncatedText>
              </div>
            </div>
          </div>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex gap-6 items-center justify-end">
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
            download
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            print
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default StatementPreviewPage;
