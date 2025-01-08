// staff/{id}/picture-update

import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const updateStaffPicture = async (id: string, payload: FormData) => {
    try {
        const { data } = await api.post(`staff/${id}/picture-update`, payload);
        toast.success(data?.message || "Update successful");
        return true;
    } catch (error) {
        handleAxiosError(error, "Failed to update staff picture");
        return false;
    }
};


export const updateStaffProfile = async (id: string, payload: FormData) => {
    payload.append("_method", "PATCH");
    try {
        const { data } = await api.post(`staff/${id}`, payload);
        toast.success(data?.message || "Update successful");
        // console.log(payload);
        return true;
    } catch (error) {
        handleAxiosError(error, "Failed to update staff profile");
        return false;
    }
};