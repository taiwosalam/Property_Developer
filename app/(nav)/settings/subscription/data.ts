import api, { handleAxiosError } from "@/services/api";
import {
  EnrollmentApiResponse,
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "./types";
import { cleanPricingValue } from "@/utils/cleanPrice";
import { formatNumber } from "@/utils/number-formatter";

export const PERIOD_OPTIONS = [
  { value: "1", label: "1 Month" },
  { value: "2", label: "2 Months" },
  { value: "3", label: "3 Months" },
  { value: "4", label: "4 Months" },
  { value: "5", label: "5 Months" },
  { value: "6", label: "6 Months" },
  { value: "7", label: "7 Months" },
  { value: "8", label: "8 Months" },
  { value: "9", label: "9 Months" },
  { value: "10", label: "10 Months" },
  { value: "11", label: "11 Months" },
  { value: "12", label: "1 Year - 2.5%" },
  { value: "13", label: "2 Years - 4.0%" },
  { value: "14", label: "3 Years - 6.0%" },
  { value: "15", label: "4 Years - 8.0%" },
  { value: "16", label: "5 Years - 10%" },
  { value: "17", label: "Lifetime" },
];

export const activatePlan = async (payload: any) => {
  try {
    const res = await api.post(`/property-manager-subscription`, payload);
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err, "Failed to activate plan");
    return false;
  }
};

// /property-manager-subscription/extend
export const extendPropertyManagerPlan = async (payload: any) => {
  try {
    const res = await api.post(
      `/property-manager-subscription/extend`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) return true;
  } catch (error) {
    handleAxiosError(error, "Failed to Extend");
    return false;
  }
};

// /property-manager-subscription/upgrade
export const upgradePropertyManagerPlan = async (payload: any) => {
  try {
    const res = await api.post(
      `/property-manager-subscription/upgrade`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) return true;
  } catch (error) {
    handleAxiosError(error, "Failed to Upgrade");
    return false;
  }
};

// /property-manager-subscription/renew
export const renewPropertyManagerPlan = async (payload: any) => {
  try {
    const res = await api.post(
      `/property-manager-subscription/renew`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) return true;
  } catch (error) {
    handleAxiosError(error, "Failed to Renew");
    return false;
  }
};

// export const calculatePrice = (
//   billingType: "monthly" | "yearly",
//   quantity: number,
//   baseMonthly: number,
//   baseYearlyPrice: number,
//   lifetimePrice: number,
//   planType: "basic" | "premium"
// ) => {
//   // Handle invalid baseMonthly
//   if (isNaN(baseMonthly) || baseMonthly <= 0) {
//     baseMonthly = planType === "basic" ? 0 : 0; // Fallback to dummy data prices
//   }

//   const limitedQuantity =
//     billingType === "yearly" ? Math.min(quantity, 5) : quantity;
//   let basePrice = billingType === "monthly" ? baseMonthly : baseYearlyPrice;
//   let discountText = "";
//   let discount = "";
//   let totalPrice: number | string = 0;
//   let isLifeTimePlan = false;

//   // Adjust quantity based on the selected plan
//   if (planType === "premium" && quantity > 6) {
//     quantity = 6; // Limit premium plan quantity to a maximum of 6
//   }

//   if (billingType === "monthly") {
//     totalPrice = basePrice * limitedQuantity;
//     discount =
//       planType === "basic"
//         ? `(Billed at ₦${(baseMonthly * 12).toLocaleString()}/year)`
//         : `(Billed at ₦${(baseMonthly * 12).toLocaleString()}/year)`;
//   } else {
//     if (quantity > 5) {
//       totalPrice = "LIFE TIME PLAN";
//       isLifeTimePlan = true;
//       discount =
//         planType === "basic" ? "₦750,000/outrightly" : "₦2,000,000/outrightly";
//     } else {
//       const discounts = [0.025, 0.04, 0.06, 0.08, 0.1];
//       totalPrice = basePrice * limitedQuantity;
//       const discountPercentage = discounts[limitedQuantity - 1] || 0;
//       const discountAmount = totalPrice * discountPercentage;
//       totalPrice -= discountAmount;
//       discountText = `Save ${(discountPercentage * 100).toFixed(1)}%`;
//       discount = `(Billed at ₦${baseMonthly.toLocaleString()}/month)`;
//     }
//   }

//   return {
//     price:
//       typeof totalPrice === "number"
//         ? totalPrice.toLocaleString("en-NG", {
//             style: "currency",
//             currency: "NGN",
//           })
//         : totalPrice,
//     discountText,
//     discount,
//     duration:
//       quantity > 5 && billingType === "yearly"
//         ? ""
//         : `${quantity}${
//             quantity === 1
//               ? billingType === "monthly"
//                 ? "m"
//                 : "y"
//               : billingType === "monthly"
//               ? "m"
//               : "y"
//           }`,
//     isLifeTimePlan,
//   };
// };

// Transform function to map API data to the required format

export const calculatePrice = (
  billingType: "monthly" | "yearly",
  quantity: number,
  baseMonthly: number,
  baseYearlyPrice: number,
  lifetimePrice: number,
  planType: "basic" | "premium"
) => {
  // Validate input prices, use 0 as fallback per request
  if (isNaN(baseMonthly) || baseMonthly < 0) {
    baseMonthly = 0;
  }
  if (isNaN(baseYearlyPrice) || baseYearlyPrice < 0) {
    baseYearlyPrice = 0;
  }
  if (isNaN(lifetimePrice) || lifetimePrice < 0) {
    lifetimePrice = 0;
  }

  const limitedQuantity =
    billingType === "yearly" ? Math.min(quantity, 6) : quantity;
  let basePrice = billingType === "monthly" ? baseMonthly : baseYearlyPrice;
  let totalPrice: number | string = 0;
  let discountText = "";
  let discount = "";
  let isLifeTimePlan = false;

  // Cap premium plan quantity at 6
  if (planType === "premium" && quantity > 6) {
    quantity = 6;
  }

  if (billingType === "monthly") {
    totalPrice = basePrice * limitedQuantity;
    discount = `(Billed at ₦${(baseMonthly * 12).toLocaleString()}/year)`;
  } else {
    if (quantity >= 6) {
      totalPrice = "LIFE TIME PLAN";
      isLifeTimePlan = true;
      discount = `₦${lifetimePrice.toLocaleString()}/outrightly`;
    } else {
      const discounts = [0, 0.025, 0.04, 0.06, 0.08, 0.1];
      totalPrice = basePrice * limitedQuantity;
      const discountPercentage = discounts[limitedQuantity] || 0;
      const discountAmount = totalPrice * discountPercentage;
      totalPrice -= discountAmount;
      discountText =
        discountPercentage > 0
          ? `Save ${(discountPercentage * 100).toFixed(1)}%`
          : "";
      discount = `(Billed at ₦${baseMonthly.toLocaleString()}/month)`;
    }
  }

  return {
    price:
      typeof totalPrice === "number"
        ? totalPrice.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })
        : totalPrice, // Return "LIFE TIME PLAN" for lifetime
    discountText,
    discount,
    duration: isLifeTimePlan
      ? "lifetime"
      : `${quantity}${billingType === "monthly" ? "m" : "y"}`,
    isLifeTimePlan,
  };
};

// export const transformPropertyManagerSubsApiData = (
//   apiData: PropertyManagerSubsApiResponseTypes["data"]
// ): PropertyManagerSubsTransformedPlan[] => {
//   const planDescriptions: Record<string, string> = {
//     FREE: "Free plans offer a reduced set of features in comparison to paid alternatives, but provide users with trial options to explore the software without time constraints.",
//     "Basic Plan":
//       "The Basic plan is ideal for Property Managers overseeing maximum of 2 branches with a limited number of properties. It offers basic features tailored for smaller-scale operations.",
//     PREMIUM:
//       "Highly recommended for Property Managers overseeing over 7 branches and managing more than 100 properties. It's an ideal solution for those seeking a streamlined approach to property management.",
//   };

//   return apiData.map((plan) => {
//     // Transform planName to match UI format
//     const planTitle =
//       plan.planName === "FREE"
//         ? "FREE PLAN"
//         : plan.planName === "PREMIUM"
//         ? "Premium Plan"
//         : "Basic Plan";

//     // Transform features to match UI format
//     const features = plan.features.map((feature) => {
//       if (feature.key === "is_addon") {
//         return feature.value === 1
//           ? "Ads-on are required"
//           : "Ads-on are not required";
//       }
//       return `Maximum of ${feature.value} ${feature.label}${
//         feature.value !== 1 ? "s" : ""
//       }`;
//     });

//     // Use API pricing for base calculations
//     const baseMonthlyPrice = parseFloat(plan.pricing.perMonth) || 0;
//     const baseYearlyPrice = parseFloat(plan.pricing.perYear) || 0;
//     const lifetimePrice =
//       parseFloat(plan.pricing.lifetime) ||
//       (planTitle.toLowerCase().includes("premium") ? 0 : 0);
//     const billingType =
//       plan.duration === "lifetime"
//         ? "lifetime"
//         : (plan.duration as "monthly" | "yearly");
//     const isFree = plan.is_free === 1;

//     // Calculate price details using existing calculatePrice logic
//     const priceDetails = calculatePrice(
//       billingType,
//       1, // Default quantity for initial render
//       baseMonthlyPrice,
//       baseYearlyPrice,
//       lifetimePrice,
//       planTitle.toLowerCase().includes("premium") ? "premium" : "basic"
//     );

//     return {
//       id: plan.id,
//       planTitle,
//       desc: planDescriptions[plan.planName] || plan.description, // Use hardcoded description
//       planFor: planTitle.toLowerCase().includes("free")
//         ? undefined
//         : "Property Managers",
//       price: isFree ? "₦0.00" : priceDetails.price,
//       discount: priceDetails.discount,
//       discountText: priceDetails.discountText,
//       duration: priceDetails.duration,
//       features,
//       isFree,
//       isLifeTimePlan: priceDetails.isLifeTimePlan,
//       billingType,
//       quantity: isFree ? 0 : 1, // Default quantity
//       baseMonthlyPrice, // Store original base price
//     };
//   });
// };

// Transform enrollment history API data for CustomTable

export const transformPropertyManagerSubsApiData = (
  apiData: PropertyManagerSubsApiResponseTypes["data"]
): PropertyManagerSubsTransformedPlan[] => {
  const planDescriptions: Record<string, string> = {
    FREE: "Free plans offer a reduced set of features in comparison to paid alternatives, but provide users with trial options to explore the software without time constraints.",
    "Basic Plan":
      "The Basic plan is ideal for Property Managers overseeing maximum of 2 branches with a limited number of properties. It offers basic features tailored for smaller-scale operations.",
    PREMIUM:
      "Highly recommended for Property Managers overseeing over 7 branches and managing more than 100 properties. It's an ideal solution for those seeking a streamlined approach to property management.",
  };

  return apiData.map((plan) => {
    const planTitle =
      plan.planName === "FREE"
        ? "FREE PLAN"
        : plan.planName === "PREMIUM"
        ? "Premium Plan"
        : "Basic Plan";

    const features = plan.features.map((feature) => {
      if (feature.key === "is_addon") {
        return feature.value === 1
          ? "Ads-on are required"
          : "Ads-on are not required";
      }
      return `Maximum of ${feature.value} ${feature.label}${
        feature.value !== 1 ? "s" : ""
      }`;
    });

    const baseMonthlyPrice = parseFloat(plan.pricing.perMonth) || 0;
    const baseYearlyPrice = parseFloat(plan.pricing.perYear) || 0;
    const lifetimePrice = parseFloat(plan.pricing.lifetime) || 0;
    const isFree = plan.is_free === 1;
    const billingType =
      plan.duration === "lifetime"
        ? "yearly"
        : (plan.duration as "monthly" | "yearly");
    const quantity = plan.duration === "lifetime" ? 6 : 1;

    const priceDetails = calculatePrice(
      billingType,
      quantity,
      baseMonthlyPrice,
      baseYearlyPrice,
      lifetimePrice,
      planTitle.toLowerCase().includes("premium") ? "premium" : "basic"
    );

    return {
      id: plan.id,
      planTitle,
      desc: planDescriptions[plan.planName] || plan.description,
      planFor: planTitle.toLowerCase().includes("free")
        ? undefined
        : "Property Managers",
      price: isFree ? "₦0.00" : priceDetails.price,
      discount: priceDetails.discount,
      discountText: priceDetails.discountText,
      duration: priceDetails.duration,
      features,
      isFree,
      isLifeTimePlan: priceDetails.isLifeTimePlan,
      billingType,
      quantity,
      baseMonthlyPrice,
      baseYearlyPrice,
      lifetimePrice,
    };
  });
};

export const transformEnrollmentHistory = (
  enrollments: EnrollmentApiResponse["data"]["enrollments"]
) => {
  return enrollments.slice(0, 6).map((enrollment, idx) => {
    // Map period to discount from PERIOD_OPTIONS
    const periodOption = PERIOD_OPTIONS.find((option) => {
      const label = option.label.toLowerCase().replace("s", "");
      const period = enrollment.period.toLowerCase();
      return (
        label.includes(period) ||
        period.includes(label.split(" -")[0].toLowerCase())
      );
    });
    let discount = "0%";
    if (periodOption && periodOption.label.includes("-")) {
      discount = periodOption.label.split("-")[1].trim();
    }

    return {
      id: `${enrollment.id || idx + 1}`,
      subscription_type: enrollment.subs_package || "--- ---",
      duration: enrollment.period || "--- ---",
      discount,
      price: `₦${formatNumber(parseFloat(enrollment.amount))}`,
      start_date: enrollment.date ? enrollment.date : "--- ---",
      due_date: enrollment.expire_date || "--- ---",
      status: enrollment.status || "--- ---",
    };
  });
};
