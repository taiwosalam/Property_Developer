"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { team_chat_data } from "../data";
import { ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { Modal } from "@/components/Modal/modal";
import { TeamChatGroupDetailsModal } from "../GroupDetailsModal";
import { useTeamChatStore } from "@/store/teamChatStore";
import { NewMemberComp } from "../NewMemberModal";
import { Chevron } from "@/public/icons/icons";

const Chat = () => {
  const router = useRouter();
  const { id } = useParams();

  const data = team_chat_data.find((item) => item.id === id);

  if (!data) return router.replace("/tasks/team-chat");

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-darkText-primary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/tasks/team-chat")}
            className="text-dark dark:text-white"
          >
            <Chevron size={20} />
          </button>
          <button className="flex items-center gap-4 text-left">
            <Modal>
              <ModalTrigger asChild>
                <div className="flex gap-2 items-center">
                  <Picture
                    src={data.pfp}
                    alt="profile picture"
                    size={32}
                    rounded
                    status
                  />
                  <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                    {data.fullname}
                  </p>
                </div>
              </ModalTrigger>
              <ModalContent>
                <TeamChatGroupDetailsModal />
              </ModalContent>
            </Modal>
          </button>
          <NewMemberComp />
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        <Messages day="yesterday" />
        <Messages day="today" />
      </div>
    </>
  );
};

export default Chat;
