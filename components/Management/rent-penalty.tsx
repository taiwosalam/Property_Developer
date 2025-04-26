"use client";

import { useState } from "react";
import SettingsSection from "@/components/Settings/settings-section";
import { AuthForm } from "@/components/Auth/auth-components";
import Select from "@/components/Form/Select/select";
import { SettingsUpdateButton } from "@/components/Settings/settings-components";
import {
  PERCENTAGE_OPTIONS,
  RENT_PERIODS,
  RentPeriod,
} from "@/app/(nav)/settings/management/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateSettings } from "@/app/(nav)/settings/security/data";
import { toast } from "sonner";
import { Button } from "../ui/button";

// Form data type using mapped type
type RentPenaltyForm = {
  [K in RentPeriod]: string;
};

// Props for RentPenalty component
interface RentPenaltyProps {
  initialValues?: Partial<RentPenaltyForm>;
  onSubmit?: (data: RentPenaltyForm) => Promise<void>;
}

const RentPenalty: React.FC<RentPenaltyProps> = ({
  initialValues = {},
  onSubmit,
}) => {
  // Initialize form state
  const initialFormState: RentPenaltyForm =
    RENT_PERIODS.reduce<RentPenaltyForm>((acc, period) => {
      acc[period.value] = initialValues[period.value] || PERCENTAGE_OPTIONS[0];
      return acc;
    }, {} as RentPenaltyForm);

  const [formData, setFormData] = useState<RentPenaltyForm>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRentPenalty = async (data: Record<string, any>) => {
    console.log("handleUpdateRentPenalty called with data:", data);
    // if (!data || Object.keys(data).length === 0) {
    //   console.error("No data received in handleUpdateRentPenalty");
    //   toast.error("No form data provided");
    //   setIsLoading(false);
    //   return;
    // }
    try {
      setIsLoading(true);
      const formDataPayload = objectToFormData(data);
      console.log("FormData created:", Array.from(formDataPayload.entries()));
      const res = await updateSettings(formDataPayload, "rent_penalty_setting");
      console.log("updateSettings response:", res);
      if (res) {
        toast.success("Rent Penalty updated successfully");
      }
    } catch (err) {
      console.error("Error in handleUpdateRentPenalty:", err);
      toast.error("Unable to update Rent Penalty");
    } finally {
      setIsLoading(false);
    }
  };
  // Handle select change
  const handleChange = (period: RentPeriod, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [period]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Form submitted, formData:", formData);
    console.log("formData keys:", Object.keys(formData));
    console.log("formData values:", Object.values(formData));
    if (!formData || Object.keys(formData).length === 0) {
      console.error("formData is empty or undefined");
      toast.error("Form data is empty");
      return;
    }
    await handleUpdateRentPenalty(formData);
  };

  return (
    <SettingsSection title="Rent Penalty Settings">
      <div className="flex flex-col gap-8">
        <p className="text-sm font-normal text-text-disabled dark:text-darkText-2">
          The tenant is required to make full rent payment on or before the
          expiration of the current rent period. If the tenant is interested in
          renewing the rent but makes payment after the due date, there will be
          a monthly interest charged on the substantive rent until both the rent
          and the accrued interest are fully paid.
        </p>
        <AuthForm onFormSubmit={handleSubmit}>
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {RENT_PERIODS.map((period) => (
              <Select
                key={period.value}
                id={`penalty_${period.value}`}
                label={`${period.label} Interest Charge`}
                desc={period.desc}
                options={period.options}
                value={formData[period.value]}
                onChange={(value) =>
                  handleChange(period.value, value as string)
                }
                inputContainerClassName="bg-neutral-2"
                isSearchable={false}
                aria-label={`Select penalty percentage for ${period.label} period`}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <SettingsUpdateButton
              submit
              loading={isLoading}
              action={handleUpdateRentPenalty as any}
            />
          </div>
        </AuthForm>
      </div>
    </SettingsSection>
  );
};

export default RentPenalty;
