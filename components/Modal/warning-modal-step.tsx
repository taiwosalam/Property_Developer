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
import CustomSub from "../Settings/custom-sub";

interface WarningStepProps {
  message?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
}

export const WarningStep1 = ({
  message,
  onNext,
  onClose,
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

export const WarningStep2 = ({ onPrevious, onClose }: WarningStepProps) => {
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
      // Filter out free plans
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

  return (
    <LandlordTenantModalPreset
      heading="Property Manager Subscription"
      back={{ handleBack: () => onPrevious && onPrevious() }}
      style={{ maxHeight: "80vh", minWidth: "80vw" }}
    >
      <div className="flex mb-4 pb-10 flex-nowrap overflow-x-auto custom-round-scrollbar gap-4 pricingWrapper mt-4">
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
                onSelectPlan={() => activatePlan(plan.id)}
              />
            ))}
        <CustomSub />
      </div>
    </LandlordTenantModalPreset>
  );
};
