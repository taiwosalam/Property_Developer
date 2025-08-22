"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/store/notification-store";
import Image from "next/image";
import { NotificationMessageIcon } from "@/public/icons/icons";
import { capitalizeName, hexToRgba } from "@/lib/utils";
import { useSoundPreference } from "@/hooks/useGetSound";
import { useMessageUser } from "@/hooks/useCardNotis";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { roleBasedRoutes } from "@/data";
import {
  notification_icons,
  notification_links,
} from "@/components/Notification/data";
import { useRole } from "@/hooks/roleContext";
import { getRoleBasedRoute } from "@/components/Notification/notification";
import { useRouter } from "next/navigation";
import { clearAllNotification } from "@/app/(nav)/notifications/data";

// Updated sound hook that respects browser autoplay policies
function usePersistentSoundEffect() {
  const { notifications } = useNotificationStore();
  const { selectedSound } = useSoundPreference();
  const { audioEnabled } = useAudioPermission(); // Add this line
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const soundQueueRef = useRef<Array<{ url: string; id: string }>>([]);
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Safe localStorage access
  const getSavedSound = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferredSound") || selectedSound;
    }
    return selectedSound;
  }, [selectedSound]);

  const playNextSound = useCallback(() => {
    // Don't play if audio is not enabled
    if (!audioEnabled) {
      console.log("🔇 Audio not enabled, skipping sound queue");
      soundQueueRef.current = []; // Clear queue
      isPlayingRef.current = false;
      return;
    }

    if (soundQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const soundItem = soundQueueRef.current.shift();
    if (!soundItem) return;

    // Clean up previous audio
    if (currentAudioRef.current) {
      currentAudioRef.current.removeEventListener("ended", playNextSound);
      currentAudioRef.current.removeEventListener("error", playNextSound);
      currentAudioRef.current = null;
    }

    const audio = new Audio(soundItem.url || getSavedSound());
    currentAudioRef.current = audio;

    // Set audio properties
    audio.preload = "auto";
    audio.volume = 0.7;

    const handleEnded = () => {
      setTimeout(() => {
        playNextSound();
      }, 200);
    };

    const handleError = (error: Event) => {
      console.warn(
        "Error playing sound for notification:",
        soundItem.id,
        error
      );
      setTimeout(() => {
        playNextSound();
      }, 100);
    };

    audio.addEventListener("ended", handleEnded, { once: true });
    audio.addEventListener("error", handleError, { once: true });

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(
            "🔊 Sound played successfully for notification:",
            soundItem.id
          );
        })
        .catch((error) => {
          console.warn("Failed to play notification sound:", error);
          if (error.name === "NotAllowedError") {
            console.log(
              "🔇 Autoplay still blocked - user needs to enable sounds"
            );
          }
          setTimeout(() => {
            playNextSound();
          }, 100);
        });
    }
  }, [getSavedSound, audioEnabled]); // Add audioEnabled dependency

  const queueSound = useCallback(
    (soundUrl: string, notificationId: string) => {
      // Only queue sounds if audio is enabled
      if (!audioEnabled) {
        console.log(
          "🔇 Audio not enabled, not queueing sound for:",
          notificationId
        );
        return;
      }

      const finalSoundUrl = soundUrl || getSavedSound();
      if (!finalSoundUrl) return;

      soundQueueRef.current.push({
        url: finalSoundUrl,
        id: notificationId,
      });

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        setTimeout(playNextSound, 50);
      }
    },
    [playNextSound, getSavedSound, audioEnabled]
  ); // Add audioEnabled dependency

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!processedNotificationsRef.current.has(notification.id)) {
        processedNotificationsRef.current.add(notification.id);
        queueSound(selectedSound, notification.id);
      }
    });

    // Cleanup processed notifications that no longer exist
    const currentIds = new Set(notifications.map((n) => n.id));
    const processedIds = Array.from(processedNotificationsRef.current);

    processedIds.forEach((id) => {
      if (!currentIds.has(id)) {
        processedNotificationsRef.current.delete(id);
      }
    });
  }, [notifications, selectedSound, queueSound]);

  // Clear sound queue when audio becomes disabled
  useEffect(() => {
    if (!audioEnabled) {
      soundQueueRef.current = [];
      isPlayingRef.current = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    }
  }, [audioEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.removeEventListener("ended", playNextSound);
        currentAudioRef.current.removeEventListener("error", playNextSound);
      }
      soundQueueRef.current = [];
      isPlayingRef.current = false;
    };
  }, []);
}

// Add this to your app to handle browser autoplay restrictions
function useAudioPermission() {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const enableAudio = useCallback(async () => {
    try {
      // Create a silent audio to test and enable audio context
      const audio = new Audio();
      audio.volume = 0;
      audio.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Lttm0gBjiN1e7RfS4GM3DA6tyHLgIcbJ3rg";

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        audio.pause();
        setAudioEnabled(true);
        console.log("Audio enabled successfully");
      }
    } catch (error) {
      console.warn("Audio permission not granted:", error);
      setAudioEnabled(false);
    }
  }, []);

  // Try to enable audio on any user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioEnabled) {
        enableAudio();
      }
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [audioEnabled, enableAudio]);

  return { audioEnabled, enableAudio };
}

export default function NotificationPortal() {
  const { notifications, removeNotification } = useNotificationStore();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { audioEnabled } = useAudioPermission(); // Add this

  // Always run sound effect regardless of component mount state
  usePersistentSoundEffect();

  // Fixed timer logic
  useEffect(() => {
    // Set timers for new notifications
    notifications.forEach((notification) => {
      if (!timersRef.current.has(notification.id)) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
          timersRef.current.delete(notification.id); // Clean up the timer reference
        }, 5000);
        timersRef.current.set(notification.id, timer);
      }
    });

    // Clean up timers for removed notifications
    const currentNotificationIds = new Set(notifications.map((n) => n.id));
    timersRef.current.forEach((timer, id) => {
      if (!currentNotificationIds.has(id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });

    // Cleanup function
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [notifications, removeNotification]);

  const handleMouseEnter = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const handleMouseLeave = useCallback(
    (id: string) => {
      if (!timersRef.current.has(id)) {
        const timer = setTimeout(() => {
          removeNotification(id);
          timersRef.current.delete(id);
        }, 5000);
        timersRef.current.set(id, timer);
      }
    },
    [removeNotification]
  );
  const handleDeleteNotifications = async (id: string) => {
    console.log(id);
    try {
      const res = await clearAllNotification([id]);
      if (res) {
        //toast.success("Notifications Cleared");
      }
    } catch (error) {
      //console.error(error);
    }
  };

  // Show only the latest notification
  const { role } = useRole();
  const router = useRouter();
  const latestNotification = notifications[notifications.length - 1];
  const route = notification_links[latestNotification?.type.toLowerCase()];
  const roleRoute = getRoleBasedRoute(route, role);
  const { IconComponent, isGroupChat, isOnline, badgeColor, handleClick } =
    useMessageUser({
      id: latestNotification?.senderId,
      fullname: latestNotification?.senderName,
      pfp: latestNotification?.senderImage,
      last_seen: "now",
      content_type: latestNotification?.content_type,
      type: latestNotification?.type,
      role: latestNotification?.role,
      tier: latestNotification?.senderTier as number,
      ...(latestNotification?.type !== "message" && {
        onClick: () => {
          console.log("role route", { roleRoute });
          router.push(roleRoute);
          console.log("helll there ISD FGETGT", latestNotification.id);
          // handleDeleteNotifications(String(latestNotification.id));
        },
      }),
    });
  if (!latestNotification) return null;

  const IconComponent2 =
    notification_icons[latestNotification.type.toLowerCase()];

  return (
    <div className="my-fixed-div">
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.div
            key={latestNotification.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="flex gap-2 p-4 cursor-pointer"
            onClick={() => {
              console.log("clicked");
              handleClick();
            }}
            onMouseEnter={() => handleMouseEnter(latestNotification.id)}
            onMouseLeave={() => handleMouseLeave(latestNotification.id)}
          >
            <div className="icon text-brand-9">
              <IconComponent2 />
            </div>

            <div className="flex-col gap-2">
              <p className="font-bold">
                {latestNotification.type === "message"
                  ? "New Message"
                  : "New Notification"}
              </p>
              <div
                style={{
                  backgroundColor: hexToRgba(
                    getComputedStyle(document.documentElement).getPropertyValue(
                      "--brand-9"
                    ),
                    1
                  ),
                }}
                className="w-80 max-w-[400px] py-4 p-3 rounded-xl bg-brand-9/70 shadow-lg flex gap-3"
              >
                <div className="w-[1px] h-auto custom-secondary-bg bg-opacity-80">
                  .{" "}
                </div>
                <div className="flex relative flex-1 shadow-[0_4px_12px_#0000001a] gap-3 items-start">
                  <Image
                    height={70}
                    width={75}
                    src={latestNotification.senderImage}
                    alt={latestNotification.senderName}
                    className="w-[45px] h-[40px] rounded-md bg-brand-3 object-cover"
                  />
                  <div className="flex-1 text-white">
                    <div className="name flex">
                      <p className="font-semibold text-sm">
                        {capitalizeName(latestNotification.senderName)}
                      </p>

                      {!isGroupChat && badgeColor && (
                        <BadgeIcon color={badgeColor as any} />
                      )}
                    </div>

                    <div>
                      {latestNotification.content_type === "text" ? (
                        <p className="text-sm w-48  break-words line-clamp-2">
                          {latestNotification.message}
                        </p>
                      ) : (
                        <div className="flex gap-1 text-sm items-center text-brand-9">
                          {IconComponent && <IconComponent />}
                          {latestNotification.content_type}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
