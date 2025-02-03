"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Types
import type { MessagesLayoutProps } from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";
import SendIcon from "@/public/icons/send-msg.svg"

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import MessageCard from "@/components/Message/message-card";
import { message_card_data } from "@/components/Message/data";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import Messages from "./page";
import { NoMessage } from "./messages-component";
import useFetch from "@/hooks/useFetch";
import { CompanyUsersAPIResponse, initialData, MessageUserPageTypes, SendMessage, transformCompanyUsersData } from "./data";
import { useChatStore } from "@/store/message";
import { AuthForm } from "@/components/Auth/auth-components";
import clsx from "clsx";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import useGetConversation from "@/hooks/getConversation";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import MessageAttachment from "@/components/Message/message-attachment";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { setChatData } = useChatStore();
  const { id } = useParams();
  const { isCustom } = useWindowWidth(900);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false)
  const store_messages = useChatStore((state) => state?.data?.conversations);
  const [conversations, setConversations] = useState<any[]>([]);


  useEffect(() => {
    setMessage(message)
  }, [message])

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handler to update the message input when an emoji is selected.
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const {
    data: usersData,
    loading: loadingUsers,
    error,
  } = useFetch<CompanyUsersAPIResponse>('/company/users');

  useEffect(() => {
    if (usersData) {
      setChatData("users", transformCompanyUsersData(usersData)); // Store users dynamically to store
    }
  }, [usersData]);

  const handleSendMsg = async () => {
    const payload = {
      content: message,
      content_type: "text",
      receiver_type: "user"
    }

    try {
      setReqLoading(true)
      const res = await SendMessage(objectToFormData(payload), `${id}`)
      if (res) {
        setMessage("")
      }
    } catch (err) {
      toast.error("Failed to send msg")
    } finally {
      setReqLoading(false)
    }
  }

  return (
    <>
      {isCustom && id ? null : (
        <div className="flex flex-1 p-4 pr-0">
          <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
            <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2">
              <div className="flex-1 relative">
                <Input
                  id="search"
                  className="w-full"
                  placeholder="Search for messages"
                  leftIcon={"/icons/search-icon.svg"}
                  inputClassName="pr-[52px] border-transparent"
                />
                <div className="absolute top-1/2 right-0 -translate-y-1/2">
                  <FilterButton
                    noTitle
                    className="bg-transparent py-[10px] px-4"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  />
                  <MessagesFilterMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    filterOptions={[
                      { label: "Inbox" },
                      { label: "Groups" },
                      { label: "Unread" },
                    ]}
                  />
                </div>
              </div>
              <Button
                href="/reviews"
                variant="sky_blue"
                size="xs_medium"
                className="py-2 px-7 dark:bg-darkBrand-primary"
              >
                see reviews
              </Button>
            </div>
            {message_card_data.length === 0 ? (
              <>
                <NoMessage loading={loadingUsers} />
              </>
            ) : (
              <div className="custom-flex-col relative z-[1] pb-4">
                {message_card_data.map((message, idx) => (
                  <MessageCard
                    key={idx}
                    {...message}
                    highlight={message.id === id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {(!isCustom || id) && (
        <div className="flex-1">
          <div className="custom-flex-col h-full">
            {children}
            {id && (
              <>
                <AuthForm onFormSubmit={() => { }}>
                  <div className="py-4 px-6 flex items-center gap-4">
                    <Modal>
                      <ModalTrigger asChild>
                        <button>
                          <Picture src={ClipBlue} alt="attachment" size={24} />
                        </button>
                      </ModalTrigger>
                      <ModalContent>
                        <MessageAttachment onEmojiSelect={handleEmojiSelect}  />
                      </ModalContent>
                    </Modal>
                    <Input
                      id="chat"
                      placeholder="Type your message here"
                      className="flex-1 text-sm"
                      value={message}
                      onChange={setMessage}
                    />
                    <button
                      className={clsx({
                        "animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2": reqLoading,
                      },)}
                      onClick={handleSendMsg}
                    >
                      <Picture
                        src={message ? SendIcon : MicrophoneBlue}
                        alt="voice note"
                        size={24}
                      />
                    </button>
                  </div>
                </AuthForm>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesLayout;
