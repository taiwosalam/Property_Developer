import { empty } from "@/app/config";
import { UsersProps } from "./types";

export const users_data: UsersProps[] = [
    { id: "1", name: "", imageUrl: "", position: "" },
    //   { id: "2", name: "Dada Teniola Emmanuel", imageUrl: "/empty/SampleLandlord.jpeg", position: "Staff" },
    //   { id: "3", name: "Abdulrafiu Mubi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Director" },
    //   { id: "4", name: "Aisha Oladimeji", imageUrl: "/empty/SampleLandlord.jpeg", position: "Account Officer" },
    //   { id: "5", name: "Oluwaseun Olorunyomi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Branch Manager" },
    //   { id: "6", name: "Opeyemi Olorunfemi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Staff" },
    //   { id: "7", name: "Aisha Oladimeji", imageUrl: "/empty/SampleLandlord.jpeg", position: "Director" },
    //   { id: "8", name: "Oluwaseun Olorunyomi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Account Officer" },
    //   { id: "9", name: "Opeyemi Olorunfemi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Branch Manager" },
    //   { id: "10", name: "Oluwaseun Olorunyomi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Staff" },
    //   { id: "11", name: "Opeyemi Olorunfemi", imageUrl: "/empty/SampleLandlord.jpeg", position: "Director" },
    //   { id: "12", name: "Aisha Oladimeji", imageUrl: "/empty/SampleLandlord.jpeg", position: "Account Officer" },
];

export const initialData = {
    users: users_data,
    filters: {
        roles: {
            director: 0,
            staff: 0,
            account: 0,
            manager: 0
        },
        branches: [
            { id: 0, name: "" },
        ]
    }
}

export interface MessageUserPageTypes {
    users: UsersProps[],
    filters: {
        roles: {
            director: number,
            staff: number,
            account: number,
            manager: number
        },
        branches: {
            id: number,
            name: string
        }[]
    }
}

export const transformCompanyUsersData = (
    res: CompanyUsersAPIResponse
): MessageUserPageTypes => {
    return {
        users: res.data.users.map((u) => ({
            id: u.id,
            name: u.name,
            imageUrl: u.profile_picture || empty,
            position: u.role
        })),
        filters: {
            roles: {
                director: res.data.filters.roles.director,
                staff: res.data.filters.roles.staff,
                account: res.data.filters.roles.account,
                manager: res.data.filters.roles.manager
            },
            branches: res.data.filters.branches
        }
    }
}


export interface User {
    id: string;
    name: string;
    profile_picture: string | null;
    role: string;
}

export interface RoleFilters {
    director: number;
    staff: number;
    account: number;
    manager: number;
}

export interface Branch {
    id: number;
    name: string;
}

export interface Filters {
    roles: RoleFilters;
    branches: Branch[];
}

export interface CompanyUsersAPIResponse {
    data: {
        users: User[];
        filters: Filters;
    }
}


export const positionMap: Record<string, string> = {
    "Branch Manager": "manager",
    "Account Officer": "account",
    "Staff": "staff",
    "Director": "director",
    "Landlord/Landlady": "landlord",
    "Tenant/Occupants": "tenant",
    "Service Provider": "provider"
};