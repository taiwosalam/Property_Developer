import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    picture: string | null;
    user_id: number | null;
    profile_id: number;
    branch_id: number | null;
    company_id: number;
}

export interface TenantData {
    tenants: Tenant[];
}

export interface TenantResponse {
    status: string;
    statusCode: number;
    data: TenantData;
    message: string;
}


export const initialTenants: Tenant[] = [
    {
        id: "",
        name: "",
        email: "",
        phone: "",
        picture: "",
        user_id: null,
        profile_id: 0,
        branch_id: null,
        company_id: 0,
    }
]

export const transformUnitsTenants = (res: TenantResponse): Tenant[] => {
    // console.log("res", res)
    return res?.data?.tenants?.map((t) => ({
        id: t.id.toString(),
        name: t.name,
        email: t.email,
        phone: t.phone,
        picture: t.picture,
        user_id: t.user_id,
        profile_id: t.profile_id,
        branch_id: t.branch_id,
        company_id: t.company_id,
    }));
};


export const startRent = async (data: any) => {
    try {
        const res = await api.post("/tenant-rent", data)
        if (res.data.status === "success") {
            return true
        }
    } catch (err) {
        handleAxiosError(err)
        return false
    }
}