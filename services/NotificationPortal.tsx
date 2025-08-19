"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notification-store";
import Image from "next/image";
import { NotificationMessageIcon } from "@/public/icons/icons";
import { capitalizeName, hexToRgba } from "@/lib/utils";
import { useSoundPreference } from "@/hooks/useGetSound";
import { useMessageUser } from "@/hooks/useCardNotis";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

// Sound hook that persists even when component unmounts
function usePersistentSoundEffect() {
  const { notifications } = useNotificationStore();
  const { selectedSound } = useSoundPreference();
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const soundQueueRef = useRef<Array<() => void>>([]);
  const isPlayingRef = useRef(false);

  const playNextSound = useCallback(() => {
    if (soundQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const playSound = soundQueueRef.current.shift();
    if (playSound) {
      playSound();
    }
  }, []);

  const queueSound = useCallback(
    (soundUrl: string) => {
      soundQueueRef.current.push(() => {
        const audio = new Audio(soundUrl);
        audio.preload = "auto";

        audio.addEventListener("ended", () => {
          setTimeout(playNextSound, 100); // Small delay between sounds
        });

        audio.addEventListener("error", () => {
          console.warn("Error playing sound, skipping to next");
          playNextSound();
        });

        audio.play().catch((error) => {
          console.warn("Failed to play notification sound:", error);
          playNextSound();
        });
      });

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        playNextSound();
      }
    },
    [playNextSound]
  );

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!processedNotificationsRef.current.has(notification.id)) {
        processedNotificationsRef.current.add(notification.id);
        queueSound(selectedSound);
      }
    });

    // Cleanup
    const currentIds = new Set(notifications.map((n) => n.id));
    const processedIds = Array.from(processedNotificationsRef.current);

    processedIds.forEach((id) => {
      if (!currentIds.has(id)) {
        processedNotificationsRef.current.delete(id);
      }
    });
  }, [notifications, selectedSound, queueSound]);
}
export default function NotificationPortal() {
  const { notifications, removeNotification } = useNotificationStore();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Always run sound effect regardless of component mount state
  usePersistentSoundEffect();

  useEffect(() => {
    notifications.forEach((n) => {
      if (!timersRef.current.has(n.id)) {
        const timer = setTimeout(() => removeNotification(n.id), 5000);
        timersRef.current.set(n.id, timer);
      }
    });

    timersRef.current.forEach((timer, id) => {
      if (!notifications.find((n) => n.id === id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });
  }, [notifications, removeNotification]);

  const handleMouseEnter = (id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  };

  const handleMouseLeave = (id: string) => {
    if (!timersRef.current.has(id)) {
      const timer = setTimeout(() => removeNotification(id), 5000);
      timersRef.current.set(id, timer);
    }
  };

  // Show only the latest notification
  const latestNotification = notifications[notifications.length - 1];
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
      // onClick: () => console.log("hello"),
    });

  console.log({ latestNotification });

  if (!latestNotification) return null;

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
              <NotificationMessageIcon />
            </div>

            <div className="flex-col gap-2">
              <p className="font-bold">New Message</p>
              <div
                style={{
                  backgroundColor: hexToRgba(
                    getComputedStyle(document.documentElement).getPropertyValue(
                      "--brand-9"
                    ),
                    0.7
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
                  <div className="flex-1 text-brand-9">
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
                        <p className="text-sm line-clamp-2">
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
