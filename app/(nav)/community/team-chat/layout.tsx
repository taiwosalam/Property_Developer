"use client";

import React from "react";
import { useParams } from "next/navigation";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TeamChatProvider } from "@/contexts/teamChatContext";
import TeamChatSidebar from "@/components/TeamChat/team-chat-sidebar";
import TeamChatInputArea from "@/components/TeamChat/team-chat-input-area";
import { TeamChatHeader } from "./team-chat-components";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import { MessagesLayoutProps } from "./types";
import { useTeamChat } from "@/contexts/teamChatContext";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const TeamChatContent: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { isCustom } = useWindowWidth(900);
  const params = useParams();
  const paramId = params.id;
  const { isNetworkError, loading, error, teamChatPageData } = useTeamChat();
  const { role } = useRole();

  // PERMISSIONS
  const canViewAndreplyMessages =
    usePermission(role, "Can view and reply branch messages") || role === "director";

  // Mirror messages layout responsive behavior
  const hasGroups = !!(teamChatPageData?.team && teamChatPageData.team.length > 0);
  const showSidebar = !isCustom || hasGroups;
  const isMobileWithGroups = isCustom && hasGroups;
  const isMobileWithSelectedGroup = isMobileWithGroups && paramId;

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <>
      <div className="flex bg-white dark:bg-darkText-primary h-[80vh] md:h-[70vh] relative">

      {/* Sidebar: Show on large screens OR on mobile when there are groups but no specific group selected */}
      {showSidebar && !isMobileWithSelectedGroup && (
        <div
          className={`${isMobileWithGroups
            ? "w-full flex-none p-4 max-w-full overflow-hidden overflow-y-scroll"
            : "flex flex-1 overflow-x-hidden custom-round-scrollbar p-4 pr-0"
            }`}
        >
          <TeamChatSidebar />
        </div>
      )}

      {/* Main chat area - show on large screens OR on mobile when a specific group is selected */}
      {(!isCustom || isMobileWithSelectedGroup) && (
        <div className="flex-1 relative">
          <div className="custom-flex-col h-full justify-end">
            {children}
            {paramId && canViewAndreplyMessages && <TeamChatInputArea />}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const TeamChatLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  return (
    <TeamChatProvider>
      <TeamChatContent>{children}</TeamChatContent>
    </TeamChatProvider>
  );
};

export default TeamChatLayout;
