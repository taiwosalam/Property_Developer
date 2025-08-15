import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { initializeEcho } from "@/lib/echo";

export default function useChatListener(
  userId: string | null,
  onMessage: (event: any) => void
) {
  useEffect(() => {
    if (!userId) {
      console.log("useChatListener skipped: no userId");
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      console.log("useChatListener skipped: no token");
      return;
    }

    const echo = initializeEcho();
    if (!echo) return;

    const channel = echo.private(`user.${userId}`);

    channel.listen(".participant.messages.retrieved", (event: any) => {
      console.log("🔔 New chat message received on user.", userId, ":", event);
      onMessage(event);
    });

    return () => {
      console.log("Stopping listener for user.", userId);
      channel.stopListening(".participant.messages.retrieved");
      // Avoid disconnecting echo to allow other listeners
    };
  }, [userId, onMessage]);
}
