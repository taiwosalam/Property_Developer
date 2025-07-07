"use client";

import React from "react";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateGroupModal from "./create-group-modal";

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4 px-4">
      <PageTitle
        title="Team Chat"
        aboutPageModalData={{
          title: "Team Chat",
          description:
            "This page contains a list of Team Chat on the platform.",
        }}
      />
      <Modal>
        <ModalTrigger asChild>
          <Button size="base_medium" type="button" className="px-8 py-2">
            + Create Team Chat
          </Button>
        </ModalTrigger>
        <ModalContent>
          <CreateGroupModal create />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeamChatHeader;
