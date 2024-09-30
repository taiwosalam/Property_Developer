import KeyValueList from "@/components/KeyValueList/key-value-list";

const Breakdown = () => {
  return (
    <section className="bg-white p-8 space-y-4">
      <div className="flex">
        <KeyValueList
          chunkSize={2}
          data={{}}
          referenceObject={{
            "annual fee": "",
            "service charge": "",
            "refundable caution fee": "",
            "unit fee": "",
          }}
        />
      </div>
      <div className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20" />
      <div>
        <p className="font-medium text-[16px] text-text-tertiary">
          Total Package
        </p>
        <p className="font-bold text-xl text-[#315EE7]">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          })
            .format(1000000)
            .split(".")}
        </p>
      </div>
    </section>
  );
};

export default Breakdown;
