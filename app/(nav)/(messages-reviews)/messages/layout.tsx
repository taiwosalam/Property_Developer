"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import useWindowWidth from "@/hooks/useWindowWidth";
import { AuthForm } from "@/components/Auth/auth-components";
import MessageInputArea from "@/components/Message/messageInputArea";
import { MessagesProvider } from "@/contexts/messageContext";
import MessagesSidebar from "@/components/Message/message-sidebar";
import NoMessage from "./messages-component";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";
import { useChatStore } from "@/store/message";

const MessagesLayout = ({ children }: { children: React.ReactNode }) => {
  const { isCustom } = useWindowWidth(900);
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuClose = () => setAnchorEl(null);
  // Get messages data from store to determine if sidebar should show on mobile
  const usersMessages = useChatStore((state) => state?.data?.users_messages);
  const hasMessages =
    usersMessages && Array.isArray(usersMessages) && usersMessages.length > 0;
  // Determine sidebar visibility and layout
  const showSidebar = !isCustom || hasMessages;
  const isMobileWithMessages = isCustom && hasMessages;
  const isMobileWithSelectedMessage = isMobileWithMessages && id;

  return (
    <MessagesProvider>
      <>
        {/* Sidebar: Show on large screens OR on mobile when there are messages but no specific message selected */}
        {showSidebar && !isMobileWithSelectedMessage && (
          <div
            className={`${isMobileWithMessages
              ? "w-full flex-none p-4 max-w-full overflow-hidden overflow-y-scroll" // Mobile: full width with overflow hidden
              : "w-full flex-1 overflow-x-hidden overflow-y-auto custom-round-scrollbar p-4 pr-0" // Original layout for large screens
              }`}
          >
            <MessagesSidebar
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              handleMenuClose={handleMenuClose}
              id={id}
            />
          </div>
        )}
        {/* Main message area - show on large screens OR on mobile when a specific message is selected */}
        {(!isCustom || isMobileWithSelectedMessage) && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {!id && (
              <div className="custom-flex-col w-full h-full">
                <NoMessage />
              </div>
            )}
            <div className="custom-flex-col w-full h-full flex-1">
              {children}
              {id && (
                <AuthForm onFormSubmit={() => {}}>
                  <MessageInputArea />
                </AuthForm>
              )}
            </div>
          </div>
        )}
      </>
    </MessagesProvider>
  );
};

export default MessagesLayout;
