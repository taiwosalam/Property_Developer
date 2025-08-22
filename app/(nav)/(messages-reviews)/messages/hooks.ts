import { useEffect, useMemo, useState } from "react";
import { groupMessagesByDay, NormalizedMessage, transformMessageFromAPI } from "./data";
import { ReadEvent } from "./types";
import { useEcho } from "@/lib/echo";

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
    isGroupChat: boolean
) => {

    // console.log({ isGroupChat })
    const { echo, isConnected } = useEcho();
    const token = localStorage.getItem("user_id");

    useEffect(() => {
        if (!echo || !isConnected || !id || !token) return;
        let channel: any;
        try {
            // const channel = isGroupChat
            //     ? echo.private(`group-chat.${id}`)
            //     : echo.private(`user.${token}`);
            const channel = echo.private(`user.${token}`);
            console.log(`Connected to ${isGroupChat ? 'group' : 'user'}`);
            const handleMessageReceived = (data: any) => {
                if (data.sender_id === Number(id)) {
                    const cleanedMessage = transformMessageFromAPI(data, false);
                    onNewMessage(cleanedMessage);
                }
            };
            const handleMessagesRead = (data: ReadEvent) => {
                console.log("passing data here", { data })
                onMessagesRead(data.message_ids);
            };
            const handleMessageSent = (data: any) => {
                if (isGroupChat && data.group_chat_id !== Number(id)) return
                console.log("data from the group chat", { data })
                const cleanedMessage = transformMessageFromAPI(data, isGroupChat ? true : false);
                onNewMessage(cleanedMessage);
            };
            channel.listen('.message.received', handleMessageReceived);
            channel.listen('.chat.sent', handleMessageSent);
            // channel.listen('.chat.sent', (data: any) => console.log("whats happening", { data }));
            channel.listen('.chat.received', (data: any) => console.log("whats happening", { data }));
            channel.listen('.messages.read', handleMessagesRead);
            channel.listen('.message.sent', handleMessageSent);

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
