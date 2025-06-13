import api, { handleAxiosError } from "@/services/api";
import {
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "./types";

export const activatePlan = async (planId: number) => {
  try {
    const res = await api.put(
      `/property-manager-subscription-plan/${planId}/activate`
    );
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err, "Failed to activate plan");
    return false;
  }
};

export const calculatePrice = (
  billingType: "monthly" | "yearly",
  quantity: number,
  baseMonthly: number,
  planType: "basic" | "premium"
) => {
  // Handle invalid baseMonthly
  if (isNaN(baseMonthly) || baseMonthly <= 0) {
    baseMonthly = planType === "basic" ? 3500 : 12000; // Fallback to dummy data prices
  }

  const limitedQuantity =
    billingType === "yearly" ? Math.min(quantity, 5) : quantity;
  let basePrice = billingType === "monthly" ? baseMonthly : baseMonthly * 12;
  let discountText = "";
  let discount = "";
  let totalPrice: number | string = 0;
  let isLifeTimePlan = false;

  // Adjust quantity based on the selected plan
  if (planType === "premium" && quantity > 6) {
    quantity = 6; // Limit premium plan quantity to a maximum of 6
  }

  if (billingType === "monthly") {
    totalPrice = basePrice * limitedQuantity;
    discount =
      planType === "basic"
        ? `(Billed at ₦${(baseMonthly * 12).toLocaleString()}/year)`
        : `(Billed at ₦${(baseMonthly * 12).toLocaleString()}/year)`;
  } else {
    if (quantity > 5) {
      totalPrice = "LIFE TIME PLAN";
      isLifeTimePlan = true;
      discount =
        planType === "basic" ? "₦750,000/outrightly" : "₦2,000,000/outrightly";
    } else {
      const discounts = [0.025, 0.04, 0.06, 0.08, 0.1];
      totalPrice = basePrice * limitedQuantity;
      const discountPercentage = discounts[limitedQuantity - 1] || 0;
      const discountAmount = totalPrice * discountPercentage;
      totalPrice -= discountAmount;
      discountText = `Save ${(discountPercentage * 100).toFixed(1)}%`;
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
        : totalPrice,
    discountText,
    discount,
    duration:
      quantity > 5 && billingType === "yearly"
        ? ""
        : `${quantity}${
            quantity === 1
              ? billingType === "monthly"
                ? "m"
                : "y"
              : billingType === "monthly"
              ? "m"
              : "y"
          }`,
    isLifeTimePlan,
  };
};


// Transform function to map API data to the required format
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
    // Transform planName to match UI format
    const planTitle =
      plan.planName === "FREE"
        ? "FREE PLAN"
        : plan.planName === "PREMIUM"
        ? "Premium Plan"
        : "Basic Plan";

    // Transform features to match UI format
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

    // Use API pricing for base calculations
    const baseMonthlyPrice =
      parseFloat(plan.pricing.perMonth) ||
      (planTitle.toLowerCase().includes("premium") ? 12000 : 3500);
    const billingType =
      plan.duration === "lifetime"
        ? "yearly"
        : (plan.duration as "monthly" | "yearly");
    const isFree = plan.is_free === 1;

    // Calculate price details using existing calculatePrice logic
    const priceDetails = calculatePrice(
      billingType,
      1, // Default quantity for initial render
      baseMonthlyPrice,
      planTitle.toLowerCase().includes("premium") ? "premium" : "basic"
    );

    return {
      id: plan.id,
      planTitle,
      desc: planDescriptions[plan.planName] || plan.description, // Use hardcoded description
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
      quantity: isFree ? 0 : 1, // Default quantity
      baseMonthlyPrice, // Store original base price
    };
  });
};
