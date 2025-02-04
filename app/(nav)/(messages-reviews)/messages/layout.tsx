"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type { CompanyUsersAPIResponse, ConversationsAPIResponse, MessagesLayoutProps, PageMessages } from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";
import SendIcon from "@/public/icons/send-msg.svg"
import PlayIcon from "@/public/icons/play-icon.svg"
import PauseIcon from "@/public/icons/pause-icon.svg"
import DeleteIcon from "@/public/icons/del.svg"

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
import useFetch from "@/hooks/useFetch";
import {
  convertToFormData,
  initialData,
  MessageUserPageTypes,
  SendMessage,
  transformCompanyUsersData,
  transformUsersMessages
} from "./data";
import { useChatStore } from "@/store/message";
import { AuthForm } from "@/components/Auth/auth-components";
import clsx from "clsx";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import useGetConversation from "@/hooks/getConversation";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import MessageAttachment from "@/components/Message/message-attachment";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import WavesurferPlayer from '@wavesurfer/react';
import WaveSurfer from 'wavesurfer.js';
import NoMessage from "./messages-component";
import { PlusIcon } from "@/public/icons/icons";
import SelectChatUsersModal from "@/components/Message/user-modal";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { setChatData } = useChatStore();
  const { id } = useParams();
  const { isCustom } = useWindowWidth(900);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[]>(message_card_data);
  const store_messages = useChatStore((state) => state?.data?.conversations);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const users_data = useChatStore((state) => state?.data?.users);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  // When audioBlob is set, create a URL string for Wavesurfer
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      // Clean up the URL object when the blob changes or the component unmounts
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl("");
    }
  }, [audioBlob]);

  useEffect(() => {
    setMessage(message);
  }, [message]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const {
    data: usersData,
    loading: loadingUsers,
    error,
  } = useFetch<CompanyUsersAPIResponse>('/company/users');

  const {
    data: usersMessages,
    loading: usersMsgLoading,
    error: usersMsgError,
    refetch,
  } = useFetch<ConversationsAPIResponse>("/messages");
  useRefetchOnEvent("refetch-users-msg", () => {
    refetch({ silent: true });
  });

  useEffect(() => {
    if (usersMessages) {
      setPageUsersMsg(transformUsersMessages(usersMessages));
      setChatData("users_messages", transformUsersMessages(usersMessages))
    }
  }, [usersMessages]);

  // console.log("page", pageUsersMsg)
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
    };

    try {
      setReqLoading(true);
      const res = await SendMessage(objectToFormData(payload), `${id}`);
      if (res) {
        setMessage("");
        window.dispatchEvent(new Event("refetch-users-msg"));
      }
    } catch (err) {
      toast.error("Failed to send msg");
    } finally {
      setReqLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    audioChunksRef.current = []; // Clear previous chunks
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const recordedBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioBlob(recordedBlob);
        };
        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone: ", err);
      });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;

    const audioFile = new File([audioBlob], "voice-note.wav", { type: audioBlob.type });
    const payload = {
      content_file: audioFile,
      content_type: "audio",
      receiver_type: "user"
    };

    console.log("formdata", payload)

    try {
      setReqLoading(true);
      const res = await SendMessage(objectToFormData(payload), `${id}`);
      if (res) {
        setAudioBlob(null); // Reset audio state after sending
        setAudioUrl("");
        window.dispatchEvent(new Event("refetch-users-msg"));
      }
    } catch (err) {
      toast.error("Failed to send audio message");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <>
      {isCustom && id ? null : (
        <div className="flex flex-1 p-4 pr-0">
          <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar relative">
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
            {pageUsersMsg.length === 0 ? (
              <NoMessage loading={loadingUsers} />
            ) : (
              <>
                {usersMsgLoading ? (
                  <div className="custom-flex-col gap-2 relative z-[1] pb-4">
                    {[...Array(5)].map((_, idx) => (
                      <MessageCardSkeleton key={idx} />
                    ))}
                  </div>
                ) : (
                  <div className="custom-flex-col relative z-[1] pb-4">
                    {pageUsersMsg.map((message, idx) => (
                      <MessageCard
                        key={idx}
                        {...message}
                        highlight={message.id === id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {/* STICKY PLUS */}
            <div className="absolute bottom-5 z-[10]">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    onClick={() => { }}
                    className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
                  >
                    <PlusIcon />
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <SelectChatUsersModal
                    loading={usersMsgLoading}
                    usersData={users_data?.users}
                    filters={users_data?.filters}
                  />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
      )}
      {(!isCustom || id) && (
        <div className="flex-1">
          <div className="custom-flex-col h-full">
            {children}
            {id && (
              <AuthForm onFormSubmit={() => { }}>
                <div className="py-4 px-6 flex items-center gap-4">
                  {(!isRecording && !audioBlob) &&
                    <>
                      <Modal>
                        <ModalTrigger asChild>
                          <button>
                            <Picture src={ClipBlue} alt="attachment" size={24} />
                          </button>
                        </ModalTrigger>
                        <ModalContent>
                          <MessageAttachment
                            onEmojiSelect={handleEmojiSelect}
                            id={id as string}
                          />
                        </ModalContent>
                      </Modal>
                      <Input
                        id="chat"
                        placeholder="Type your message here"
                        className="flex-1 text-sm"
                        value={message}
                        onChange={setMessage}
                      />
                    </>
                  }
                  {message ? (
                    <button
                      className={clsx({
                        "animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2": reqLoading,
                      })}
                      onClick={handleSendMsg}
                    >
                      <Picture src={SendIcon} alt="text message" size={24} />
                    </button>
                  ) : (
                    <>
                      {!audioBlob &&
                        <button onClick={handleStartRecording}>
                          <Picture src={MicrophoneBlue} alt="voice note" size={24} />
                        </button>}
                      {isRecording &&
                        <button onClick={handleStopRecording} className="flex items-center space-x-2">
                          <div className="flex space-x-1 items-center">
                            <div
                              className="w-1 h-4 bg-red-500 animate-pulse"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-1 h-6 bg-red-500 animate-pulse"
                              style={{ animationDelay: "100ms" }}
                            ></div>
                            <div
                              className="w-1 h-3 bg-red-500 animate-pulse"
                              style={{ animationDelay: "200ms" }}
                            ></div>
                            <div
                              className="w-1 h-5 bg-red-500 animate-pulse"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                            <div
                              className="w-1 h-4 bg-red-500 animate-pulse"
                              style={{ animationDelay: "400ms" }}
                            ></div>
                          </div>
                          <span className="text-sm text-red-500">Stop Recording</span>
                        </button>
                      }
                    </>
                  )}
                  {audioBlob && (
                    <div className="flex w-full items-center justify-end gap-2">
                      <button onClick={() => { setAudioBlob(null) }}>
                        <Picture src={DeleteIcon} alt="delete voice" size={28} />
                      </button>
                      <WavesurferPlayer
                        height={40}
                        width={400}
                        waveColor="violet"
                        url={audioUrl} // Use the URL string instead of the Blob directly
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="flex gap-2">
                        <button onClick={onPlayPause}>
                          <Picture src={isPlaying ? PauseIcon : PlayIcon} alt="voice pause-play" size={24} />
                        </button>
                        <button onClick={handleSendAudio} disabled={reqLoading}>
                          {reqLoading ? (
                            <div className="w-5 h-5 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                          ) : (
                            <Picture src={SendIcon} alt="voice note" size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </AuthForm>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesLayout;
