// store/notifications.ts
import { create } from "zustand";

// store/notification-store.ts
export type Notification = {
    id: string;
    type: "message";
    content_type: string,
    chatId: number;
    role: string;
    message: string;
    senderId: number;
    senderName: string;
    senderTier: number | string; // depends how tier comes back
    senderImage: string;
    createdAt: string;
};


interface NotificationState {
    notifications: Notification[];
    addNotification: (n: Notification) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (n) =>
        set((state) => ({ notifications: [n, ...state.notifications] })),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    clearAll: () => set({ notifications: [] }),
}));
