import { useEffect, useRef } from "react";
import { useBranchInfoStore } from "@/store/branch-info-store";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { BranchAPIResponse } from "@/app/(nav)/manager/types";
import { unstable_batchedUpdates } from "react-dom";

const useBranchData = (branchId: number | undefined) => {
  const setBranchInfo = useBranchInfoStore((state) => state.setBranchInfo);
  const clearBranchInfo = useBranchInfoStore((state) => state.clearBranchInfo);
  const setBranchInfoBulk = useBranchInfoStore((state) => state.setBranchInfoBulk)
  const branchCache = useRef<Map<number, BranchAPIResponse["data"]>>(new Map());


  // Fetch branch data only if branchId is valid and not in cache
  const {
    data: branchData,
    loading: branchLoading,
    refetch: branchRefetch,
  } = useFetch<BranchAPIResponse>(
    branchId && !branchCache.current.has(branchId) ? `branch/${branchId}` : null
  );

  // Handle refetch events
  useRefetchOnEvent("refetchBranch", () => {
    if (branchId) {
      branchCache.current.delete(branchId); // Clear cache to force refetch
      branchRefetch({ silent: true });
    }
  });

// Handle branch data updates in useEffect
  useEffect(() => {
    if (branchId && branchData?.data) {
      // Cache the fetched data
      branchCache.current.set(branchId, branchData.data);
      
      // Extract data once
      const { branch, manager, sub_wallet, recent_transactions } = branchData.data;
      
      // Single bulk update instead of 40+ individual setBranchInfo calls
      setBranchInfoBulk({
        branch_id: branch.id,
        company_id: branch.company_id,
        is_active: branch.is_active,
        branch_name: branch.branch_name,
        picture: branch.picture,
        state: branch.state,
        local_government: branch.local_government,
        city: branch.city,
        branch_desc: branch.branch_desc,
        branch_address: branch.branch_address,
        email: branch.email,
        bank_name: branch.bank_name,
        account_name: branch.account_name,
        account_number: branch.account_number,
        staffs_count: branch.staffs_count,
        properties_count: branch.properties_count,
        landlords_count: branch.landlords_count,
        tenants_count: branch.tenants_count,
        complaints_count: branch.complaints_count,
        invoice_count: branch.invoice_count,
        inquiry_count: branch.inquiry_count,
        current_month_inquiry_count: branch.current_month_inquiry_count,
        current_month_complaints_count: branch.current_month_complaints_count,
        current_month_staffs_count: branch.current_month_staffs_count,
        current_month_invoice_count: branch.current_month_invoice_count,
        current_month_properties_count: branch.current_month_properties_count,
        current_month_landlords_count: branch.current_month_landlords_count,
        current_month_tenants_count: branch.current_month_tenants_count,
        receipt_statistic: branch.receipt_statistic,
        staffs: branch.staffs,
        properties: branch.properties,
        activities: branch.activities,
        created_at: branch.created_at,
        updated_at: branch.updated_at,
        vacant_unit: branch.vacant_unit,
        vacant_month_unit: branch.vacant_month_unit,
        expired_unit: branch.expired_unit,
        expired_month_unit: branch.expired_month_unit,
        listing: branch.listing,
        listing_month: branch.listing_month,
        manager,
        sub_wallet,
        recent_transactions,
      });

    } else if (branchId && branchCache.current.has(branchId)) {
      // Use cached data with single bulk update
      const cachedData = branchCache.current.get(branchId)!;
      const { branch, manager, sub_wallet, recent_transactions } = cachedData;
      
      setBranchInfoBulk({
        branch_id: branch.id,
        company_id: branch.company_id,
        is_active: branch.is_active,
        branch_name: branch.branch_name,
        picture: branch.picture,
        state: branch.state,
        local_government: branch.local_government,
        city: branch.city,
        branch_desc: branch.branch_desc,
        branch_address: branch.branch_address,
        email: branch.email,
        bank_name: branch.bank_name,
        account_name: branch.account_name,
        account_number: branch.account_number,
        staffs_count: branch.staffs_count,
        properties_count: branch.properties_count,
        landlords_count: branch.landlords_count,
        tenants_count: branch.tenants_count,
        complaints_count: branch.complaints_count,
        invoice_count: branch.invoice_count,
        inquiry_count: branch.inquiry_count,
        current_month_inquiry_count: branch.current_month_inquiry_count,
        current_month_complaints_count: branch.current_month_complaints_count,
        current_month_staffs_count: branch.current_month_staffs_count,
        current_month_invoice_count: branch.current_month_invoice_count,
        current_month_properties_count: branch.current_month_properties_count,
        current_month_landlords_count: branch.current_month_landlords_count,
        current_month_tenants_count: branch.current_month_tenants_count,
        receipt_statistic: branch.receipt_statistic,
        staffs: branch.staffs,
        properties: branch.properties,
        activities: branch.activities,
        created_at: branch.created_at,
        updated_at: branch.updated_at,
        vacant_unit: branch.vacant_unit,
        vacant_month_unit: branch.vacant_month_unit,
        expired_unit: branch.expired_unit,
        expired_month_unit: branch.expired_month_unit,
        listing: branch.listing,
        listing_month: branch.listing_month,
        manager,
        sub_wallet,
        recent_transactions,
      });

    } else if (!branchId) {
      // Clear store if no valid branch_id
      clearBranchInfo();
    }
  }, [branchId, branchData, setBranchInfoBulk, clearBranchInfo]); // No individual setBranchInfo in deps

  return { branchLoading };
};

export default useBranchData;
