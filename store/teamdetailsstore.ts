import { transformTeamDetails } from "@/app/(nav)/community/team-chat/[id]/data";
import { create } from "zustand";

// =============================
// 1. TYPES
// =============================
interface About {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string;
}

interface GroupMember {
    id: number;
    picture: string | null;
    fullname: string;
    role: string;
}

export interface IChatDetailsPage {
    about: About;
    group_members: GroupMember[];
}

// =============================
// 2. STORE
// =============================
interface TeamDetailsStore {
    teamDetails: IChatDetailsPage | null;
    setTeamDetails: (details: IChatDetailsPage) => void;
    clearTeamDetails: () => void;
}

export const useTeamDetailsStore = create<TeamDetailsStore>((set) => ({
    teamDetails: null,
    setTeamDetails: (details) => set({ teamDetails: details }),
    clearTeamDetails: () => set({ teamDetails: null }),
}));


export const saveTeamData = (data: any) => {
    const details = transformTeamDetails(data);
    useTeamDetailsStore.getState().setTeamDetails(details as IChatDetailsPage);
};




export interface GroupConversation {
    id: number;
    type: "group";
    name: string;
    avatar: string | null;
    participant_count: number | null;
    unread_count: number;
    latest_message: string;
    latest_message_type: string;
    latest_message_time: string;
    is_online: boolean;
    is_private: boolean;
    created_by: number | null;
}

interface GroupStore {
    groups: GroupConversation[];
    setGroups: (data: any) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
    groups: [],
    setGroups: (data) => {
        // Filter only group conversations
        const groupsOnly = data.conversation_data.filter(
            (c: any) => c.type === "group"
        );
        set({ groups: groupsOnly });
    },
}));

