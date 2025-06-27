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
import NoMessage from "./messages-component";
import {MessageVNPauseIcon, 
  AudioStopIcon,
  MessageVNPlayIcon,
  PlayIconButton,
  PlusIcon,
} from "@/public/icons/icons";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { CommentTextArea } from "../../community/agent-forum/NewComment";

// Import the voice visualizer hook and component
import {
  useVoiceVisualizer,
  VoiceVisualizer,
} from "@hasma/react-voice-visualizer";
import { getLocalStorage } from "@/utils/local-storage";
import { MessageInput } from "@/components/Message/messageInput";
import { PauseCircleIcon, StopCircleIcon } from "lucide-react";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { setChatData } = useChatStore();
  const { id } = useParams();
  const loggedInUserId = getLocalStorage("user_id");
  const { isCustom } = useWindowWidth(900);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<PageMessages[]>([]); // state for filtered messages
  const [searchQuery, setSearchQuery] = useState(""); // state for search query
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // state for selected filters
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  // We'll no longer use our own isRecording/audioBlob state for recording;
  // Instead, we use the voice visualizer hook.
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const users_data = useChatStore((state) => state?.data?.users);

  // Playback wavesurfer state (for playing the recorded audio)
  const [playbackWS, setPlaybackWS] = useState<any>(null);
  const onReady = (ws: any) => {
    setPlaybackWS(ws);
    setIsPlaying(false);
  };
  const onPlayPause = () => {
    playbackWS && playbackWS.playPause();
  };

  // Voice Visualizer hook for recording.
  const voiceControls = useVoiceVisualizer();
  // voiceControls provides:
  // - recordedBlob
  // - isRecordingInProgress
  // - isPausedRecording
  // - startRecording, stopRecording, togglePauseResume
  // - audioRef (for the visualizer component)

  // When recordedBlob updates, create a URL for playback.
  useEffect(() => {
    if (voiceControls.recordedBlob) {
      const url = URL.createObjectURL(voiceControls.recordedBlob);
      setAudioUrl(url);
    } else {
      setAudioUrl("");
    }
  }, [voiceControls.recordedBlob]);

  useEffect(() => {
    setMessage(message);
  }, [message]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const {
    data: usersData,
    loading: loadingUsers,
    error,
  } = useFetch<CompanyUsersAPIResponse>("/company/users");

  const {
    data: usersMessages,
    loading: usersMsgLoading,
    error: usersMsgError,
    refetch,
  } = useFetch<ConversationsAPIResponse>("/messages");
  useRefetchOnEvent("refetch-users-msg", () => {
    refetch({ silent: true });
  });

  // Update messages and apply initial filtering
  useEffect(() => {
    if (usersMessages) {
      const transformed = transformUsersMessages(usersMessages).filter(
        (msg) => msg.id !== loggedInUserId
      );
      setPageUsersMsg(transformed);
      setChatData("users_messages", transformed);
      applyFilters(transformed, searchQuery, selectedFilters, selectedBranches);
    }
  }, [usersMessages, loggedInUserId, setChatData]);

  useEffect(() => {
    if (usersData) {
      setChatData("users", transformCompanyUsersData(usersData));
    }
  }, [usersData]);

  // Apply filters and search
  const applyFilters = (
    messages: PageMessages[],
    query: string,
    filters: string[],
    branches: string[]
  ) => {
    let filtered = [...messages];

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.fullname.toLowerCase().includes(lowerQuery) ||
          msg.desc.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filters
    if (filters.length > 0) {
      filtered = filtered.filter((msg) => {
        if (filters.includes("Unread") && msg.unread_count === 0) {
          return false;
        }
        // Note: "Inbox" and "Groups" may require additional logic based on your data structure
        // For now, assume "Inbox" shows all user messages, and "Groups" is not implemented
        return true;
      });
    }

    // Apply branch filters
    if (branches.length > 0 && usersData) {
      const userIdsInBranches = usersData.data.users
        .filter((user) => branches.includes(user.branch_id))
        .map((user) => user.id);
      filtered = filtered.filter((msg) => userIdsInBranches.includes(msg.id));
    }

    setFilteredMessages(filtered);
  };

  // HANDLE SEARCH
  const handleSearchChange = (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(value);
    applyFilters(pageUsersMsg, value, selectedFilters, selectedBranches);
  };

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
        window.dispatchEvent(new Event("refetchMessages"));
      }
    } catch (err) {
      toast.error("Failed to send msg");
    } finally {
      setReqLoading(false);
    }
  };

  // Function to send audio; uses audioUrl and the recordedBlob (set via voiceControls)
  const handleSendAudio = async () => {
    if (!voiceControls.recordedBlob) return;
    const audioFile = new File([voiceControls.recordedBlob], "voice-note.wav", {
      type: voiceControls.recordedBlob.type,
    });
    const payload = {
      content_file: audioFile,
      content_type: "audio",
      receiver_type: "user",
    };
    try {
      setReqLoading(true);
      const res = await SendMessage(objectToFormData(payload), `${id}`);
      if (res) {
        // Clear the recording data after sending
        setAudioUrl("");
        voiceControls.stopRecording();
        setMessage("");
        window.dispatchEvent(new Event("refetch-users-msg"));
        window.dispatchEvent(new Event("refetchMessages"));
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
                  value={searchQuery}
                  onChange={handleSearchChange}
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
            </div>
            {filteredMessages.length === 0 ? (
              // <NoMessage loading={loadingUsers} />
              <></>
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
                    {filteredMessages.map((message, idx) => (
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
            {/* STICKY PLUS --> BE CAREFUL NOT TO REMOVE MAX-W-50PX FOR THE STICKY BUTTON., IT TOOK ME OVER 5 HRS DEBUG 😪😥*/}
            <div className="fixed bottom-20 z-[10] max-w-[50px]">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    onClick={() => {}}
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

      {/* MESSAGE FORM AND NO MESSAGE COMPONENT WHEN NC CONVERSATION GOING ON */}
      {(!isCustom || id) && (
        <div className="flex-1 overflow-hidden">
          {!id && (
            <div className="custom-flex-col w-full h-full">
              <NoMessage loading={loadingUsers} />
            </div>
          )}
          <div className="custom-flex-col w-full h-full">
            {children}
            {id && (
              <AuthForm onFormSubmit={() => {}}>
                <div className="py-4 px-6 flex w-full items-center gap-4">
                  {!audioUrl && !voiceControls.isRecordingInProgress && (
                    <div className="flex w-full items-center gap-4">
                      <Modal>
                        <ModalTrigger asChild>
                          <button type="button">
                            <Picture
                              src={ClipBlue}
                              alt="attachment"
                              size={24}
                            />
                          </button>
                        </ModalTrigger>
                        <ModalContent>
                          <MessageAttachment
                            onEmojiSelect={handleEmojiSelect}
                            id={id as string}
                          />
                        </ModalContent>
                      </Modal>
                      <MessageInput
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
                    <button type="button" onClick={handleSendMsg}>
                      {reqLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-brand-9 rounded-full" />
                      ) : (
                        <Picture src={SendIcon} alt="text message" size={24} />
                      )}
                    </button>
                  ) : (
                    <>
                      {!audioUrl && !voiceControls.isRecordingInProgress && (
                        <button
                          type="button"
                          onClick={voiceControls.startRecording}
                        >
                          <Picture
                            src={MicrophoneBlue}
                            alt="voice note"
                            size={24}
                          />
                        </button>
                      )}
                      {voiceControls.isRecordingInProgress && (
                        <>
                          <div className="flex flex-col gap-2 w-full items-center justify-center mt-2">
                            <div
                              className="w-full mt-2"
                              // style={{ height: "100px" }}
                            >
                              <VoiceVisualizer
                                ref={voiceControls.audioRef}
                                controls={voiceControls}
                                isControlPanelShown={false}
                                isProgressIndicatorOnHoverShown={true}
                                isProgressIndicatorTimeShown={true}
                                height={50}
                                width="100%"
                                backgroundColor="transparent"
                                mainBarColor="#2392f5"
                                secondaryBarColor="#fe0095"
                                speed={3}
                                barWidth={3}
                                gap={1}
                                rounded={5}
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={voiceControls.togglePauseResume}
                                className="px-3 py-1 rounded text-black text-sm"
                              >
                                {/* <Picture
                                  src={
                                    voiceControls.isPausedRecording
                                      ? PlayIcon
                                      : PauseIcon
                                  }
                                  alt={
                                    voiceControls.isPausedRecording
                                      ? "play voice"
                                      : "pause voice"
                                  }
                                  size={30}
                                /> */}
                                {voiceControls.isPausedRecording ? (
                                  <MessageVNPlayIcon />
                                ) : (
                                  <MessageVNPauseIcon />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  voiceControls.stopRecording();
                                  setAudioUrl("");
                                }}
                                className="rounded text-[#305ce3] text-sm"
                              >
                                {/* <AudioStopIcon /> */}
                                <StopCircleIcon size={30} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {audioUrl && (
                    <div className="flex w-full items-center justify-end gap-2">
                      <button type="button" onClick={() => setAudioUrl("")}>
                        <Picture
                          src={DeleteIcon}
                          alt="delete voice"
                          size={28}
                        />
                      </button>
                      <WavesurferPlayer
                        height={40}
                        width={400}
                        waveColor="rgb(100, 0, 100)"
                        progressColor="rgb(200, 0, 200)"
                        url={audioUrl}
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={onPlayPause}>
                          <Picture
                            src={isPlaying ? PauseIcon : PlayIcon}
                            alt="voice pause-play"
                            size={24}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={handleSendAudio}
                          disabled={reqLoading}
                        >
                          {reqLoading ? (
                            <div className="w-5 h-5 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                          ) : (
                            <Picture
                              src={SendIcon}
                              alt="voice note"
                              size={24}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* {voiceControls.isRecordingInProgress && (
                    <div className="w-full mt-4" style={{ height: "100px" }}>
                      <VoiceVisualizer
                        ref={voiceControls.audioRef}
                        controls={voiceControls}
                        height={50} // Set a fixed canvas height (in pixels)
                        width="80%" // Make it fill the container’s width
                        backgroundColor="transparent"
                        mainBarColor="#2392f5" // Customize as desired
                        secondaryBarColor="#fe0095" // Customize as desired
                        speed={3} // Adjust animation speed if needed
                        barWidth={3}
                        gap={1}
                        rounded={5}
                      />
                    </div>
                  )} */}
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
