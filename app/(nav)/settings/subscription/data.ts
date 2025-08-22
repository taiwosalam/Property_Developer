import api, { handleAxiosError } from "@/services/api";
import {
  EnrollmentApiResponse,
  PropertyManagerSubsApiResponseTypes,
  PropertyManagerSubsTransformedPlan,
} from "./types";
import { cleanPricingValue } from "@/utils/cleanPrice";
import { formatNumber } from "@/utils/number-formatter";
import { capitalizeWords } from "@/hooks/capitalize-words";

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

// /property-manager-subscription/toggle-auto-renew
export const toggleAutoRenewPlan = async (payload: any) => {
  try {
    const res = await api.post(
      `/property-manager-subscription/toggle-auto-renew`,
      payload
    );
    if (res.status === 200 || res.status === 201) return true;
  } catch (error) {
    handleAxiosError(error, "Failed to Auto Renew");
    return false;
  }
};

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

export const transformPropertyManagerSubsApiData = (
  apiData: PropertyManagerSubsApiResponseTypes["data"]
): PropertyManagerSubsTransformedPlan[] => {
  const planDescriptions: Record<string, string> = {
    FREE: "Free plans offer a reduced set of features in comparison to paid alternatives, but provide users with trial options to explore the software without time constraints.",
    "Basic Plan":
      "The Basic plan is perfect for <strong>property manager company</strong> handling a limited number of branches and properties. It includes essential features designed for small-scale operations.",
    PREMIUM:
      "Highly recommended for <strong>property manager company</strong> overseeing multiple branches and a larger portfolio of properties. Ideal for those seeking a streamlined and efficient property management solution.",
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
          ? "SMS add-ons are required"
          : "SMS add-ons are not required";
      }

      // Define singular and plural labels for each feature
      const customLabels: Record<string, { singular: string; plural: string }> =
        {
          tenant_limit: {
            singular: "Tenant/Occupant",
            plural: "Tenants/Occupants",
          },
          branch_limit: { singular: "Branch", plural: "Branches" },
          staff_limit: { singular: "Staff", plural: "Staff" },
          property_limit: { singular: "Property", plural: "Properties" },
          unit_limit: { singular: "Unit Listing", plural: "Unit Listings" },
          director_limit: { singular: "Director", plural: "Directors" },
        };

      const labelConfig = customLabels[feature.key] || {
        singular: feature.label,
        plural: feature.label,
      };
      const label =
        feature.value === 1 ? labelConfig.singular : labelConfig.plural;

      return `Maximum of ${feature.value} ${label}`;
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
      price: isFree ? "LIFE TIME PLAN" : priceDetails.price,
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

// export const transformEnrollmentHistory = (
//   enrollments: EnrollmentApiResponse["data"]["enrollments"]
// ) => {
//   return enrollments.slice(0, 6).map((enrollment, idx) => {
//     // Map period to discount from PERIOD_OPTIONS
//     const periodOption = PERIOD_OPTIONS.find((option) => {
//       const label = option.label.toLowerCase().replace("s", "");
//       const period = enrollment.period.toLowerCase();
//       return (
//         label.includes(period) ||
//         period.includes(label.split(" -")[0].toLowerCase())
//       );
//     });
//     let discount = "0%";
//     if (periodOption && periodOption.label.includes("-")) {
//       discount = periodOption.label.split("-")[1].trim();
//     }

//     return {
//       id: `${enrollment.id || idx + 1}`,
//       subscription_type: capitalizeWords(enrollment.subs_package) || "--- ---",
//       duration: enrollment.period || "--- ---",
//       discount,
//       price: `₦${formatNumber(parseFloat(enrollment.amount))}`,
//       amount_paid: enrollment.amount_paid
//         ? `₦${formatNumber(parseFloat(enrollment.amount_paid))}`
//         : `₦${formatNumber(parseFloat(enrollment.amount))}`,
//       start_date: enrollment.date ? enrollment.date : "--- ---",
//       due_date: enrollment.expire_date || "--- ---",
//       status: enrollment.status || "--- ---",
//       // auto_renew: enrollment.auto_renew || 0,
//     };
//   });
// };

type PeriodOption = {
  value: string;
  label: string;
};

export const transformEnrollmentHistory = (
  enrollments: EnrollmentApiResponse["data"]["enrollments"]
) => {
  return enrollments.slice(0, 6).map((enrollment, idx) => {
    // Extract numeric months from backend string (e.g. "39 month")
    const match = enrollment.period?.match(/\d+/);
    const durationInMonths = match ? parseInt(match[0], 10) : 0;
    const periodStr = enrollment.period?.toLowerCase() || "";

    let periodOption: PeriodOption | undefined;

    // Lifetime check
    if (periodStr === "lifetime" || durationInMonths > 500) {
      periodOption = PERIOD_OPTIONS.find(
        (opt) => opt.label.toLowerCase() === "lifetime"
      );
    }

    // If more than 12 months, pick year option (ignore remainder months)
    if (!periodOption && durationInMonths >= 12) {
      const years = Math.floor(durationInMonths / 12); // whole years only
      const yearOption = PERIOD_OPTIONS.find((opt) =>
        opt.label.toLowerCase().startsWith(`${years} year`)
      );
      if (yearOption) {
        periodOption = yearOption;
      }
    }

    // If still no match, fall back to exact month option
    if (!periodOption && durationInMonths > 0) {
      periodOption = PERIOD_OPTIONS.find(
        (opt) => parseInt(opt.value, 10) === durationInMonths
      );
    }

    // Extract discount
    let discount = "0%";
    if (periodOption?.label.includes("-")) {
      discount = periodOption.label.split("-")[1].trim();
    }

    // Build display duration
    let durationLabel = enrollment.period || "--- ---";
    if (durationInMonths >= 12) {
      const years = Math.floor(durationInMonths / 12);
      const months = durationInMonths % 12;
      durationLabel =
        months > 0 ? `${years} Years ${months} Months` : `${years} Years`;
    }

    // Amount paid logic
    const hasAmountPaid =
      enrollment.amount_paid !== undefined &&
      enrollment.amount_paid !== null &&
      enrollment.amount_paid !== "" &&
      Number(enrollment.amount_paid) > 0;

    const amountPaid = hasAmountPaid
      ? `₦${formatNumber(parseFloat(enrollment.amount_paid))}`
      : `₦${formatNumber(parseFloat(enrollment.amount))}`;

    return {
      id: `${enrollment.id || idx + 1}`,
      subscription_type: capitalizeWords(enrollment.subs_package) || "--- ---",
      duration: durationLabel,
      discount,
      price: `₦${formatNumber(parseFloat(enrollment.amount))}`,
      amount_paid: amountPaid,
      start_date: enrollment.date ? enrollment.date : "--- ---",
      due_date: enrollment.expire_date || "--- ---",
      status: enrollment.status || "--- ---",
    };
  });
};
