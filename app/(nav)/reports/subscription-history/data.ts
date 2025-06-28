import { DataItem } from "@/components/Table/types";
import { EnrollmentApiResponse } from "../../settings/subscription/types";
import { formatNumber } from "@/utils/number-formatter";
import { PERIOD_OPTIONS } from "@/components/Settings/subscription-components";

interface TransformedEnrollmentData {
  transactions: DataItem[];
  current_page: number;
  total_pages: number;
  hasMore: boolean;
}

export const transformEnrollmentHistory = (
  enrollments: EnrollmentApiResponse["data"]["enrollments"],
  pagination: EnrollmentApiResponse["data"]["pagination"]
): TransformedEnrollmentData => {
  const transformedData: DataItem[] = enrollments
    .slice(0, 6)
    .map((enrollment, idx) => {
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
        amount_paid: enrollment.amount_paid
          ? `₦${formatNumber(parseFloat(enrollment.amount_paid))}`
          : `₦${formatNumber(parseFloat(enrollment.amount))}`,
        start_date: enrollment.date ? enrollment.date : "--- ---",
        due_date: enrollment.expire_date || "--- ---",
        status: enrollment.status || "--- ---",
        ref: null, // Placeholder for last row ref
      };
    });

  return {
    transactions: transformedData,
    current_page: pagination.current_page,
    total_pages: pagination.total_pages,
    hasMore: pagination.current_page < pagination.total_pages,
  };
};
