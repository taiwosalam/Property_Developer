export interface Unit {
    id: number;
    user_id: number;
    property_id: number;
    tenant_id: number | null;
    unit_name: string;
    unit_type: string;
    unit_sub_type: string;
    unit_preference: string;
    measurement: string;
    bedroom: string;
    bathroom: string;
    toilet: number;
    facilities: string[];
    en_suit: number;
    prepaid: number;
    wardrobe: number;
    pet_allowed: number;
    total_area_sqm: string;
    number_of: string;
    fee_period: string;
    fee_amount: string;
    security_fee: string;
    service_charge: string;
    agency_fee: string;
    legal_fee: string;
    caution_fee: string;
    inspection_fee: string;
    management_fee: string | null;
    other_charge: string;
    negotiation: number;
    total_package: string;
    renew_fee_period: string;
    renew_fee_amount: string;
    renew_service_charge: string;
    renew_other_charge: string;
    renew_total_package: string;
    is_active: string;
    published: number;
    status: string;
    reject_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface UnitOptionTypes {
    value: string;
    label: string;
}

export const unitInitialOptions: UnitOptionTypes[] = [
    { value: "", label: "" },
];

export const transformUnitOptions = (data: UnitsApiResponse): UnitOptionTypes[] => {
    return data.data
        .filter(unit => unit.is_active === 'vacant')
        .map(unit => ({
            value: unit.id.toString(),
            label: unit.unit_name,
        }));
};

// export const initialData: Unit = {
//     id: 0,
//     user_id: 0,
//     // property_id: 0,
//     // tenant_id: null,
//     // unit_name: "",
//     // unit_type: "",
//     // unit_sub_type: "",
//     // unit_preference: "",
//     // measurement: "",
//     // bedroom: "",
//     // bathroom: "",
//     // toilet: 0,
//     // facilities: [],
//     // en_suit: 0,
//     // prepaid: 0,
//     // wardrobe: 0,
//     // pet_allowed: 0,
//     // total_area_sqm: "",
//     // number_of: "",
//     // fee_period: "",
//     // fee_amount: "",
//     // security_fee: "",
//     // service_charge: "",
//     // agency_fee: "",
//     // legal_fee: "",
//     // caution_fee: "",
//     // inspection_fee: "",
//     // management_fee: null,
//     // other_charge: "",
//     // negotiation: 0,
//     // total_package: "",
//     // renew_fee_period: "",
//     // renew_fee_amount: "",
//     // renew_service_charge: "",
//     // renew_other_charge: "",
//     // renew_total_package: "",
//     // is_active: "",
//     // published: 0,
//     // status: "",
//     // reject_reason: null,
//     // created_at: "",
//     // updated_at: ""
// };

export interface UnitsApiResponse {
    status: string;
    message: string;
    data: Unit[];
}


export const getRentalData = (propertyData: any): any[] => {
    return [
        { label: "Property Title", value: propertyData?.property_name },
        { label: "State", value: propertyData?.state },
        { label: "Local Government", value: propertyData?.local_government },
        { label: "Full Address", value: propertyData?.address },
        { label: "Branch", value: propertyData?.branch },
        { label: "Account Officer", value: propertyData?.account_officer || "" },
        { label: "Landlord", value: propertyData?.landlord_name },
        { label: "Categories", value: propertyData?.category },
    ];
};

export const getPropertySettingsData = (propertyData: any): any[] => {
    return [
        { label: "Agency Fee", value: propertyData?.agency_fee !== undefined ? `${propertyData.agency_fee}%` : undefined },
        { label: "Period", value: propertyData?.fee_period },
        { label: "Charge", value: propertyData?.rent_penalty },
        { label: "Caution Deposit", value: propertyData?.caution_deposit },
        { label: "Group Chat", value: propertyData?.group_chat !== undefined ? `${propertyData.group_chat}` : undefined },
        { label: "Rent Penalty", value: propertyData?.who_to_charge_new_tenant !== undefined ? `${propertyData.who_to_charge_new_tenant}` : undefined },
    ];
};