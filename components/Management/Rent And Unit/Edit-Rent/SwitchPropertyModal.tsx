"use client";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import FormModalPreset from "../../landlord-tenant-modal-preset";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import { toast } from "sonner";

const SwitchPropertyModal: React.FC<{
  isRental: boolean;
  propertyId: number;
}> = ({ isRental, propertyId }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "form">("warning");
  const [selectedProperty, setPropertySelected] = useState("");

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  // Property options without current tenant property for the select input
  const propertyOptions =
    propertyData?.data
      .filter((p) => p.id !== propertyId)
      .map((p) => ({
        value: p.id,
        label: p.title,
      })) || [];

  const handleContinue = () => {
    if (!selectedProperty) return toast.warning("Please select a property");
    router.push(
      `/management/rent-unit/${id}/edit-rent/change-property?type=${propertyType}&p=${selectedProperty}`
    );
  };

  if (modalView === "warning") {
    return (
      <ModalPreset type="warning">
        <div className="flex flex-col gap-10">
          <p className="text-text-tertiary text-[14px]">
            Are you sure you want to proceed with moving the{" "}
            {isRental ? "tenant's" : "occupant's"} records from the current unit
            to another unit of another property?
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setModalView("form")}>OK</Button>
            <ModalTrigger asChild close>
              <Button variant="blank" className="text-brand-9">
                Back
              </Button>
            </ModalTrigger>
          </div>
        </div>
      </ModalPreset>
    );
  }

  if (modalView === "form") {
    return (
      <FormModalPreset
        heading={`Add ${isRental ? "Property" : "Facility"}`}
        back={{ handleBack: () => setModalView("warning") }}
        style={{ maxWidth: "600px", height: "400px" }}
      >
        <div className="space-y-5 max-w-[300px] mx-auto mt-5">
          <Select
            id=""
            label={`Choose ${isRental ? "Property" : "Facility"}`}
            options={propertyOptions}
            onChange={setPropertySelected}
            placeholder={
              propertyLoading
                ? "Loading properties..."
                : propertyError
                ? "Error loading properties"
                : "Select property"
            }
            error={propertyError}
            disabled={propertyLoading}
          />
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={handleContinue}
              className="py-2 px-8"
              size="base_medium"
            >
              Add
            </Button>
          </div>
        </div>
      </FormModalPreset>
    );
  }

  return null;
};

export default SwitchPropertyModal;
