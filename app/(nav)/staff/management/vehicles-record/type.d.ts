export interface Property {
    id: number;
    images: string[];
    full_address: string;
    title: string;
    units_count: number;
    vehicle_records_count: number;
}

export interface Stats {
    total_properties: number;
    properties_this_month: number;
    total_vehicle_records: number;
    vehicle_records_this_month: number;
    current_page: number;
    last_page: number;
}

export interface VehicleRecordAPIRes {
    properties: {
        data: Property[];
    }
    stats: Stats;
}

export interface VehicleRecordData {
    data: {
        id: string;
        images: any[];
        property_name: string;
        units_count: number;
        address: string;
        total_unit_pictures: number;
        hasVideo: boolean;
        property_type: string;
        total_returns: number;
        total_income: number;
        branch: string;
        accountOfficer: string;
        last_updated: string;
        mobile_tenants: number;
        web_tenants: number;
        owing_units: number;
        available_units: number;
        currency: string;
        isClickable: number;
        viewOnly: number;
    }
  }

export interface initialPageState{
    data: VehicleRecordData[];
    stats: Stats;
}

export interface VehicleRecordParams{
    search?: string;
    sort?: 'asc' | 'desc'
    page?: number;
    all?: boolean;
    recent?: boolean;
    state?: string;
    trending?: boolean;
    start_date?: string;
    end_date?: string;
  }
  