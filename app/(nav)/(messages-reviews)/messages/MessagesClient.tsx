"use client";
import Image from "next/image";

// Images
import LogoPlaceholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Button from "@/components/Form/Button/button";
import { message_card_data } from "@/components/Message/data";
import { getLocalStorage } from "@/utils/local-storage";
import { empty } from "@/app/config";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { useChatStore } from "@/store/message";
import { useMessageStore } from "@/store/messagesStore";
import { useEffect } from "react";

const MessagesPage = ({
  serverData,
}: {
  serverData: { usersData?: any; messagesData?: any };
}) => {
  const initializeWithUserData = useMessageStore(
    (s) => s.initializeWithServerData
  );

  useEffect(() => {
    if (serverData && (serverData.usersData || serverData.messagesData)) {
      initializeWithUserData(serverData);
    }
  }, [initializeWithUserData, serverData]);
  const loggedInUserDetails = getLocalStorage("additional_details");
  const logo = loggedInUserDetails?.company?.company_logo || empty;
  const usersMessages = useChatStore((state) => state?.data?.users_messages);
  const usersData = useChatStore((state) => state?.data?.users);
  const isLoading = !usersData;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[80%]">
        {message_card_data?.length > 0 &&
          !Array.isArray(usersMessages) &&
          usersMessages?.length === 0 && (
            <>
              <div className="custom-flex-col gap-4">
                <div className="flex justify-center">
                  <Image src={logo} alt="logo" width={200} height={100} />
                </div>
                <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
                  It appears that you do not have any chats open. Please click
                  on a chat to open one, or click on the new message button to
                  start a new message.
                </p>
              </div>
              <div className="flex justify-center">
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="sm_medium" className="py-2 px-7">
                      New Message
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <SelectChatUsersModal loading={isLoading} />
                  </ModalContent>
                </Modal>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default MessagesPage;
