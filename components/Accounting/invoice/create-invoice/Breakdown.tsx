import { formatFee } from "@/app/(nav)/management/rent-unit/data";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { formatNumber } from "@/utils/number-formatter";

const Breakdown = ({ data }: { data?: any }) => {
  const CURRENCY = data.currency;
  const UNIT_ID = data.unit_id;
  const Total = UNIT_ID
    ? Number(data?.total_package)
    : Number(data.total_amount);
  return (
    <section className="bg-white dark:bg-darkText-primary p-8 space-y-4">
      <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
        {UNIT_ID ? (
          <KeyValueList
            chunkSize={1}
            data={{
              "annual fee": formatFee(data?.annual_fee, CURRENCY),
              "service charge": formatFee(data?.service_charge, CURRENCY),
              "caution fee": formatFee(data?.caution_fee, CURRENCY),
              "inspection fee": formatFee(data?.inspection_fee, CURRENCY),
              "agency fee": formatFee(data?.agency_fee, CURRENCY),
            }}
            direction="column"
            referenceObject={{
              "annual fee": "",
              "service charge": "",
              "caution fee": "",
              "inspection fee": "",
              "agency fee": "",
            }}
          />
        ) : (
          <div className="custom-flex-col gap-2">
          <p className="font-semibold text-lg"> Description </p>
          <TruncatedText>
            <div dangerouslySetInnerHTML={{ __html: data.details }} />
          </TruncatedText>
          </div>
        )}
      </div>
      <SectionSeparator />
      <div className="space-y-2">
        <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
          Total
        </p>
        <p className="font-bold text-xl text-brand-9">
          {formatFee(Total, CURRENCY)}
        </p>
      </div>
    </section>
  );
};

export default Breakdown;
