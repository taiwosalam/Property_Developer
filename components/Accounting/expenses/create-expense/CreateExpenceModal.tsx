import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateExpenseModal = () => {
  const router = useRouter();
  const [selectedPropertyId, setSelectedPropertyId] = useState('')

  const {
    data: propertyData,
    error: propertiesError,
    loading: propertiesLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: p.id,
      label: p.title,
    })) || [];

  return (
    <LandlordTenantModalPreset
      heading="Create Expenses"
      style={{ maxWidth: "600px", height: "400px" }}
    >
      <div className="space-y-5 max-w-[300px] mx-auto mt-5">
        <Select
          id="property"
          label={`Choose Property`}
          onChange={setSelectedPropertyId}
          options={propertyOptions}
          disabled={propertiesLoading}
          placeholder={
            propertiesLoading
              ? 'Loading properties...'
              : propertiesError
                ? 'Error loading properties'
                : 'Select property'
          }
          error={propertiesError}
        />
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={() => {
              router.push(`/accounting/expenses/create-expenses?p=${selectedPropertyId}`);
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

export default CreateExpenseModal;
