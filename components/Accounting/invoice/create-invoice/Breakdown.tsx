import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { formatNumber } from "@/utils/number-formatter";

const Breakdown = ({data} : {data?:any}) => {
  return (
    <section className="bg-white dark:bg-darkText-primary p-8 space-y-4">
      <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
        <KeyValueList
          chunkSize={1}
          data={{
            "annual fee": formatNumber(data.annual_fee),
            "service charge": formatNumber(data.service_charge),
            "refundable caution fee": formatNumber(data.caution_fee)
          }}
          direction="column"
          referenceObject={{
            "annual fee": "",
            "service charge": "",
            "refundable caution fee": "",
          }}
        />
      </div>
      <SectionSeparator />
      <div className="space-y-2">
        <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
          Total Package
        </p>
        <p className="font-bold text-xl text-brand-9">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          })
            .format(Number(data.total_package))
            .split(".")}
        </p>
      </div>
    </section>
  );
};

export default Breakdown;
