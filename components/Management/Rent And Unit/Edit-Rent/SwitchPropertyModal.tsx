"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import FormModalPreset from "../../landlord-tenant-modal-preset";
import useFetch from "@/hooks/useFetch";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import { toast } from "sonner";
import { Currency } from "@/utils/number-formatter";

const SwitchPropertyModal: React.FC<{
  isRental: boolean;
  propertyId: number;
  currency: Currency;
}> = ({ isRental, propertyId, currency }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "form">("warning");
  const [selectedProperty, setPropertySelected] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/rental");

  console.log("property", propertyData);
  console.log("currency", currency);

  // Property options without current tenant property
  const propertyOptions =
    propertyData?.data
      .filter((p) => p.id !== propertyId)
      .map((p) => ({
        value: String(p.id), // Convert to string for select compatibility
        label: p.title,
      })) || [];

  const handleContinue = async () => {
    if (!selectedProperty) {
      toast.warning("Please select a property");
      return;
    }
    // Find the selected property's details
    const selectedPropertyData = propertyData?.data.find(
      (p) => String(p.id) === selectedProperty
    );
    if (!selectedPropertyData) {
      toast.error("Selected property not found");
      return;
    }
    // Check if the selected property's currency matches the provided currency
    if (selectedPropertyData.currency !== currency) {
      toast.warning(
        `The selected property's currency (${selectedPropertyData.currency}) does not match the current unit's currency (${currency}). Please choose a property with a matching currency.`
      );
      return;
    }

    setLoading(true);
    try {
      // Simulate async operation (e.g., API call or validation)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay
      router.push(
        `/management/rent-unit/${id}/edit-rent/change-property?type=${propertyType}&p=${selectedProperty}`
      );
    } catch {
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Button onClick={() => setModalView("form")}>Proceed</Button>
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
        style={{ maxWidth: "600px", height: "400px", overflow: "visible" }}
      >
        <div className="space-y-5 max-w-[300px] mx-auto mt-5 relative z-[1000]">
          <Select
            id="property-select"
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
            disabled={propertyLoading || loading}
          />
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={handleContinue}
              className="py-2 px-8"
              size="base_medium"
              disabled={loading}
              aria-disabled={loading}
              aria-label={loading ? "Processing" : "Add property"}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Please wait...
                </span>
              ) : (
                "Proceed"
              )}
            </Button>
          </div>
        </div>
      </FormModalPreset>
    );
  }

  return null;
};

export default SwitchPropertyModal;
