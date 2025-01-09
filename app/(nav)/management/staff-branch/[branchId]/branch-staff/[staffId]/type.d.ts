import { StaffProfilePortfolioProps } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";

export interface StaffAPIResponse {
    data: {
        id: string;
        title: string;
        real_estate_title: string;
        name: string;
        email: string;
        phone: string;
        username: string;
        gender: string;
        position: string;
        state: string;
        local_government: string;
        address: string;
        picture: string;
        user_id: string;
        branch_id: string;
        company_id: string;
        created_at: string;
        updated_at: string;
        about_staff: string;
    };
    activities: StaffActivitiies[];
}

export interface StaffActivitiies{
    "S/N"?: number;
    id?: number;
    username: string; 
    page_visits: string; 
    action_taken: string; 
    ip_address: string;
    location: LocationObj; 
    date: string; 
    time: string; 
}

interface LocationObj{
    latitude: number;
    longitude: number;
}

export interface StaffPageTypes {
    staff: {
        id: string;
        title: string;
        real_estate_title: string;
        name: string;
        email: string;
        phone: string;
        username: string;
        gender: string;
        position: string;
        state: string;
        local_government: string;
        address: string;
        picture: string;
        user_id: string;
        branch_id: string;
        company_id: string;
        created_at: string;
        updated_at: string;
        about_staff: any;
    },
    activities: StaffActivitiies[],
    chats: [],
    portfolio: StaffProfilePortfolioProps[],  
}
