export interface OwnerPageData {
    id: string;
    picture: string;
    name: string;
    title: string;
    email: string;
    phone_number: string;
    gender: string;
    notes: {
        last_updated: string;
        write_up: string;
    };
    note: boolean;
    owner_type: string;
    user_id: string;
    badge_color?: string;
    user_tag: "mobile" | "web";
    contact_address: {
        address: string;
        city: string;
        state: string;
        local_govt: string;
    };
    next_of_kin: {
        name: string;
        phone: string;
        email: string;
        address: string;
        relationship: string;
    };
    bank_details: {
        bank_name: string;
        account_name: string;
        account_number: string;
        wallet_id?: string;
    };
    others: {
        employment: string;
        employment_type: string;
        family_type: string;
    };
    documents: {
        id: string;
        name: string;
        link: string;
        date?: string;
        document_type: string;
    }[];
    properties_managed: PropertiesManaged[];
    previous_properties: PreviousProperties[];
    statement: {
        id: number;
        picture: string;
        name: string;
        payment_id: string;
        details: string;
        unit_name: string;
        credit: string | null;
        debit: string | null;
        date: string;
        badge_color?: string;
    }[];
    propertyOptions: {
        label: string;
        value: string;
    }[];
    messageUserData: {
        id: number;
        name: string;
        position: string;
        imageUrl: string;
        branch_id: number;
    };
}

export interface PropertiesManaged {
    id: string;
    property_name: string;
    images: string[];
    default_image: string;
    address: string;
    total_units: number;
    total_income: number;
    total_returns: number;
    property_type: string;
    total_unit_pictures: number;
    hasVideo: boolean;
    currency: string;
    mobile_tenants: number;
    web_tenants: number;
    owing_units: number;
    available_units: number;
    viewOnly: boolean;
    isClickable: boolean;
    branch: string;
    last_updated: string;
    accountOfficer: string;
    documents: {
        id: string;
        name: string;
        link: string;
        date: string;
        document_type: string;
    }[];
}

export interface PreviousProperties {
    id: string;
    property_name: string;
    images: string[];
    default_image: string;
    address: string;
    total_units: number;
    total_income: number;
    total_returns: number;
    property_type: string;
    total_unit_pictures: number;
    hasVideo: boolean;
    currency: string;
    mobile_tenants: number;
    web_tenants: number;
    owing_units: number;
    available_units: number;
    viewOnly: boolean;
    isClickable: boolean;
    branch: string;
    last_updated: string;
    accountOfficer: string;
    documents: {
        id: string;
        name: string;
        link: string;
        date: string;
        document_type: string;
    }[];
}

export interface OwnerHelpInfo {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}
