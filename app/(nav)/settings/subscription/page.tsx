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
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "./types";
import {
  calculatePrice,
  transformPropertyManagerSubsApiData,
  activatePlan,
} from "./data";
import SettingsEnrollmentCardSkeleton from "@/components/Settings/SettingsEnrollment/enrolllment-card-skeleton";
import ProfessionalPlan from "@/components/Settings/custom-sub";

const Enrollment = () => {
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
      setPageData(transformed);
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

  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const transformedSubscriptions = enrollment_subscriptions.data
    .slice(0, 6)
    .map((data) => ({
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

  return (
    <>
      <SettingsSection title="Subscription Plan">
        <h4 className="text-[14px] text-text-disabled">
          This subscription plan is for Property Manager module only. To view
          other subscription plans, go to the respective module or switch from
          the top left of the dashboard header.
        </h4>

        <div className="flex mb-4 pb-10 flex-nowrap overflow-x-auto custom-round-scrollbar gap-4 pricingWrapper mt-4">
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
        </div>
        <ProfessionalPlan />
      </SettingsSection>

      <SettingsSection title="Subscription/Renewal History">
        {transformedSubscriptions && transformedSubscriptions.length > 0 && (
          <div className="custom-flex-col gap-7 scroll-m-8" id="table">
            <SettingsSectionTitle desc="Track and manage your active and past enrollments with ease. Below is a detailed record of your current subscription plan, along with any previously paid fees for past enrollments." />
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
    </>
  );
};

export default Enrollment;
