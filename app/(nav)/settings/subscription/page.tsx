"use client";

import React, { useState, useEffect, useCallback } from "react";
import SettingsSection from "@/components/Settings/settings-section";
import SettingsEnrollmentCard from "@/components/Settings/SettingsEnrollment/settings-enrollment-card";
import Link from "next/link";
import { SettingsSectionTitle } from "@/components/Settings/settings-components";
import CustomTable from "@/components/Table/table";
import { CustomTableProps } from "@/components/Table/types";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { enrollment_subscriptions } from "../add-on/data";
import useFetch from "@/hooks/useFetch";
import {
  EnrollmentApiResponse,
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "./types";
import {
  calculatePrice,
  transformPropertyManagerSubsApiData,
  activatePlan,
  extendPropertyManagerPlan,
  upgradePropertyManagerPlan,
  transformEnrollmentHistory,
} from "./data";
import SettingsEnrollmentCardSkeleton from "@/components/Settings/SettingsEnrollment/enrolllment-card-skeleton";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { cleanPricingValue } from "@/utils/cleanPrice";
import ProfessionalPlanComponent from "./professional-plan";
import ProfessionalPlanCard from "./professional-card";

const Enrollment = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const { company_id } = usePersonalInfoStore();
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const [pageData, setPageData] = useState<
    PropertyManagerSubsTransformedPlan[]
  >([]);
  const { data, loading, error, refetch } =
    useFetch<PropertyManagerSubsApiResponseTypes>(
      "/property-manager-subscription-plan"
    );
  useRefetchOnEvent("refetchSubscriptionPlan", () => refetch({ silent: true }));

  const {
    data: companyEnrollments,
    error: enrollmentErr,
    loading: enrollmentLoading,
    refetch: refetchEnrollments,
  } = useFetch<EnrollmentApiResponse>(`/enrollments/${company_id}`);
  useRefetchOnEvent("refetchEnrollments", () =>
    refetchEnrollments({ silent: true })
  );

  const enrollments_subs = companyEnrollments
    ? transformEnrollmentHistory(companyEnrollments.data.enrollments)
    : null;

  // Transform API data and set pageData
  useEffect(() => {
    if (data?.data) {
      const transformed = transformPropertyManagerSubsApiData(data.data);
      // Filter out Free plan if user is not on Free plan
      const filtered = transformed.filter(
        (plan) => !plan.isFree || currentPlanKeyword === "free"
      );
      setPageData(filtered);
    }
  }, [data, currentPlanKeyword]);

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

  // Handle select plan
  const handleSelectPlan = useCallback(
    async (plan: PropertyManagerSubsTransformedPlan) => {
      const thisPlanKeyword = plan.planTitle?.split(" ")[0]?.toLowerCase();
      // Determine if it's an upgrade or extension
      const isExtend = currentPlanKeyword === thisPlanKeyword;
      const isUpgrade =
        (currentPlanKeyword === "free" &&
          (thisPlanKeyword === "basic" || thisPlanKeyword === "premium")) ||
        (currentPlanKeyword === "basic" && thisPlanKeyword === "premium");

      const payload = {
        plan_id: plan?.id || 0,
        payment_method: "wallet",
        quantity:  plan.isLifeTimePlan ? 1 : plan.quantity,
        duration: plan.isLifeTimePlan ? "lifetime" : plan.billingType,
        amount: plan.isLifeTimePlan ? plan.lifetimePrice : cleanPricingValue(plan.price),
      };

      if (isExtend) {
        return await extendPropertyManagerPlan(payload);
      } else if (isUpgrade) {
        return await upgradePropertyManagerPlan(payload);
      } else {
        return await activatePlan(payload);
      }
    },
    [currentPlanKeyword]
  );

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const transformedSubscriptions = enrollments_subs?.map((data) => ({
    ...data,
    status: (
      <p
        className={clsx({
          "text-status-success-2": data.status === "Active",
          "text-status-caution-2": data.status === "Pending",
        })}
      >
        {data.status}
      </p>
    ),
  }));

  const ACTIVE_PLAN_EXPIRY_DATE = enrollments_subs?.[0].due_date;

  return (
    <>
      <SettingsSection title="Subscription Plan">
        <h4 className="text-[14px] text-text-disabled">
          This subscription plan is for Property Manager module only. To view
          other subscription plans, go to the respective module or switch from
          the top left of the dashboard header.
        </h4>
        <div
          className={clsx(
            "mb-4 pb-10 flex items-center justfiy-center gap-4 pricingWrapper overflow-x-auto flex-nowrap custom-round-scrollbar mt-4 ",
            currentPlanKeyword !== "free" ? "flex-row" : "flex-col"
          )}
        >
          <div className="flex gap-4">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <SettingsEnrollmentCardSkeleton key={index} />
                  ))
              : pageData.map((plan) => (
                  <SettingsEnrollmentCard
                    key={plan.id}
                    {...plan}
                    expiry_date={ACTIVE_PLAN_EXPIRY_DATE}
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
                    onSelectPlan={() => handleSelectPlan(plan)}
                  />
                ))}
          </div>
          {currentPlanKeyword !== "free" && (
            <ProfessionalPlanCard
              showFeatures={showFeatures}
              setShowFeatures={setShowFeatures}
            />
          )}
        </div>
        {currentPlanKeyword === "free" && <ProfessionalPlanComponent />}
      </SettingsSection>

      {transformedSubscriptions &&
        transformedSubscriptions.length > 0 &&
        currentPlanKeyword !== "free" && (
          <SettingsSection title="Subscription/Renewal History">
            {transformedSubscriptions &&
              transformedSubscriptions.length > 0 && (
                <div className="custom-flex-col gap-7 scroll-m-8" id="table">
                  <SettingsSectionTitle desc="Easily track and manage your active and past enrollments. Below is a detailed overview of your current subscription plan and a history of all previously paid fees." />
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-black dark:text-white text-lg font-medium">
                        Subscription Overview
                      </h2>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Link
                        href="/reports/subscription-history?b=true"
                        className="text-text-label dark:text-white font-medium"
                      >
                        See All
                      </Link>
                      <ChevronRight className="text-sm font-medium" />
                    </div>
                  </div>
                  <CustomTable
                    data={transformedSubscriptions}
                    fields={enrollment_subscriptions.fields}
                    {...table_style_props}
                  />
                </div>
              )}
          </SettingsSection>
        )}
    </>
  );
};

export default Enrollment;
