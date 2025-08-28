import { useCallback, useEffect, useMemo, useState } from "react";
import { groupMessagesByDay, isDirectChatResponse, isGroupChatResponse, NormalizedMessage, transformMessageFromAPI, transformMessagesFromAPI, transformNewMessageVariant } from "./data";
import { ReadEvent } from "./types";
import { useEcho } from "@/lib/echo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base_url } from "@/app/(onboarding)/auth/data";
import { saveTeamData, useGroupStore } from "@/store/teamdetailsstore";

export const useChatMessages = (id: string, isGroupChat: boolean) => {
    const [messages, setMessages] = useState<NormalizedMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Single source of truth for messages
    const groupedMessages = useMemo(() =>
        groupMessagesByDay(messages), [messages]
    );

    return { messages, setMessages, groupedMessages, isLoading, setIsLoading, error, setError };
};


export const useEchoMessages = (
    id: string,
    onNewMessage: (message: NormalizedMessage) => void,
    onMessagesRead: (messageIds: number[]) => void,
    isGroupChat: boolean,
    isTeamchat?: boolean
) => {

    // console.log({ isGroupChat })
    const { echo, isConnected } = useEcho();
    const token = localStorage.getItem("user_id");
    const { setGroups } = useGroupStore();

    useEffect(() => {
        if (!echo || !isConnected || !id || !token) return;
        let channel: any;
        try {
            const channel = isGroupChat
                ? echo.private(`group-chat.${id}`)
                : echo.private(`user.${token}`);
            const channel2 = echo.private(`user.${token}`);
            // const channel = echo.private(`user.${token}`);
            console.log(`Connected to ${isGroupChat ? 'group' : 'user'}`);
            const handleMessageReceived = (data: any) => {
                const event = new CustomEvent("refetch-users-msg", {
                    detail: data,
                });
                window.dispatchEvent(event);
                if (data.sender_id === Number(id)) {
                    console.log("message receoved", { id })
                    const cleanedMessage = transformMessageFromAPI(data, false);
                    onNewMessage(cleanedMessage);
                }
            };
            const handleMessagesRead = (data: ReadEvent) => {
                onMessagesRead(data.message_ids);
            };
            const handleMessageSent = (data: any) => {
                console.log({ isGroupChat, id }, "id:", Number(id) === data.group_chat_id, "group id", data.group_chat_id)
                if (isGroupChat && data.data.group_chat_id !== Number(id)) return
                const dataToPass = isGroupChat ? data.data : data
                const cleanedMessage = transformMessageFromAPI(dataToPass, isGroupChat ? true : false);
                onNewMessage(cleanedMessage);
            };

            const handleGroupMessageRecieved = (data: any) => {
                if (isGroupChat && data.data.group_chat_id !== Number(id)) return
                const dataToPass = isGroupChat ? data.data : data;

                const cleanedMessage = transformNewMessageVariant(dataToPass, isGroupChat);
                onNewMessage(cleanedMessage);
            };
            channel.listen('.message.received', handleMessageReceived);
            channel2.listen('.conversation.updated', (data: any) => {
                console.log("event received")
                setGroups(data)
            });
            channel.listen('.chat.message', handleGroupMessageRecieved);
            // channel.listen('.chat.sent', (data: any) => console.log("whats happening", { data }));
            channel.listen('.chat.received', (data: any) => console.log("whats happening", { data }));
            channel.listen('.messages.read', handleMessagesRead);
            channel.listen('.message.sent', handleMessageSent);
            channel.listen('.conversation.created', (data: any) => console.log("conversation created", { data }));


        } catch (error) {
            console.error('Error setting up Echo channel:', error);
        }

        return () => {
            if (channel) {
                channel.stopListening('.message.received');
                channel.stopListening('.messages.read');
                channel.stopListening('.message.sent');
                echo.leave(`user.${token}`);
            }
        };
    }, [echo, isConnected, id, token, onNewMessage, onMessagesRead, isGroupChat]);
};


export const useApiData = (endpoint: string, id: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(endpoint, {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Failed to fetch');

                const result = await response.json();

                // Only update if this request is for the current ID
                if (!controller.signal.aborted) {
                    setData(result);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [endpoint, id]);

    return { data, loading, error };
};


export const chatKeys = {
    all: ["chats"] as const,
    messages: (id: string, isGroupChat: boolean) =>
        ["chats", "messages", id, isGroupChat] as const,
    userProfile: (id: string) => ["chats", "profile", id] as const,
};

// Fetch functions
export const fetchChatMessages = async (id: string, isGroupChat: boolean): Promise<{ normalizedMessages: NormalizedMessage[], api: any }> => {
    const endpoint = isGroupChat ? `group-chats/${id}` : `messages/conversations/${id}`;
    const authToken = localStorage.getItem('authToken')
    const strippedToken = authToken ? authToken.replace(/^['"]|['"]$/g, "") : "";
    const response = await fetch(`${base_url}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${strippedToken}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    const data = await response.json();
    let normalizedMessages: NormalizedMessage[] = [];
    if (isGroupChat && isGroupChatResponse(data.data)) {
        if (String(data.data.group_chat?.id) === String(id)) {
            const msgs = transformMessagesFromAPI(data.data, true);
            normalizedMessages = Array.isArray(msgs) ? msgs : [];
        }
    } else if (!isGroupChat && isDirectChatResponse(data)) {
        const msgs = transformMessagesFromAPI(data, false);
        normalizedMessages = Array.isArray(msgs) ? msgs : [];
    }
    return { normalizedMessages, api: data.data };
};

export const fetchUserProfile = async (id: string) => {
    const authToken = localStorage.getItem('authToken')
    const strippedToken = authToken ? authToken.replace(/^['"]|['"]$/g, "") : "";
    console.log(authToken)
    const response = await fetch(`${base_url}all-users?identifier=${id}`, {
        headers: {
            'Authorization': `Bearer ${strippedToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    return data?.data;
};

export const useChatMessagesQuery = (id: string, isGroupChat: boolean) => {
    const key = chatKeys.messages(String(id), isGroupChat)
    console.log("pretecging keys", key)
    const {
        data: messages,
        isLoading,
        isPending,
        error,
        refetch
    } = useQuery({
        queryKey: chatKeys.messages(String(id), isGroupChat),
        queryFn: () => fetchChatMessages(id, isGroupChat),
        enabled: !!id,
        staleTime: 60 * 1000,
        initialData: { api: null, normalizedMessages: [] },
        // cacheTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        // refetchInterval: 60 * 1000, // Background refresh
        refetchIntervalInBackground: false,
    });

    return {
        messages,
        isPending,
        isLoading,
        error: error as Error | null,
        refetch,
    };
};

// Hook for user profile with prefetch
export const useUserProfile = (id: string) => {
    const {
        data: profile,
        isLoading: loading,
        error
    } = useQuery({
        queryKey: chatKeys.userProfile(id),
        queryFn: () => fetchUserProfile(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        // cacheTime: 10 * 60 * 1000,
    });

    return { profile, loading, error };
};

export const useChatPrefetch = () => {
    const queryClient = useQueryClient();
    const prefetchChatMessages = useCallback((chatId: string, isGroupChat: boolean) => {
        const key = chatKeys.messages(chatId, isGroupChat)
        console.log("pretecging keys", key)
        queryClient.prefetchQuery({
            queryKey: chatKeys.messages(String(chatId), isGroupChat),
            queryFn: () => fetchChatMessages(chatId, isGroupChat),
            staleTime: 60 * 1000, // Consider fresh for 30 seconds
            // cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        });
    }, [queryClient]);

    const prefetchUserProfile = useCallback((userId: string) => {
        queryClient.prefetchQuery({
            queryKey: chatKeys.userProfile(userId),
            queryFn: () => fetchUserProfile(userId),
            staleTime: 60 * 60 * 1000, // User profiles change less frequently
            // cacheTime: 10 * 60 * 1000,
        });
    }, [queryClient])
    const prefetchTopChats = useCallback((chats: Array<{ id: string, isGroupChat: boolean }>) => {
        // Prefetch top 3 chats
        chats.slice(0, 3).forEach(chat => {
            prefetchChatMessages(chat.id, chat.isGroupChat);
            if (!chat.isGroupChat) {
                prefetchUserProfile(chat.id);
            }
        });
    }, [prefetchChatMessages, prefetchUserProfile]);

    return {
        prefetchChatMessages,
        prefetchUserProfile,
        prefetchTopChats
    }
}