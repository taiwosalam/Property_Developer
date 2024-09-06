import Image from "next/image";

// Images
import Button from "../Form/Button/button";
import ImportCircle from "@/public/icons/import-circle.svg";

interface AddMultipleLandlordsOrTenantsProps {
  type: "landlord" | "tenant";
  submitAction: () => void;
}

const AddMultipleLandlordsOrTenants: React.FC<
  AddMultipleLandlordsOrTenantsProps
> = ({ type, submitAction }) => {
  return (
    <>
      <div className="flex justify-center">
        <div className="border-4 border-dotted border-black py-12 px-28">
          <div className="flex justify-center">
            <Image src={ImportCircle} alt="import" width={120} height={120} />
          </div>
          <div className="custom-flex-col gap-[10px] text-center">
            <p className="text-2xl font-bold">Import XLS or CSV file</p>
            <p className="text-[#6C6D6D] text-[10px] font-medium">
              Please click to select a file or drag it into the designated area
              to upload.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-sm font-normal">
          How it works:{" "}
          <span className="text-brand-9 font-bold">Download the Template</span>,
          enter list of your {type === "landlord" ? "landlords/landladies" : "tenants/occupants"}{" "}
          details, and then upload it to proceed.
        </p>
        <Button
          type="button"
          onClick={submitAction}
          size="base_medium"
          className="py-2 px-8"
        >
          choose
        </Button>
      </div>
    </>
  );
};

export default AddMultipleLandlordsOrTenants;
