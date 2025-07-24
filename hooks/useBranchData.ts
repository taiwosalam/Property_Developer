import { useEffect, useMemo, useRef } from "react";
import { useBranchInfoStore } from "@/store/branch-info-store";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { BranchAPIResponse } from "@/app/(nav)/manager/types";

const useBranchData = (branchId: number | undefined) => {
  const setBranchInfo = useBranchInfoStore((state) => state.setBranchInfo);
  const clearBranchInfo = useBranchInfoStore((state) => state.clearBranchInfo);
  const branchCache = useRef<Map<number, BranchAPIResponse["data"]>>(new Map());

  // Fetch branch data only if branchId is valid and not in cache
  const { data: branchData, loading: branchLoading, refetch: branchRefetch } = useFetch<BranchAPIResponse>(
    branchId && !branchCache.current.has(branchId) ? `branch/${branchId}` : null
  );

  // Handle refetch events
  useRefetchOnEvent("refetchBranch", () => {
    if (branchId) {
      branchCache.current.delete(branchId); // Clear cache to force refetch
      branchRefetch({ silent: true });
    }
  });

  // Memoize branch data handling
  useMemo(() => {
    if (branchId && branchData?.data) {
      // Cache the fetched data
      branchCache.current.set(branchId, branchData.data);
      // Batch update the store with fetched data
      const { branch, manager, sub_wallet, recent_transactions } = branchData.data;
      setBranchInfo("branch_id", branch.id);
      setBranchInfo("company_id", branch.company_id);
      setBranchInfo("is_active", branch.is_active);
      setBranchInfo("branch_name", branch.branch_name);
      setBranchInfo("picture", branch.picture);
      setBranchInfo("state", branch.state);
      setBranchInfo("local_government", branch.local_government);
      setBranchInfo("city", branch.city);
      setBranchInfo("branch_desc", branch.branch_desc);
      setBranchInfo("branch_address", branch.branch_address);
      setBranchInfo("email", branch.email);
      setBranchInfo("bank_name", branch.bank_name);
      setBranchInfo("account_name", branch.account_name);
      setBranchInfo("account_number", branch.account_number);
      setBranchInfo("staffs_count", branch.staffs_count);
      setBranchInfo("properties_count", branch.properties_count);
      setBranchInfo("landlords_count", branch.landlords_count);
      setBranchInfo("tenants_count", branch.tenants_count);
      setBranchInfo("complaints_count", branch.complaints_count);
      setBranchInfo("invoice_count", branch.invoice_count);
      setBranchInfo("inquiry_count", branch.inquiry_count);
      setBranchInfo("current_month_inquiry_count", branch.current_month_inquiry_count);
      setBranchInfo("current_month_complaints_count", branch.current_month_complaints_count);
      setBranchInfo("current_month_staffs_count", branch.current_month_staffs_count);
      setBranchInfo("current_month_invoice_count", branch.current_month_invoice_count);
      setBranchInfo("current_month_properties_count", branch.current_month_properties_count);
      setBranchInfo("current_month_landlords_count", branch.current_month_landlords_count);
      setBranchInfo("current_month_tenants_count", branch.current_month_tenants_count);
      setBranchInfo("receipt_statistic", branch.receipt_statistic);
      setBranchInfo("staffs", branch.staffs);
      setBranchInfo("properties", branch.properties);
      setBranchInfo("activities", branch.activities);
      setBranchInfo("created_at", branch.created_at);
      setBranchInfo("updated_at", branch.updated_at);
      setBranchInfo("vacant_unit", branch.vacant_unit);
      setBranchInfo("vacant_month_unit", branch.vacant_month_unit);
      setBranchInfo("expired_unit", branch.expired_unit);
      setBranchInfo("expired_month_unit", branch.expired_month_unit);
      setBranchInfo("listing", branch.listing);
      setBranchInfo("listing_month", branch.listing_month);
      setBranchInfo("manager", manager);
      setBranchInfo("sub_wallet", sub_wallet);
      setBranchInfo("recent_transactions", recent_transactions);
    } else if (branchId && branchCache.current.has(branchId)) {
      // Use cached data if available
      const cachedData = branchCache.current.get(branchId)!;
      const { branch, manager, sub_wallet, recent_transactions } = cachedData;
      setBranchInfo("branch_id", branch.id);
      setBranchInfo("company_id", branch.company_id);
      setBranchInfo("is_active", branch.is_active);
      setBranchInfo("branch_name", branch.branch_name);
      setBranchInfo("picture", branch.picture);
      setBranchInfo("state", branch.state);
      setBranchInfo("local_government", branch.local_government);
      setBranchInfo("city", branch.city);
      setBranchInfo("branch_desc", branch.branch_desc);
      setBranchInfo("branch_address", branch.branch_address);
      setBranchInfo("email", branch.email);
      setBranchInfo("bank_name", branch.bank_name);
      setBranchInfo("account_name", branch.account_name);
      setBranchInfo("account_number", branch.account_number);
      setBranchInfo("staffs_count", branch.staffs_count);
      setBranchInfo("properties_count", branch.properties_count);
      setBranchInfo("landlords_count", branch.landlords_count);
      setBranchInfo("tenants_count", branch.tenants_count);
      setBranchInfo("complaints_count", branch.complaints_count);
      setBranchInfo("invoice_count", branch.invoice_count);
      setBranchInfo("inquiry_count", branch.inquiry_count);
      setBranchInfo("current_month_inquiry_count", branch.current_month_inquiry_count);
      setBranchInfo("current_month_complaints_count", branch.current_month_complaints_count);
      setBranchInfo("current_month_staffs_count", branch.current_month_staffs_count);
      setBranchInfo("current_month_invoice_count", branch.current_month_invoice_count);
      setBranchInfo("current_month_properties_count", branch.current_month_properties_count);
      setBranchInfo("current_month_landlords_count", branch.current_month_landlords_count);
      setBranchInfo("current_month_tenants_count", branch.current_month_tenants_count);
      setBranchInfo("receipt_statistic", branch.receipt_statistic);
      setBranchInfo("staffs", branch.staffs);
      setBranchInfo("properties", branch.properties);
      setBranchInfo("activities", branch.activities);
      setBranchInfo("created_at", branch.created_at);
      setBranchInfo("updated_at", branch.updated_at);
      setBranchInfo("vacant_unit", branch.vacant_unit);
      setBranchInfo("vacant_month_unit", branch.vacant_month_unit);
      setBranchInfo("expired_unit", branch.expired_unit);
      setBranchInfo("expired_month_unit", branch.expired_month_unit);
      setBranchInfo("listing", branch.listing);
      setBranchInfo("listing_month", branch.listing_month);
      setBranchInfo("manager", manager);
      setBranchInfo("sub_wallet", sub_wallet);
      setBranchInfo("recent_transactions", recent_transactions);
    } else if (!branchId) {
      // Clear store if no valid branch_id
      clearBranchInfo();
    }
  }, [branchId, branchData, setBranchInfo, clearBranchInfo]);

  return { branchLoading };
};

export default useBranchData;