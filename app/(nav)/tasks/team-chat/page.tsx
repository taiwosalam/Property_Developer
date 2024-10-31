"use client";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import React from "react";

const TeamChat = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[80%]">
        <div className="custom-flex-col gap-4">
          <div className="flex justify-center">
            {/* <Image src={LogoPlaceholder} alt="logo" width={200} /> */}
          </div>
          <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
            It appears that you do not have any chats open. Please click on a
            chat to open one, or click on the new message button to start a new
            message.
          </p>
        </div>
        <div className="flex justify-center">
          <Button size="sm_medium" className="py-2 px-7">
            Start New Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div>
        <PageTitle
          title="Team Chat"
          aboutPageModalData={{
            title: "Team Chat",
            description:
              "This page contains a list of Team Chat on the platform.",
          }}
        />
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create Team Chat
            </Button>
          </ModalTrigger>
          <ModalContent>
            <div>text here</div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
