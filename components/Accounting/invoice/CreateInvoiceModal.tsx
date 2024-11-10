import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { useRouter } from "next/navigation";

const CreateInvoiceModal = () => {
  const router = useRouter();
  return (
    <LandlordTenantModalPreset
      heading="Add Property"
      style={{ maxWidth: "600px", height: "400px" }}
    >
      <div className="space-y-5 max-w-[300px] mx-auto mt-5">
        <Select
          id=""
          label={`Choose Property`}
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
            { value: "3", label: "Option 3" },
          ]}
        />
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={() => {
              router.push(`/accounting/invoice/create-invoice`);
            }}
            className="py-2 px-8"
            size="base_medium"
          >
            Add
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateInvoiceModal;
