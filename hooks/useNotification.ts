import { useState, useEffect } from "react";

const NOTIFICATION_EVENT = "notificationEvent";

interface Notification {
  id: number;
  message: string;
}

const useNotifications = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(1);

  const addMessageNotification = () => {
    setMessageCount((prev) => prev + 1);
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  };

  const addNotification = (message: string) => {
    const newNotification = { id: nextId, message };
    setNotifications((prev) => [...prev, newNotification]);
    setNextId((prev) => prev + 1);
    setNotificationCount((prev) => prev + 1);
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  };

  useEffect(() => {
    const handleNotificationEvent = () => {
      console.log("A new notification has been added!");
      console.log(notifications);
    };

    window.addEventListener(NOTIFICATION_EVENT, handleNotificationEvent);

    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, handleNotificationEvent);
    };
  }, [notifications]);

  return {
    messageCount,
    notificationCount,
    notifications,
    addMessageNotification,
    addNotification,
  };
};

export default useNotifications;