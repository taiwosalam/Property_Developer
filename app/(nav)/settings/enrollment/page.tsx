  "use client";

import React, { useState } from "react";
import SettingsSection from "@/components/Settings/settings-section";
import SettingsEnrollmentCard from "@/components/Settings/SettingsEnrollment/settings-enrollment-card";
import Link from "next/link";

const Enrollment = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [basicBillingType, setBasicBillingType] = useState<"monthly" | "yearly">("monthly");
  const [premiumBillingType, setPremiumBillingType] = useState<"monthly" | "yearly">("monthly");
  const [basicQuantity, setBasicQuantity] = useState(1);
  const [premiumQuantity, setPremiumQuantity] = useState(1);



let isLifeTimePlan: boolean = false;
const calculatePrice = (
  billingType: "monthly" | "yearly",
  quantity: number,
  baseMonthly: number,
  planType: "basic" | "premium"
) => {
  const limitedQuantity = billingType === "yearly" ? Math.min(quantity, 5) : quantity;
  let basePrice = billingType === "monthly" ? baseMonthly : baseMonthly * 12;
  let discountText = "";
  let discount = "";
  let totalPrice: number | string = 0;

  if (billingType === "monthly") {
    totalPrice = basePrice * limitedQuantity;
    discount = `(Billed at ₦${(basePrice * 12).toLocaleString()}/year)`;
  } else {
    if (quantity > 5) {
      discountText = "No stress";
      totalPrice = "LIFE TIME PLAN";
      isLifeTimePlan = true;
      discount = planType === "basic" ? "₦750,000/outrightly" : "₦2,000,000/outrightly";
    } else {
      const discounts = [0.025, 0.04, 0.06, 0.08, 0.10];
      for (let i = 1; i <= limitedQuantity; i++) {
        const discountPercentage = discounts[i - 1];
        const discountedPrice = basePrice * (1 - discountPercentage);
        totalPrice += discountedPrice;
      }
      discountText = `Save ${(discounts[limitedQuantity - 1] * 100).toFixed(1)}%`;
      discount = `(Billed at ₦${baseMonthly.toLocaleString()}/month)`;
    }
  }

  return {
    price: typeof totalPrice === 'number' ? totalPrice.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }) : totalPrice,
    discountText,
    discount,
    duration: quantity > 5 && billingType === "yearly" ? "" : `${quantity}${quantity === 1 ? (billingType === "monthly" ? "m" : "y") : (billingType === "monthly" ? "m" : "y")}`
  };
  };

  const incrementQuantity = (setter: React.Dispatch<React.SetStateAction<number>>, billingType: "monthly" | "yearly") => {
    setter((prev) => Math.min(prev + 1, billingType === "yearly" ? 6 : 11));
  };

  const decrementQuantity = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => Math.max(1, prev - 1));
  };

  return (
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
          price="₦000.00"
          duration=""
          showFeatures={showFeatures}
          setShowFeatures={setShowFeatures}
          features={[
            "Maximum of 1 Branch",
            "Maximum of 1 Director",
            "Maximum of 1 Staff",
            "Maximum of 1 Properties",
            "Maximum of 1 Unit Listings",
            "Maximum of 4 Tenants & Occupants",
            "Ads-on are required",
          ]}
          billingType="monthly"
          quantity={0}
          isFree={true}
          discount=""
          discountText=""
          incrementQuantity={() => {}}
          decrementQuantity={() => {}}
          onBillingTypeChange={() => {}}
          isLifeTimePlan={isLifeTimePlan}
        />

        <SettingsEnrollmentCard
          planTitle="Basic Plan"
          desc="The Basic plan is ideal for Property Managers overseeing maximum of 2 branches with a limited number of properties. It offers basic features tailored for smaller-scale operations."
          planFor="Property Managers"
          showFeatures={showFeatures}
          setShowFeatures={setShowFeatures}
          billingType={basicBillingType}
          quantity={basicQuantity}
          incrementQuantity={() => incrementQuantity(setBasicQuantity, basicBillingType)}
          decrementQuantity={() => decrementQuantity(setBasicQuantity)}
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
          {...calculatePrice(basicBillingType, basicQuantity, 3500, "basic")}
          isLifeTimePlan={isLifeTimePlan}
        />

        <SettingsEnrollmentCard
          planTitle="Premium Plan"
          desc="Highly recommended for Property Managers overseeing over 7 branches and managing more than 100 properties. It's an ideal solution for those seeking a streamlined approach to property management."
          planFor="Property Managers"
          showFeatures={showFeatures}
          setShowFeatures={setShowFeatures}
          billingType={premiumBillingType}
          quantity={premiumQuantity}
          incrementQuantity={() => incrementQuantity(setPremiumQuantity, premiumBillingType)}
          decrementQuantity={() => decrementQuantity(setPremiumQuantity)}
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
          {...calculatePrice(premiumBillingType, premiumQuantity, 12000, "premium")}
          isLifeTimePlan={isLifeTimePlan}
        />
      </div>

      <div className="flex flex-col w-full pr-10 pl-4 rounded-md mt-8 flex-wrap shadow-md py-4">
        <h3 className="text-[16px] underline font-bold text-brand-9">
          PROFESSIONAL PLAN
        </h3>
        <p className="text-sm max-w-[964px] text-text-secondary">
          If none of the available plans meets your company&apos;s
          standards, consider opting for the Professional plan. This plan
          provides unlimited access to all software solutions. Professional
          plans are ideal for established property managers who wish to
          customize the software with their company&apos;s name and brand.
        </p>

        <h4 className="text-sm font-bold mt-4 text-text-secondary">
          Features Included:
        </h4>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-start w-full lg:justify-between flex-wrap">
          <strong className="leading-[150%] w-full lg:w-4/5 max-w-[750px]">
            All plans benefit and all Ads-on Inclusive; API integrations,
            SaaS, Whitelabel, Custom domain, Unlimited Branches, Director,
            Staff and Property Creations. Dedicated account officer, 24/7
            Support and training, Email integration, and SMS prefer name.
          </strong>

          <div className="w-1/2 lg:w-1/5 bg-brand-9 h-10 text-white px-4 py-2 rounded-md flex items-center justify-center">
            <Link href="#" className="">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default Enrollment;