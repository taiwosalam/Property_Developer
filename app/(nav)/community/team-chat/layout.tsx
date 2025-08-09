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
  const { isNetworkError, loading, error } = useTeamChat();
  const { role } = useRole();

  // PERMISSIONS
  const canViewAndreplyMessages =
    usePermission(role,   "Can view and reply branch messages") || role === "director";

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <>
      {/* <TeamChatHeader /> */}
      <div className="flex bg-white dark:bg-darkText-primary h-[70vh] relative">
        {/* Sidebar only on large screens */}
        {!isCustom && (
          <div className="flex flex-1 p-4 pr-0 w-full overflow-x-hidden custom-round-scrollbar">
            <TeamChatSidebar />
          </div>
        )}
        {/* Main chat area */}
        <div className="flex-1 relative">
          <div className="custom-flex-col h-full justify-end">
            {children}
            {paramId && canViewAndreplyMessages && <TeamChatInputArea />}
          </div>
        </div>
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
