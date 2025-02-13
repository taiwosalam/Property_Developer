import KeyValueList from "@/components/KeyValueList/key-value-list";
interface DetailsProps {
  property_id?: string;
  property_name?: string;
  account_officer?: string;
}

const Details: React.FC<DetailsProps> = ({ property_id, property_name, account_officer }) => {
  return (
    <div
      className="rounded-[8px] bg-white dark:bg-darkText-primary px-4 py-6 space-y-[10px]"
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
    >
      <h1 className="font-bold text-xl text-[#092C4C] dark:text-white">
        Details
      </h1>
      <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20" />
      <div className="flex gap-6 lg:gap-0 flex-col lg:flex-row">
        <KeyValueList
          data={{
            "Property Id": property_id,
            "Property Name": property_name,
            "Account Officer": account_officer,
          }}
          chunkSize={1}
          referenceObject={{
            "Property Id": property_id,
            "Property Name": property_name,
            "Account Officer": account_officer,
          }}
        />
      </div>
    </div>
  );
};

export default Details;
