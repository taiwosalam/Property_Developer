import api, { handleAxiosError } from "@/services/api";

// 1/group-chats/7/messages
export const sendGroupMessage = async (data: FormData, groupId: string) => {
    try {
      const response = await api.post(
        `group-chats/${groupId}/messages`, data
      );
      if (response.status === 200 || response.status === 201) {
        window.dispatchEvent(new Event("refetch_team_chat"));
        console.log(response);
        return response;
      }
    } catch (error) {
      handleAxiosError(error);
      return false;
    }
  };