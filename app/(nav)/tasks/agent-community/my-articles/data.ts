// Imports
import { CommentData } from "@/components/tasks/announcements/comment";
import api from "@/services/api";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const transformFormArticleData = (formData: FormData) => {
  const data: Record<string, any> = {
    title: formData.get("title"),
    content: formData.get("content"),
    target_audience: [formData.get("target_audience")], 
    pictures: formData.getAll("pictures"),
    video_link: formData.get("video_link")
  };
  return data;
};

export const createArticle = async (formData: FormData) => {
  try {
    const response = await api.post("/agent_community", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error creating article:", error);
    return false;
  }
};

export const toggleLike = async (slug: string, type: 1 | -1) => {
  try {
    const response = await api.post(`/agent_community/${slug}/toggle-like`, { type });
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error toggling like:", error);
    return false;
  }
};

export const getMyArticlesDetails = async (slug: string) => {
  try {
    const response = await api.get(`/agent_community/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my articles details:", error);
    throw error;
  }
};


export const deleteMyArticle = async (slug: string) => {
  try {
    const response = await api.delete(`/agent_community/${slug}`);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error deleting my article:", error);
    return false;
  }
};

export const updateMyArticle = async (id: number, formData: any) => {
 console.log("id", id);
  try {
    let formDataObject: any = {};
    
    // Check if formData is a FormData object
    if (formData instanceof FormData) {
      formData.forEach((value: FormDataEntryValue, key: string) => {
        if (key === 'target_audience') {
          formDataObject[key] = value.toString().split(',').map(item => item.trim());
        } else {
          formDataObject[key] = value;
        }
      });
    } else {
      // If formData is already an object, process it directly
      formDataObject = { ...formData };
      if (formDataObject.target_audience && typeof formDataObject.target_audience === 'string') {
        formDataObject.target_audience = formDataObject.target_audience.split(',').map((item: string) => item.trim());
      }
    }
    
    console.log('formDataObject', formDataObject);
    const response = await api.put(`/agent_community/${id}`, formDataObject);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const messages = error.response.data?.errors?.messages;
      const messagesArray = messages ? Object.values(messages) as string[][] : [];
      const firstErrorMessage = messagesArray[0]?.[0];
      console.log("error message:", firstErrorMessage);
      const errorMessage = firstErrorMessage || "Failed to update article. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
}

export const sendMyArticleComment = async (slug: string, content: string) => {
  try {
    const response = await api.post(`/agent_community/${slug}/comment`, { content });
    // return response.data;
    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    } else {
      toast.error("Error sending comment:");
    }
    // console.error("Error sending comment:", error);
    return false
    // throw error;
  }
}


export const sendMyArticleReply = async (slug: string, commentId: string, content: string) => {
  try {
    const response = await api.post(`/agent_community/${slug}/comment/${commentId}/reply`, { content });
    return true
    // return response.data;
  } catch (error) {
    return false
    // console.error("Error sending reply:", error);
    // throw error;
  }
}

export const getArticleComments = async (slug: string) => {
  try {
    const response = await api.get(`/agent_community/${slug}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching article comments:", error);
    throw error;
  }
}