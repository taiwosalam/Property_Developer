import { ChartConfig } from "@/components/ui/chart";
import type {
  SingleBranchResponseType,
  SingleBranchPageData,
  EditBranchFormData,
} from "./types";
import api, { handleAxiosError } from "@/services/api";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";

export const branchIdChartConfig = {
  totalfunds: {
    label: "Total Funds",
    color: "#38BDF8",
  },
  credit: {
    label: "Credit",
    color: "#2DD4BF",
  },
  debit: {
    label: "Debit",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const branchIdChartData = [
  { date: "2024-09-01", profits: 50, sales: 70, expenses: 30 },
  { date: "2024-09-02", profits: 90, sales: 100, expenses: 60 },
  { date: "2024-09-03", profits: 30, sales: 40, expenses: 20 },
  { date: "2024-09-08", profits: 110, sales: 120, expenses: 80 },
  { date: "2024-08-18", profits: 60, sales: 70, expenses: 50 },
  { date: "2024-08-20", profits: 130, sales: 150, expenses: 90 },
  { date: "2024-08-28", profits: 80, sales: 100, expenses: 60 },
  { date: "2024-09-30", profits: 120, sales: 140, expenses: 100 },
];

export const transformSingleBranchAPIResponse = (
  response: SingleBranchResponseType
): SingleBranchPageData => {
  const {
    data: { branch, manager, sub_wallet, recent_transactions: recentTransactions },
  } = response;
  return {
    branch_name: branch.branch_name,
    picture: branch.picture,
    address: `${branch.branch_address}, ${branch.city}, ${branch.local_government}, ${branch.state}`,
    properties: { total: branch.properties_count, new_this_month: branch.current_month_properties_count },
    landlords: { total: branch.landlords_count, new_this_month: branch.current_month_landlords_count },
    tenants: { total: branch.tenants_count, new_this_month: branch.current_month_tenants_count },
    vacant_units: { total: 0, new_this_month: 0 },
    expired: { total: 0, new_this_month: 0 },
    invoices: { total: 0, new_this_month: 0 },
    inquiries: { total: 0, new_this_month: 0 },
    complaints: { total: branch.complaints_count, new_this_month: branch.current_month_complaints_count },
    listings: { total: 0, new_this_month: 0 },
    branch_wallet: sub_wallet !== null ? { ...sub_wallet } : null,
    staffs: branch.staffs.map((s) => {
      return {
        avatarSrc: s.picture,
        name: `${s.title ? s.title + " " : ""}${s.name}`,
        position: s.staff_role,
        staff_ID: s.id,
      };
    }),
    transactions: recentTransactions !== null ? recentTransactions.map((t) => {
      return {
        id: t.id,
        amount: currencySymbols.naira + formatNumber(t.amount, { forceTwoDecimals: true }),
        transaction_type: t.transaction_type,
        reference: t.reference,
        description: t.description,
        status: t.status,
        balance_before: currencySymbols.naira + formatNumber(t.balance_before, { forceTwoDecimals: true }),
        balance_after: currencySymbols.naira + formatNumber(t.balance_after, { forceTwoDecimals: true }),
        source: t.source_name,
        date: t.date.split(" ")[0],
        time: t.date.split(" ")[1],
      };
    }) : [],
    recent_transactions: recentTransactions !== null ? recentTransactions.map((t)=> {
      return{
        id: t.id,
        amount: t.amount,
        transaction_type: t.transaction_type,
        date: t.date.split(" ")[0],
        time: t.date.split(" ")[1],
        description: t.description,
        reference: t.reference,
        status: t.status,
        balance_before: t.balance_before,
        balance_after: t.balance_after,
      }
    }) : [],
    hasManager: manager !== null && manager.length > 0,
  };
};


export const transformSingleBranchAPIResponseToEditBranchFormDetails = (
  response: SingleBranchResponseType
): EditBranchFormData => {
  const {
    data: { branch, sub_wallet },
  } = response;
  const branchHasMoney = Number(sub_wallet?.balance) > 0;
  return {
    id: branch.id,
    branch_name: branch.branch_name,
    isActive: branch.is_active,
    state: branch.state,
    local_government: branch.local_government,
    city: branch.city,
    address: branch.branch_address,
    description: branch.branch_desc,
    picture: branch.picture,
    wallet: branch.is_active === 1 ? "yes" : "no",
    hasMoney: branchHasMoney,
    // wallet: "no",
  };
};


// /branch/1/hold-wallet
export const holdBranchWallet = async(id:string)=>{
  try{
    const res = await api.post(`/branch/${id}/hold-wallet`)
    if (res.status === 200){
      return true
    }
  }catch(err){
    handleAxiosError(err)
    return false
  }
}
