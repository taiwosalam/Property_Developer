"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
import type {
  CompanyUsersAPIResponse,
  ConversationsAPIResponse,
  MessagesLayoutProps,
  PageMessages,
} from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";
import SendIcon from "@/public/icons/send-msg.svg";
import PlayIcon from "@/public/icons/play-icon.svg";
import PauseIcon from "@/public/icons/pause-icon.svg";
import DeleteIcon from "@/public/icons/del.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import MessageCard from "@/components/Message/message-card";
import { message_card_data } from "@/components/Message/data";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import useFetch from "@/hooks/useFetch";
import {
  SendMessage,
  transformCompanyUsersData,
  transformUsersMessages,
} from "./data";
import { useChatStore } from "@/store/message";
import { AuthForm } from "@/components/Auth/auth-components";
import clsx from "clsx";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import MessageAttachment from "@/components/Message/message-attachment";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import WavesurferPlayer from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import NoMessage from "./messages-component";
import { PlusIcon } from "@/public/icons/icons";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { CommentTextArea } from "../../management/agent-community/NewComment";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { setChatData } = useChatStore();
  const { id } = useParams();
  const { isCustom } = useWindowWidth(900);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[]>(message_card_data);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const users_data = useChatStore((state) => state?.data?.users);

  // Playback wavesurfer state (for playing the recorded audio)
  const [playbackWS, setPlaybackWS] = useState<WaveSurfer | null>(null);
  const onReady = (ws: any) => {
    setPlaybackWS(ws);
    setIsPlaying(false);
  };
  const onPlayPause = () => {
    playbackWS && playbackWS.playPause();
  };

  // Ref for the recording waveform container (always rendered)
  const micContainerRef = useRef<HTMLDivElement>(null);
  // Recorder WaveSurfer instance reference (for recording)
  const [recorderWS, setRecorderWS] = useState<WaveSurfer | null>(null);
  // New ref to store the Record plugin instance
  const recordPluginRef = useRef<any>(null);

  // When audioBlob is set, create a URL string for playback
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
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

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const { data: usersData, loading: loadingUsers, error } = useFetch<CompanyUsersAPIResponse>("/company/users");

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
      const transformed = transformUsersMessages(usersMessages);
      setPageUsersMsg(transformed);
      setChatData("users_messages", transformed);
    }
  }, [usersMessages]);

  useEffect(() => {
    if (usersData) {
      setChatData("users", transformCompanyUsersData(usersData));
    }
  }, [usersData]);

  // console.log("users data", pageUser)

  // Function to send a text message
  const handleSendMsg = async () => {
    const payload = {
      content: message,
      content_type: "text",
      receiver_type: "user",
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

  // When isRecording becomes true, initialize the recorder
  useEffect(() => {
    if (isRecording && micContainerRef.current) {
      const ws = WaveSurfer.create({
        container: micContainerRef.current,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        height: 25,
      });
      // Register the Record plugin and store it in a ref
      const recordPlugin = ws.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: false,
          scrollingWaveform: false,
          continuousWaveform: true,
          continuousWaveformDuration: 30,
        })
      );
      recordPluginRef.current = recordPlugin;
      // Listen for record-end event to capture the audio blob
      recordPlugin.on("record-end", (blob: Blob) => {
        setAudioBlob(blob);
        ws.destroy();
        setRecorderWS(null);
        recordPluginRef.current = null;
      });
      // Start recording using the plugin's API
      recordPlugin.startRecording();
      setRecorderWS(ws);
    }
  }, [isRecording]);

  const handleStartRecording = () => {
    console.log("record start");
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (recordPluginRef.current) {
      // Use the plugin instance to stop recording
      recordPluginRef.current.stopRecording();
    } else {
      console.warn("Record plugin instance is not available");
    }
    setIsRecording(false);
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;
    const audioFile = new File([audioBlob], "voice-note.wav", { type: audioBlob.type });
    const payload = {
      content_file: audioFile,
      content_type: "audio",
      receiver_type: "user",
    };
    try {
      setReqLoading(true);
      const res = await SendMessage(objectToFormData(payload), `${id}`);
      if (res) {
        setAudioBlob(null);
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
                      <MessageCard key={idx} {...message} highlight={message.id === id} />
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
          <div className="custom-flex-col w-full h-full">
            {children}
            {id && (
              <AuthForm onFormSubmit={() => { }}>
                <div className="py-4 px-6 flex w-full items-center gap-4">
                  {(!isRecording && !audioBlob) && (
                    <div className="flex w-full items-center gap-4">
                      <Modal>
                        <ModalTrigger asChild>
                          <button type="button">
                            <Picture src={ClipBlue} alt="attachment" size={24} />
                          </button>
                        </ModalTrigger>
                        <ModalContent>
                          <MessageAttachment onEmojiSelect={handleEmojiSelect} id={id as string} />
                        </ModalContent>
                      </Modal>
                      <CommentTextArea
                        name="chat"
                        id="chat"
                        placeholder="Type your message here"
                        className="w-full text-sm"
                        value={message}
                        onChange={handleMessageChange}
                      />
                    </div>
                  )}
                  {message ? (
                    <button
                      type="button"
                      className={clsx({
                        "animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2": reqLoading,
                      })}
                      onClick={handleSendMsg}
                    >
                      <Picture src={SendIcon} alt="text message" size={24} />
                    </button>
                  ) : (
                    <>
                      {(!audioBlob && !isRecording) && (
                        <button type="button" onClick={handleStartRecording}>
                          <Picture src={MicrophoneBlue} alt="voice note" size={24} />
                        </button>
                      )}
                      {isRecording && (
                        <button type="button" onClick={() => {}}>
                          <Picture src={PauseIcon} alt="voice note" size={24} />
                        </button>
                      )}
                      {isRecording && (
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm text-red-500">Stop Recording</span>
                        </button>
                      )}
                    </>
                  )}
                  {audioBlob && (
                    <div className="flex w-full items-center justify-end gap-2">
                      <button type="button" onClick={() => setAudioBlob(null)}>
                        <Picture src={DeleteIcon} alt="delete voice" size={28} />
                      </button>
                      <WavesurferPlayer
                        height={40}
                        width={400}
                        waveColor="violet"
                        url={audioUrl}
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={onPlayPause}>
                          <Picture src={isPlaying ? PauseIcon : PlayIcon} alt="voice pause-play" size={24} />
                        </button>
                        <button type="button" onClick={handleSendAudio} disabled={reqLoading}>
                          {reqLoading ? (
                            <div className="w-5 h-5 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                          ) : (
                            <Picture src={SendIcon} alt="voice note" size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Always render the recording container; show/hide via style */}
                  <div
                    ref={micContainerRef}
                    id="mic"
                    className="w-full mt-4 h-full flex items-center justify-center mb-4"
                    style={{ display: isRecording ? "block" : "none" }}
                  ></div>
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