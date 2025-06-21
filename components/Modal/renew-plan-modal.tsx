import {
  calculatePrice,
  transformPropertyManagerSubsApiData,
} from "@/app/(nav)/settings/subscription/data";
import {
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "@/app/(nav)/settings/subscription/types";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useCallback, useEffect, useState } from "react";
import SettingsEnrollmentCardSkeleton from "../Settings/SettingsEnrollment/enrolllment-card-skeleton";
import SettingsEnrollmentCard from "../Settings/SettingsEnrollment/settings-enrollment-card";
import ProfessionalPlanCard from "@/app/(nav)/settings/subscription/professional-card";
import useFetch from "@/hooks/useFetch";
import { FormSteps } from "@/app/(onboarding)/auth/types";
import { useGlobalStore } from "@/store/general-store";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

interface WarningStepProps {
  message?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  changeStep: (step: FormSteps | number) => void; // Add changeStep prop
  setSelectedPlan?: (plan: PropertyManagerSubsTransformedPlan | null) => void;
}

export const RenewSubPlanModal = ({
  onPrevious,
  onClose,
  changeStep,
  setSelectedPlan,
}: WarningStepProps) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const { company_id } = usePersonalInfoStore();
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const [pageData, setPageData] = useState<
    PropertyManagerSubsTransformedPlan[]
  >([]);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const { data, loading, error, refetch } =
    useFetch<PropertyManagerSubsApiResponseTypes>(
      "/property-manager-subscription-plan"
    );
  useRefetchOnEvent("refetchSubscriptionPlan", () => refetch({ silent: true }));

  // Transform API data and set pageData
  useEffect(() => {
    if (data?.data) {
      const transformed = transformPropertyManagerSubsApiData(data.data);
      const nonFreePlans = transformed.filter((plan) => !plan.isFree);
      setPageData(nonFreePlans);
    }
  }, [data]);

  const handleBillingTypeChange = useCallback(
    (planId: number, type: "monthly" | "yearly") => {
      setPageData((prevData) =>
        prevData.map((plan) => {
          if (plan.id === planId) {
            const newQuantity = 1; // Reset quantity to 1
            const priceDetails = plan.isFree
              ? {
                  price: "LIFE TIME",
                  discount: "",
                  discountText: "",
                  duration: "lifetime",
                  isLifeTimePlan: false,
                }
              : calculatePrice(
                  type,
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
              billingType: type,
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

  //   // Handle plan selection
  const handleSelectPlan = useCallback(
    (plan: PropertyManagerSubsTransformedPlan) => {
      setSelectedPlan?.(plan); // Store the selected plan
      changeStep(3); // Move to step 3
    },
    [setSelectedPlan, changeStep]
  );

  return (
    <div className="w-full min-h-[120px] flex gap-4 relative overflow-x-auto hide-scrollbar">
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
                page="modal"
                changeStep={changeStep}
                onSelect={() => handleSelectPlan(plan)}
              />
            ))}
        <ProfessionalPlanCard
          showFeatures={showFeatures}
          setShowFeatures={setShowFeatures}
        />
      </div>
    </div>
  );
};
