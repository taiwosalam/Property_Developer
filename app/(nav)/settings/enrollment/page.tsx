"use client";

import React, { useState } from "react";
// Imports
import SettingsSection from "@/components/Settings/settings-section";
import { SettingsEnrollmentCard } from "@/components/Settings/settings-components";
import Link from "next/link";

const Enrollment = () => {
  const [showFreeFeatures, setShowFreeFeatures] = useState(false);
  const [showBasicFeatures, setShowBasicFeatures] = useState(false);
  const [billingType, setBillingType] = useState<"monthly" | "yearly">(
    "monthly"
  );
  //   const [quantity, setQuantity] = useState(1);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);

  const [basicBillingType, setBasicBillingType] = useState<
    "monthly" | "yearly"
  >("monthly");
  const [premiumBillingType, setPremiumBillingType] = useState<
    "monthly" | "yearly"
  >("monthly");

  const [basicQuantity, setBasicQuantity] = useState(1);
  const [premiumQuantity, setPremiumQuantity] = useState(1);

  const calculatePrice = (
    billingType: "monthly" | "yearly",
    quantity: number,
    baseMonthly: number,
    baseYearly: number
  ) => {
    const basePrice = billingType === "monthly" ? baseMonthly : baseYearly;
    return (basePrice * quantity).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  };

  const payMonthly = () => {
    setBillingType("monthly");
  };

  const payYearly = () => {
    setBillingType("yearly");
  };

  const handleBillingTypeChange = (type: "monthly" | "yearly") => {
    setBillingType(type);
  };

  return (
    <>
      {/* COMPANY TYPE SETTINGS */}
      <SettingsSection title="Enrollment/Renewal">
        <h4 className="text-[14px] text-text-disabled">
          This subscription plan is for Property Manager module only. To view
          other subscription plans, go to the respective module or switch from
          the top left of the dashboard header.
        </h4>

        <div className="flex flex-wrap gap-4 pricingWrapper mt-4">
          <SettingsEnrollmentCard
            planTitle="FREE PLAN"
            desc="Free plans offer a reduced set of features in comparison to paid alternatives, but provide users with trial options to explore the software without time constraints."
            planFor=""
            price="₦000.00"
            discount=""
            duration=""
            showFeatures={showFreeFeatures}
            setShowFeatures={setShowFreeFeatures}
            onSelect={() => {}}
            features={[
              "Maximum of 1 Branch",
              "Maximum of 1 Director",
              "Maximum of 1 Staff",
              "Maximum of 1 Properties",
              "Maximum of 1 Unit Listings",
              "Maximum of 4 Tenants & Occupants",
              "Ads-on are required",
            ]}
            billingType={billingType}
            payMonthly={payMonthly}
            payYearly={payYearly}
            quantity={0}
            incrementQuantity={() => {}}
            decrementQuantity={() => {}}
            isFree={true}
            onBillingTypeChange={handleBillingTypeChange}
          />

          {/* Basic Plan (paid plan) */}
          <SettingsEnrollmentCard
            planTitle="Basic Plan"
            price={calculatePrice(basicBillingType, basicQuantity, 5000, 60000)}
            discount={basicBillingType === "monthly" ? `(Billed at ${calculatePrice(basicBillingType, basicQuantity, 5000, 60000 )} per month)` 
                    : `Save ${(5000 * 12 - 60000).toLocaleString("en-NG", {style: "currency", currency: "NGN",})} annually`}
            desc="The Basic plan is ideal for Property Managers overseeing maximum of 2 branches with a limited number of properties. It offers basic features tailored for smaller-scale operations."
            planFor="Property Managers"
            duration={basicBillingType === "monthly" ? `${basicQuantity} ${basicQuantity === 1 ? "Month" : "Months"}` : `${basicQuantity} {basicQuantity === 1 ? "Year" : "Years"}`}
            showFeatures={showBasicFeatures}
            setShowFeatures={setShowBasicFeatures}
            billingType={basicBillingType}
            quantity={basicQuantity}
            incrementQuantity={() => setBasicQuantity((prev) => prev + 1)}
            decrementQuantity={() => setBasicQuantity((prev) => Math.max(1, prev - 1))}
            isFree={false}
            onBillingTypeChange={(type) => setBasicBillingType(type)}
            features={[
              "Maximum of 2 Branches",
              "Maximum of 2 Directors",
              "Maximum of 8 Staffs",
              "Maximum of 50 Properties ",
              "Maximum of 200 Unit Listings",
              "Maximum of 150 Tenants & Occupants ",
              "Ads-on are required",
            ]}
            payMonthly={payMonthly}
            payYearly={payYearly}
            onSelect={() => {}}
          />

          {/* Premium Plan */}
          <SettingsEnrollmentCard
            planTitle="Premium Plan"
            desc="Highly recommended for Property Managers overseeing over 7 branches and managing more than 100 properties. It's an ideal solution for those seeking a streamlined approach to property management."
            planFor="Property Managers"
            price={calculatePrice(
              premiumBillingType,
              premiumQuantity,
              12000,
              120000
            )}
            discount={premiumBillingType === "monthly" ? `(Billed at ${calculatePrice(premiumBillingType, premiumQuantity, 12000,120000 )} per month)`
                : `Save ${(12000 * 12 - 120000).toLocaleString("en-NG", {style: "currency", currency: "NGN", })} annually`
            }
            duration={premiumBillingType === "monthly" ? `${premiumQuantity} ${ premiumQuantity === 1 ? "Month" : "Months" }`
                : `${premiumQuantity} ${ premiumQuantity === 1 ? "Year" : "Years" }`}
            showFeatures={showPremiumFeatures}
            setShowFeatures={setShowPremiumFeatures}
            billingType={premiumBillingType}
            quantity={premiumQuantity}
            incrementQuantity={() => setPremiumQuantity((prev) => prev + 1)}
            decrementQuantity={() => setPremiumQuantity((prev) => Math.max(1, prev - 1))}
            isFree={false}
            onBillingTypeChange={(type) => setPremiumBillingType(type)}
            features={[
              "Maximum of 8 Branches",
              "Maximum of 4 Directors",
              "Maximum of 15 Staffs",
              "Maximum of 150 Properties ",
              "Maximum of 600 Unit Listings",
              "Unlimited Tenants & Occupants",
              "Ads-on for SMS & Domain Required",
            ]}
            payMonthly={payMonthly}
            payYearly={payYearly}
            onSelect={() => {}}
          />
        </div>

        <div className="flex flex-col w-full pr-10 pl-4 rounded-md mt-8 flex-wrap shadow-md py-4">
          <h3 className="text-[16px] underline font-bold text-brand-9">
            PROFESSIONAL PLAN
          </h3>
          <p className="text-sm  max-w-[964px] text-text-secondary">
            If none of the available plans does not meet your company's
            standards, consider opting for the Professional plan. This plan
            provides unlimited access to all software solutions. Professional
            plans are ideal for established property managers who wish to
            customize the software with their company's name and brand.{" "}
          </p>

          <h4 className="text-sm font-bold mt-4 text-text-secondary">
            Features Included:
          </h4>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-start w-full lg:justify-between flex-wrap">
            <strong className="leading-[150%] w-full lg:w-4/5 max-w-[750px]">
              All plans benefit and all Ads-on Inclusive; API integrations,
              SaaS, Whitelabel, Custom domain, Unlimited Branches, Director,
              Staff and Property Creations. Dedicated account officer, 24/7
              Support and training, Email integration, and SMS prefer name.{" "}
            </strong>

            <div className="w-1/2 lg:w-1/5 bg-brand-9 h-10 text-white px-4 py-2 rounded-md flex items-center justify-center">
              <Link href="#" className="">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </SettingsSection>
    </>
  );
};

export default Enrollment;
