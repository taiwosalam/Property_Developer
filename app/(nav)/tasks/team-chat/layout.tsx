"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

// Types
import type { MessagesLayoutProps } from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import { team_chat_data } from "./data";
import TeamChartCard from "./TeamChartCard";
import { SearchIcon } from "@/public/icons/icons";
import { TeamChatHeader } from "./team-chat-components";
import DeleteModal from "./DeleteModal";
import { Box, Modal } from "@mui/material";
import { useTeamChatStore } from "@/store/teamChatStore";

const TeamChatLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { id } = useParams();

  const { isCustom } = useWindowWidth(900);
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to filter members based on search input
  const filteredMembers = team_chat_data.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const { isDeleteMember, openDeleteMember, closeDeleteMember } =
    useTeamChatStore();

  return (
    <>
      <TeamChatHeader />
      <div className="flex bg-white dark:bg-darkText-primary h-[520px]">
        {isCustom && id ? null : (
          <div className="flex flex-1 p-4 pr-0">
            <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
              <div className="flex gap-4 items-center justify-between sticky top-0 z-[2] bg-white dark:bg-darkText-primary pb-2">
                {!isSearch && (
                  <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-semibold">Groups</h2>
                    <div className="flex items-center justify-center text-sm rounded-full w-6 h-6 text-white bg-brand-9">
                      {team_chat_data.length}
                    </div>
                  </div>
                )}
                {isSearch && (
                  <div className="flex w-3/4 bg-darkText-primary gap-2 items-center rounded-lg h-10 transition-all duration-300 ease-in-out">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full border border-text-disabled dark:bg-darkText-primary focus:outline-none rounded-lg h-full px-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
                <button
                  className="flex"
                  onClick={() => setIsSearch((prev) => !prev)}
                >
                  <SearchIcon size={35} />
                </button>
              </div>
              <div className="custom-flex-col relative z-[1] pb-4">
                {filteredMembers.map((message, idx) => (
                  <TeamChartCard
                    key={idx}
                    {...message}
                    highlight={message.id === id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {(!isCustom || id) && (
          <div className="flex-1">
            <div className="custom-flex-col h-full">
              {children}
              {id && (
                <div className="py-4 px-6 flex items-center gap-4">
                  <button>
                    <Picture src={ClipBlue} alt="attachment" size={24} />
                  </button>
                  <Input
                    id="chat"
                    placeholder="Type your message here"
                    className="flex-1 text-sm"
                  />
                  <button>
                    <Picture src={MicrophoneBlue} alt="voice note" size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        open={isDeleteMember}
        onClose={closeDeleteMember}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DeleteModal />
        </Box>
      </Modal>
    </>
  );
};

export default TeamChatLayout;
