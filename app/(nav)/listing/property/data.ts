import type { FilterOptionMenu } from "@/components/Management/Landlord/types";

export const listingPropertyFilter: FilterOptionMenu[] = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "branch",
    value: [
      { label: "branch 1", value: "branch1" },
      { label: "branch 2", value: "branch2" },
      { label: "branch 3", value: "branch3" },
    ],
  },
  {
    label: "Status",
    radio: true,
    value: [
      { label: "Draft", value: "draft" },
      { label: "Request", value: "request" },
      // { label: "Status 3", value: "Status3" },
      // { label: "Status 4", value: "Status4" },
    ],
  },
];


export const transformDraftUnitData = (response: any) => {
  const data = response.data;
  console.log("data", data)
  return {
    title: data.property.title,
    unit_id: data.id,
    unit_name: `${data.unit_name} ${data.unit_type}`,
    address: data.property.full_address,
    unitNumber: "",
    images: data.images.map((image: any) => image.path),
    categories: data.property.category,
    unitPreference: data.unit_preference,
    unitType: data.unit_type,
    unitSubType: data.unit_sub_type,
    state: data.property.state,
    localGovernment: data.property.local_government,
    accountOfficer: "",
    bedrooms: data.bedroom,
    bathrooms: data.bathroom,
    toilets: data.toilet,
    tenant_name: data.user.name,
    unit_features: data.facilities,
    newTenantTotalPrice: data.total_package,
    newTenantPrice: data.fee_amount,
    renewalTenantTotalPrice: data.renew_total_package,
    renew_fee_period: data.renew_fee_period,
    renewalTenantPrice: data.renew_fee_amount,
    renew_service_charge: data.renew_service_charge,
    renew_other_charge: data.renew_other_charge,
    en_suit: data.en_suit,
    prepaid: data.prepaid,
    wardrobe: data.wardrobe,
    fee_period: data.fee_period,
    branchName: data.property.branch.branch_name,
    agency_fee: data.property.agency_fee,
    whoToCharge: data.property.who_to_charge_new_tenant,
    // group_chat: convertToYesNo(Number(data.property.group_chat)),
    // rent_penalty: convertToYesNo(Number(data.property.rent_penalty)),
    // caution_deposit: data.property.caution_deposit,
    location: "",
    fee_amount: "",
    propertyId: data.property.id,
    total_package: data.total_package,
    caution_fee: data.caution_fee, 
    security_fee: data.security_fee,
    other_charge: data.other_charge,
    unitAgentFee: data.agency_fee,
    service_charge: data.service_charge,
  }
}