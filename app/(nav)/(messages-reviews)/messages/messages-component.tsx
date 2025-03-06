"use client";

import Image from "next/image";

// Imports
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { getLocalStorage } from "@/utils/local-storage";
import { empty } from "@/app/config";
import { useChatStore } from "@/store/message";

const NoMessage: React.FC<{ loading?: boolean }> = ({ loading }) => {
  const usersData = useChatStore((state) => state?.data?.users);
  const loggedInUserDetails = getLocalStorage("additional_details");
  const logo = loggedInUserDetails?.company?.company_logo || empty;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[80%]">
        <div className="custom-flex-col gap-4">
          <div className="flex justify-center">
            <Image src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
            You don&rsquo;t have any recent chats. Click on the contact list to
            select a person you&rsquo;d like to chat with and start a
            conversation.
          </p>
        </div>
        <div className="flex justify-center">
          <Modal>
            <ModalTrigger asChild>
              <Button size="sm_medium" className="py-2 px-7">
                Contact List
              </Button>
            </ModalTrigger>
            <ModalContent>
              <SelectChatUsersModal
                loading={loading}
                usersData={usersData?.users}
                filters={usersData?.filters}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default NoMessage;
