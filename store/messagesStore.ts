"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import { useChatStore } from "@/store/message";
import { useGlobalStore } from "@/store/general-store";
import { getLocalStorage } from "@/utils/local-storage";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import {
    SendMessage,
    SendGroupMessage,
    transformCompanyUsersData,
    transformUsersMessages,
    blobToBase64,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import {
    CompanyUsersAPIResponse,
    ConversationsAPIResponse,
    PageMessages,
} from "@/app/(nav)/(messages-reviews)/messages/types";

interface MessageStore {
    // State
    usersData: any;
    messages: PageMessages[];
    filteredMessages: PageMessages[];
    searchQuery: string;
    selectedFilters: string[];
    selectedBranches: string[];
    message: string;
    reqLoading: boolean;
    audioUrl: string;
    usersMsgLoading: boolean;
    pageUsersMsg: PageMessages[];

    // Actions
    setUsersData: (data: any) => void;
    setMessages: (msgs: PageMessages[]) => void;
    setSearchQuery: (q: string) => void;
    setSelectedFilters: (f: string[]) => void;
    setSelectedBranches: (b: string[]) => void;
    setMessage: (m: string) => void;
    setReqLoading: (b: boolean) => void;
    setAudioUrl: (a: string) => void;
    setUsersMsgLoading: (loading: boolean) => void;
    setPageUsersMsg: (msgs: PageMessages[]) => void;
    initializeWithServerData: (serverData: { usersData?: any; messagesData?: any }) => void,
    // Business Logic
    applyFilters: () => void;
    initializeData: (usersData?: any, messagesData?: any) => void;
    handleSendMsg: (id: string) => Promise<void>;
    handleSendAudio: (id: string, blob: Blob | null, stopRecording?: VoidFunction) => Promise<void>;
    handleSendImage: (id: string, file: File) => Promise<void>;
    handleSendDocument: (id: string, file: File) => Promise<void>;
    refetchUsersMsg: () => void;
}

export const useMessageStore = create<MessageStore>()(
    devtools((set, get) => ({
        // Initial State
        usersData: null,
        messages: [],
        filteredMessages: [],
        searchQuery: "",
        selectedFilters: [],
        selectedBranches: [],
        message: "",
        reqLoading: false,
        audioUrl: "",
        usersMsgLoading: false,
        pageUsersMsg: [],

        initializeWithServerData: (serverData: { usersData?: any; messagesData?: any }) => {
            const loggedInUserId = getLocalStorage("user_id");
            const { setChatData } = useChatStore.getState();

            if (serverData.usersData) {
                const transformedUsers = transformCompanyUsersData(serverData.usersData);
                set({ usersData: serverData.usersData });
                setChatData("users", transformedUsers);
            }

            if (serverData.messagesData) {
                const transformed = transformUsersMessages(serverData.messagesData).filter(
                    (msg) => msg.id !== loggedInUserId
                );
                set({
                    messages: transformed,
                    pageUsersMsg: transformed,
                    usersMsgLoading: false, // Data is loaded
                });
                setChatData("users_messages", transformed);
                setTimeout(() => get().applyFilters(), 0);
            }
        },

        // Basic Setters
        setUsersData: (data) => set({ usersData: data }),
        setMessages: (msgs) => set({ messages: msgs }),
        setUsersMsgLoading: (loading) => set({ usersMsgLoading: loading }),
        setPageUsersMsg: (msgs) => set({
            pageUsersMsg: msgs,
        }, false, 'setPageUsersMsg'),


        // Setters with auto-filter trigger
        setSearchQuery: (q) => {
            set({ searchQuery: q });
            setTimeout(() => get().applyFilters(), 0);
        },
        setSelectedFilters: (f) => {
            set({ selectedFilters: f });
            setTimeout(() => get().applyFilters(), 0);
        },
        setSelectedBranches: (b) => {
            set({ selectedBranches: b });
            setTimeout(() => get().applyFilters(), 0);
        },

        // Simple setters
        setMessage: (m) => set({ message: m }),
        setReqLoading: (b) => set({ reqLoading: b }),
        setAudioUrl: (a) => set({ audioUrl: a }),

        // Initialize data from external sources
        initializeData: (usersData, messagesData) => {
            const loggedInUserId = getLocalStorage("user_id");
            const { setChatData } = useChatStore.getState();

            if (usersData) {
                const transformedUsers = transformCompanyUsersData(usersData);
                set({ usersData });
                setChatData("users", transformedUsers);
            }

            if (messagesData) {
                const transformed = transformUsersMessages(messagesData).filter(
                    (msg) => msg.id !== loggedInUserId
                );
                set({
                    messages: transformed,
                    pageUsersMsg: transformed,
                });
                setChatData("users_messages", transformed);
                setTimeout(() => get().applyFilters(), 0);
            }
        },

        // Filter Logic
        applyFilters: () => {
            const state = get();
            let filtered = [...state.pageUsersMsg];

            // Search filter
            if (state.searchQuery) {
                const lowerQuery = state.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (msg) =>
                        (msg.fullname?.toLowerCase() ?? "").includes(lowerQuery) ||
                        (msg.desc?.toLowerCase() ?? "").includes(lowerQuery)
                );
            }

            // Type and status filters
            if (state.selectedFilters.length > 0) {
                filtered = filtered.filter((msg) => {
                    const isInbox = state.selectedFilters.includes("Inbox") && msg.type !== "group";
                    const isGroups = state.selectedFilters.includes("Groups") && msg.type === "group";
                    const isUnread = state.selectedFilters.includes("Unread") && (msg.unread_count ?? 0) > 0;
                    return isInbox || isGroups || isUnread;
                });
            }

            // Branch filter
            if (state.selectedBranches.length > 0 && state.usersData) {
                const userIdsInBranches = state.usersData.data.users
                    .filter((user: any) => state.selectedBranches.includes(user.branch_id))
                    .map((user: any) => user.id);
                filtered = filtered.filter((msg) => userIdsInBranches.includes(msg.id));
            }

            set({ filteredMessages: filtered });
        },

        // Message Handlers
        handleSendMsg: async (id: string) => {
            const state = get();
            const isGroupChat = useGlobalStore.getState().isGroupChat;

            const payload = {
                content: state.message,
                content_type: "text",
                receiver_type: isGroupChat ? "group" : "user",
            };

            try {
                set({ reqLoading: true });
                const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
                const res = await sendFn(objectToFormData(payload), `${id}`);

                if (res) {
                    set({ message: "" });
                    get().refetchUsersMsg();
                }
            } catch (err) {
                toast.error("Failed to send msg");
            } finally {
                set({ reqLoading: false });
            }
        },

        handleSendAudio: async (id: string, recordedBlob: Blob | null, stopRecording?: VoidFunction) => {
            if (!recordedBlob) return;

            const isGroupChat = useGlobalStore.getState().isGroupChat;
            const audioFile = new File([recordedBlob], "voice-note.wav", {
                type: recordedBlob.type,
            });

            const payload = {
                [isGroupChat ? "file" : "content_file"]: audioFile,
                content_type: "audio",
                receiver_type: isGroupChat ? "group" : "user",
            };

            try {
                set({ reqLoading: true });
                const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
                const res = await sendFn(objectToFormData(payload), `${id}`);

                if (res) {
                    set({
                        audioUrl: "",
                        message: "",
                    });
                    stopRecording?.();
                    get().refetchUsersMsg();
                }
            } catch (err) {
                toast.error("Failed to send audio message");
            } finally {
                set({ reqLoading: false });
            }
        },

        handleSendImage: async (id: string, file: File) => {
            if (!file) return;

            const isGroupChat = useGlobalStore.getState().isGroupChat;

            try {
                set({ reqLoading: true });
                await blobToBase64(file); // Keep for potential future use

                const payload = {
                    [isGroupChat ? "file" : "content_file"]: file,
                    content_type: "file",
                    receiver_type: isGroupChat ? "group" : "user",
                };

                const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
                const res = await sendFn(objectToFormData(payload), `${id}`);

                if (res) {
                    get().refetchUsersMsg();
                }
            } catch (err) {
                toast.error("Failed to send image");
            } finally {
                set({ reqLoading: false });
            }
        },

        handleSendDocument: async (id: string, file: File) => {
            if (!file) return;

            const isGroupChat = useGlobalStore.getState().isGroupChat;

            try {
                set({ reqLoading: true });
                const base64Doc = await blobToBase64(file);

                const payload = {
                    [isGroupChat ? "content" : "content_file"]: isGroupChat ? base64Doc : file,
                    content_type: "file",
                    receiver_type: isGroupChat ? "group" : "user",
                };

                const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
                const res = await sendFn(objectToFormData(payload), `${id}`);

                if (res) {
                    get().refetchUsersMsg();
                }
            } catch (err) {
                toast.error("Failed to send document");
            } finally {
                set({ reqLoading: false });
            }
        },

        // Utility
        refetchUsersMsg: () => {
            // Dispatch events for external refetch handling
            window.dispatchEvent(new Event("refetch-users-msg"));
            window.dispatchEvent(new Event("refetchMessages"));
        },
    })),

)


// // Convenience selectors for optimized subscriptions
// export const UseMessageSelectors = {
//     // Individual selectors to prevent unnecessary re-renders
//     usersData: () => useMessageStore((state) => state.usersData),
//     messages: () => useMessageStore((state) => state.messages),
//     filteredMessages: () => useMessageStore((state) => state.filteredMessages),
//     searchQuery: () => useMessageStore((state) => state.searchQuery),
//     selectedFilters: () => useMessageStore((state) => state.selectedFilters),
//     selectedBranches: () => useMessageStore((state) => state.selectedBranches),
//     message: () => useMessageStore((state) => state.message),
//     reqLoading: () => useMessageStore((state) => state.reqLoading),
//     audioUrl: () => useMessageStore((state) => state.audioUrl),
//     usersMsgLoading: () => useMessageStore((state) => state.usersMsgLoading),
//     pageUsersMsg: () => useMessageStore((state) => state.pageUsersMsg),

//     // Combined selectors for related state
//     loadingState: () => useMessageStore((state) => ({
//         reqLoading: state.reqLoading,
//         usersMsgLoading: state.usersMsgLoading,
//     })),

//     filterState: () => useMessageStore((state) => ({
//         searchQuery: state.searchQuery,
//         selectedFilters: state.selectedFilters,
//         selectedBranches: state.selectedBranches,
//     })),
// };

// // Actions-only selector for components that only need actions
// export const useMessageActions = () => useMessageStore((state) => ({
//     setUsersData: state.setUsersData,
//     setMessages: state.setMessages,
//     setSearchQuery: state.setSearchQuery,
//     setSelectedFilters: state.setSelectedFilters,
//     setSelectedBranches: state.setSelectedBranches,
//     setMessage: state.setMessage,
//     setReqLoading: state.setReqLoading,
//     setAudioUrl: state.setAudioUrl,
//     setUsersMsgLoading: state.setUsersMsgLoading,
//     setPageUsersMsg: state.setPageUsersMsg,
//     applyFilters: state.applyFilters,
//     initializeData: state.initializeData,
//     handleSendMsg: state.handleSendMsg,
//     handleSendAudio: state.handleSendAudio,
//     handleSendImage: state.handleSendImage,
//     handleSendDocument: state.handleSendDocument,
//     refetchUsersMsg: state.refetchUsersMsg,
// }));