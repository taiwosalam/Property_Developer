import Image from "next/image";

// Images
import LogoPlaceholder from "@/public/empty/logo-placeholder.svg";

// Imports
import Button from "@/components/Form/Button/button";
import { message_card_data } from "@/components/Message/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { users_data } from "./data";

export const NoMessage = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="custom-flex-col gap-6 max-w-[80%]">
                <div className="custom-flex-col gap-4">
                    <div className="flex justify-center">
                        <Image src={LogoPlaceholder} alt="logo" width={200} />
                    </div>
                    <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
                        You don&rsquo;t have any recent chats. Click on the contact list to select a person you&rsquo;d like to chat with and start a conversation.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Modal>
                        <ModalTrigger asChild>
                            <Button size="sm_medium" className="py-2 px-7">
                                Start New Message
                            </Button>
                        </ModalTrigger>
                        <ModalContent>
                            <SelectChatUsersModal
                                usersData={users_data}
                            />
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
