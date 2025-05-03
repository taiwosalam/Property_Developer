"use client";

import { useEffect, useState } from "react";
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
import {
  updateRentPenaltySettings,
  updateSettings,
} from "@/app/(nav)/settings/security/data";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { RentPenaltySettings } from "@/app/(nav)/settings/management/types";
import useFetch from "@/hooks/useFetch";
import { CompanySettingsResponse } from "@/app/(nav)/settings/others/types";

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
  // Handle select change
  const handleChange = (period: RentPeriod, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [period]: value,
    }));
  };

  const { data: rentPenalty } =
    useFetch<CompanySettingsResponse>("/company/settings/");

  useEffect(() => {
    if (rentPenalty?.data?.rent_penalty_setting) {
      const penaltySettings = rentPenalty.data.rent_penalty_setting;
      // Convert numbers to percentage strings
      const formattedSettings = RENT_PERIODS.reduce<RentPenaltyForm>(
        (acc, period) => {
          acc[period.value] = `${penaltySettings[period.value]}%`;
          return acc;
        },
        {} as RentPenaltyForm
      );

      setFormData(formattedSettings);
    }
  }, [rentPenalty]);

  // ...existing code...

  // Add these utility functions at the top of the file
  const convertPercentToNumber = (value: string): number => {
    return Number(value?.replace("%", "")) || 0;
  };

  const createPenaltySettings = (
    formData: RentPenaltyForm
  ): RentPenaltySettings => {
    const periods: (keyof RentPenaltySettings)[] = [
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "yearly",
      "biennially",
      "triennially",
      "quadrennial",
      "quinquennial",
      "sexennial",
      "septennial",
      "octennial",
      "nonennial",
      "decennial",
    ];

    return periods.reduce(
      (settings, period) => ({
        ...settings,
        [period]: convertPercentToNumber(formData[period]),
      }),
      {} as RentPenaltySettings
    );
  };

  const handleUpdateRentPenalty = async () => {
    try {
      setIsLoading(true);
      const penaltySettings = createPenaltySettings(formData);

      const res = await updateRentPenaltySettings(penaltySettings);
      if (res) {
        toast.success("Rent Penalty updated successfully");
      }
    } catch (err) {
      toast.error("Unable to update Rent Penalty");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection title="Rent Penalty Settings">
      <div className="flex flex-col gap-8">
        <p className="text-sm font-normal text-text-disabled dark:text-darkText-2">
          The tenant or occupant is required to complete full rent payment on or
          before the expiration of the rental period. If the tenant or occupant
          wishes to renew but makes payment after the due date, a selected
          percentage interest based on the rental period will be applied to
          the outstanding rent. This interest will continue to accrue until both
          the rent and the accumulated charges are fully paid.
        </p>
        <AuthForm onFormSubmit={handleUpdateRentPenalty}>
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {RENT_PERIODS.map((period) => (
              <Select
                key={period.value}
                id={`penalty_${period.value}`}
                label={`${period.label} Interest Charge`}
                desc={period.desc}
                options={period.options}
                value={formData[period.value] || PERCENTAGE_OPTIONS[0]}
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
