import KeyValueList from "@/components/KeyValueList/key-value-list";

const Details = () => {
  return (
    <div
      className="rounded-[8px] bg-white px-4 py-6 space-y-[10px]"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h1 className="font-bold text-xl text-[#092C4C]">Details</h1>
      <div className="h-[2px] w-3/4 bg-[#C0C2C8] bg-opacity-20" />
      <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
        <KeyValueList
          data={{}}
          chunkSize={1}
          referenceObject={{
            "Property Id": "1234567894",
            "Property Name": "Olayomi Cottage",
            "Account Officer": "Mr Taiwo Salam",
          }}
        />
      </div>
    </div>
  );
};

export default Details;
