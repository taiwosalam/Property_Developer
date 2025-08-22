import { useEffect, useRef } from "react";
import { useBranchInfoStore } from "@/store/branch-info-store";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { BranchAPIResponse } from "@/app/(nav)/manager/types";
<<<<<<< HEAD
=======
import { unstable_batchedUpdates } from "react-dom";
>>>>>>> upstream/main

const useBranchData = (branchId: number | undefined) => {
  const setBranchInfo = useBranchInfoStore((state) => state.setBranchInfo);
  const clearBranchInfo = useBranchInfoStore((state) => state.clearBranchInfo);
<<<<<<< HEAD
  const branchCache = useRef<Map<number, BranchAPIResponse["data"]>>(new Map());

  // Fetch branch data only if branchId is valid and not in cache
  const { data: branchData, loading: branchLoading, refetch: branchRefetch } = useFetch<BranchAPIResponse>(
=======
  const setBranchInfoBulk = useBranchInfoStore((state) => state.setBranchInfoBulk)
  const branchCache = useRef<Map<number, BranchAPIResponse["data"]>>(new Map());


  // Fetch branch data only if branchId is valid and not in cache
  const {
    data: branchData,
    loading: branchLoading,
    refetch: branchRefetch,
  } = useFetch<BranchAPIResponse>(
>>>>>>> upstream/main
    branchId && !branchCache.current.has(branchId) ? `branch/${branchId}` : null
  );

  // Handle refetch events
  useRefetchOnEvent("refetchBranch", () => {
    if (branchId) {
      branchCache.current.delete(branchId); // Clear cache to force refetch
      branchRefetch({ silent: true });
    }
  });

<<<<<<< HEAD
  // Handle branch data updates in useEffect
=======
// Handle branch data updates in useEffect
>>>>>>> upstream/main
  useEffect(() => {
    if (branchId && branchData?.data) {
      // Cache the fetched data
      branchCache.current.set(branchId, branchData.data);
<<<<<<< HEAD
      // Update store with fetched data
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
      // Use cached data
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
=======
      
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

>>>>>>> upstream/main
    } else if (!branchId) {
      // Clear store if no valid branch_id
      clearBranchInfo();
    }
<<<<<<< HEAD
  }, [branchId, branchData, setBranchInfo, clearBranchInfo]);
=======
  }, [branchId, branchData, setBranchInfoBulk, clearBranchInfo]); // No individual setBranchInfo in deps
>>>>>>> upstream/main

  return { branchLoading };
};

<<<<<<< HEAD
export default useBranchData;
=======
export default useBranchData;
>>>>>>> upstream/main
