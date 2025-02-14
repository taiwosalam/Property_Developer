import { empty } from "@/app/config";
import { CompanyUsersAPIResponse, ConversationsAPIResponse, PageMessages, UsersProps } from "./types";
import api, { handleAxiosError } from "@/services/api";
import moment from "moment";
import {
    AudioIcon,
    CancelIcon,
    ChevronLeft,
    DocumentIcon,
    EmojiIcon,
    GalleryIcon,
} from '@/public/icons/icons';

export const users_data: UsersProps[] = [
    { id: "1", name: "", imageUrl: "", position: "" },
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
            staff_id: u.staff_id,
            branch_id: u.branch_id,
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

export const transformUsersMessages = (
    data: ConversationsAPIResponse | null | undefined
): PageMessages[] => {
    // console.log("data got", data)
    if (!data || !data.conversations) return []; // Ensure data exists

    return data.conversations.map((c) => {
        let finalContentType = 'text'; // Default to 'text'

        if (c.latest_message_type !== 'text') {
            // If it's a file, check the file extension.
            const extension = c.latest_message.split('.').pop()?.toLowerCase() || '';
            if (['mp3', 'wav', 'ogg', 'webm'].includes(extension)) {
                finalContentType = 'audio';
            } else if (['mp4', 'avi', 'mov'].includes(extension)) {
                finalContentType = 'video';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                finalContentType = 'image';
            } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
                finalContentType = 'document';
            } else {
                // Fallback for unrecognized file types.
                finalContentType = 'file';
            }
        }

        return {
            id: c.participant_id,
            pfp: c.profile_picture,
            desc: c.latest_message,
            time: c.latest_message_time,
            fullname: c.participant_name,
            messages: c.unread_count,
            verified: false, // change later
            content_type: finalContentType,
            // content_type: c.latest_message_type,
            unread_count: c.unread_count,
        };
    });
};


export const sumUnreadCount = (data: any[]) =>
    data.reduce((total, item) => total + item.unread_count, 0);

// export const roundUptoNine = (num: number): string => (num > 9 ? "9+" : num.toString());
export const roundUptoNine = (num: number): string => {
    if (Number.isNaN(num)) return "0"; // or another fallback value
    return num > 9 ? "9+" : num.toString();
};


export const formatMessageText = (message: string) => {
    return message.replace(/(?:\r\n|\r|\n)/g, "<br />");
};

type IconComponent = () => JSX.Element;
export const getIconByContentType = (contentType: string) => {
    const iconMap: Record<string, IconComponent | null> = {
        audio: AudioIcon,
        video: GalleryIcon,
        image: GalleryIcon,
        document: DocumentIcon,
    };
    if (contentType === 'text' || !iconMap[contentType]) {
        return null;
    }
    return iconMap[contentType];
};

export const transformMessages = (data: any) => {
    if (!data) return [];
    return data
        .map((d: any) => ({
            id: d.id,
            details: [
                {
                    text: d.content,
                    sender_id: Number(d.sender_id),
                    time: moment(d.timestamp).format("hh:mm A"),
                },
            ],
            day: moment(d.timestamp).calendar(),
            // Include a numeric timestamp for sorting
            timestamp: new Date(d.timestamp).getTime(),
        }))
        .sort((a: any, b: any) => a.timestamp - b.timestamp);
};


export const groupMessagesByDay = (data: any[]) => {
    // console.log("data", data)
    if (!data || !data.length) return [];

    // Sort messages by timestamp in ascending order.
    const sorted = [...data].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Reduce the sorted messages into groups based on day.
    const groups = sorted.reduce((acc, message) => {
        // Use 'YYYY-MM-DD' for grouping.
        const dayKey = moment(message.timestamp).format('YYYY-MM-DD');
        // Use calendar format for display (e.g., "Today", "Yesterday", etc.).
        const displayDay = moment(message.timestamp).calendar();

        if (!acc[dayKey]) {
            acc[dayKey] = { day: displayDay, messages: [] };
        }

        // Determine the appropriate content type.
        let finalContentType = message.content_type;
        let contentDisplay = message.content;

        if (message.content_type !== 'text') {
            // If it's a file, check the file extension.
            if (message.content_type === 'file') {
                const extension = message.content.split('.').pop()?.toLowerCase() || '';
                if (['mp3', 'wav', 'ogg'].includes(extension)) {
                    finalContentType = 'audio';
                } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
                    finalContentType = 'video';
                } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                    finalContentType = 'image';
                } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
                    finalContentType = 'document';
                } else {
                    // Fallback for unrecognized file types.
                    finalContentType = 'file';
                }
            }
        }

        // Push the transformed message details.
        acc[dayKey].messages.push({
            id: message.id,
            text: contentDisplay,
            sender_id: Number(message.sender_id),
            time: moment(message.timestamp).format("hh:mm A"),
            content_type: finalContentType,
            seen: message.read_at,
        });

        return acc;
    }, {} as Record<string, { day: string; messages: any[] }>);

    // Convert the groups object into an array.
    return Object.values(groups);
};



export const positionMap: Record<string, string> = {
    "Branch Manager": "manager",
    "Account Officer": "account",
    "Staff": "staff",
    "Director": "director",
    "Landlord/Landlady": "landlord",
    "Tenant/Occupants": "tenant",
    "Service Provider": "provider"
};

// /messages/conversation/8/send
export const SendMessage = async (data: FormData, id: string) => {
    try {
        const res = await api.post(`/messages/${id}/send`, data)
        if (res.status === 200) {
            // console.log("response", res)
            return true
        }
    } catch (err) {
        handleAxiosError(err)
        return false
    }
}


// Helper to convert audio to FormData
export const convertToFormData = (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "voice-note.wav");
    formData.append("content_type", "audio");
    formData.append("receiver_type", "user");
    return formData;
};