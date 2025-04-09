import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const getTenant = async(id: string) => {
  try{
    const res = await api.get(`/tenant/${id}`);
    if (res.status === 200){
      return res.data
    }
  }catch(err){
    handleAxiosError(err)
  }
}