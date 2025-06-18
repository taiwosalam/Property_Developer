import Button from "../Form/Button/button";
import { XIcon } from "@/public/icons/icons";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import {
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "@/app/(nav)/settings/subscription/types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  activatePlan,
  calculatePrice,
  transformPropertyManagerSubsApiData,
} from "@/app/(nav)/settings/subscription/data";
import SettingsEnrollmentCard from "../Settings/SettingsEnrollment/settings-enrollment-card";
import SettingsEnrollmentCardSkeleton from "../Settings/SettingsEnrollment/enrolllment-card-skeleton";
import ProfessionalPlan from "../Settings/custom-sub";
import { FormSteps } from "@/app/(onboarding)/auth/types";

interface WarningStepProps {
  message?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  changeStep: (step: FormSteps | number) => void; // Add changeStep prop
  setSelectedPlan?: (
    plan: Pick<
      PropertyManagerSubsTransformedPlan,
      "id" | "price" | "planTitle"
    > | null
  ) => void;
}

export const WarningStep1 = ({
  message,
  onNext,
  onClose,
  changeStep,
}: WarningStepProps) => {
  return (
    <div className="bg-white dark:bg-[#3C3D37] rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px] z-[10002] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-lg dark:text-white font-semibold mb-2">
          🛡 Access Denied
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 dark:text-white hover:text-blue-700 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <XIcon size="30" />
        </button>
      </div>
      <p className="text-sm dark:text-white mb-4">
        {message ||
          "Sorry, your current subscription does not allow you to access these features. Please upgrade your account to gain access."}
      </p>
      <div className="gap-2 flex w-full justify-end items-end">
        <Button
          type="button"
          size="sm_normal"
          className="px-4 py-2 text-white capitalize rounded-md text-sm"
          onClick={onNext}
          aria-label="Proceed to upgrade"
        >
          Upgrade
        </Button>
        <Button
          variant="border"
          size="sm_normal"
          className="px-4 py-2 dark:text-white"
          onClick={onClose}
          aria-label="Cancel"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export const WarningStep2 = ({
  onPrevious,
  onClose,
  changeStep,
  setSelectedPlan,
}: WarningStepProps) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [pageData, setPageData] = useState<
    PropertyManagerSubsTransformedPlan[]
  >([]);
  const { data, loading, error, refetch } =
    useFetch<PropertyManagerSubsApiResponseTypes>(
      "/property-manager-subscription-plan"
    );

  // Transform API data and set pageData
  useEffect(() => {
    if (data?.data) {
      const transformed = transformPropertyManagerSubsApiData(data.data);
      const nonFreePlans = transformed.filter((plan) => !plan.isFree);
      setPageData(nonFreePlans);
    }
  }, [data]);

  // Handle billing type change for a specific plan
  const handleBillingTypeChange = useCallback(
    (planId: number, type: "monthly" | "yearly") => {
      setPageData((prevData) =>
        prevData.map((plan) => {
          if (plan.id === planId && !plan.isFree) {
            const priceDetails = calculatePrice(
              type,
              plan.quantity,
              plan.baseMonthlyPrice,
              plan.baseYearlyPrice,
              plan.lifetimePrice,
              plan.planTitle.toLowerCase().includes("premium")
                ? "premium"
                : "basic"
            );
            return {
              ...plan,
              billingType: type,
              ...priceDetails,
            };
          }
          return plan;
        })
      );
    },
    []
  );

  // Handle quantity increment for a specific plan
  const incrementQuantity = useCallback(
    (planId: number, billingType: "monthly" | "yearly") => {
      setPageData((prevData) =>
        prevData.map((plan) => {
          if (plan.id === planId && !plan.isFree) {
            const newQuantity = Math.min(
              plan.quantity + 1,
              billingType === "yearly" ? 6 : 11
            );
            const priceDetails = calculatePrice(
              billingType,
              newQuantity,
              plan.baseMonthlyPrice,
              plan.baseYearlyPrice,
              plan.lifetimePrice,
              plan.planTitle.toLowerCase().includes("premium")
                ? "premium"
                : "basic"
            );
            return {
              ...plan,
              quantity: newQuantity,
              ...priceDetails,
            };
          }
          return plan;
        })
      );
    },
    []
  );

  // Handle quantity decrement for a specific plan
  const decrementQuantity = useCallback(
    (planId: number, billingType: "monthly" | "yearly") => {
      setPageData((prevData) =>
        prevData.map((plan) => {
          if (plan.id === planId && !plan.isFree) {
            const newQuantity = Math.max(1, plan.quantity - 1);
            const priceDetails = calculatePrice(
              billingType,
              newQuantity,
              plan.baseMonthlyPrice,
              plan.baseYearlyPrice,
              plan.lifetimePrice,
              plan.planTitle.toLowerCase().includes("premium")
                ? "premium"
                : "basic"
            );
            return {
              ...plan,
              quantity: newQuantity,
              ...priceDetails,
            };
          }
          return plan;
        })
      );
    },
    []
  );

  // Handle plan selection
  const handleSelectPlan = useCallback(
    (
      plan: Pick<
        PropertyManagerSubsTransformedPlan,
        "id" | "price" | "planTitle"
      >
    ) => {
      setSelectedPlan?.(plan); // Store the selected plan
      changeStep(3); // Move to step 3
    },
    [setSelectedPlan, changeStep]
  );

  return (
    <div className="w-full flex gap-4 relative overflow-x-auto hide-scrollbar">
      <div className="flex mb-4 pb-10 flex-nowrap gap-4 pricingWrapper mt-4">
        {loading
          ? Array(2)
              .fill(0)
              .map((_, index) => <SettingsEnrollmentCardSkeleton key={index} />)
          : pageData.map((plan) => (
              <SettingsEnrollmentCard
                key={plan.id}
                {...plan}
                showFeatures={showFeatures}
                setShowFeatures={setShowFeatures}
                incrementQuantity={() =>
                  incrementQuantity(plan.id, plan.billingType)
                }
                decrementQuantity={() =>
                  decrementQuantity(plan.id, plan.billingType)
                }
                onBillingTypeChange={(type) =>
                  handleBillingTypeChange(plan.id, type)
                }
                onSelect={() =>
                  handleSelectPlan({
                    id: plan.id,
                    price: plan.price,
                    planTitle: plan.planTitle,
                  })
                }
                page="modal"
                changeStep={changeStep}
              />
            ))}
      </div>
      <ProfessionalPlan page="modal" />
    </div>
  );
};
