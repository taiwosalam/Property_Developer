"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

// Types
import type { Group, GroupsResponse, MessagesLayoutProps } from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import {
  formatMessageDate,
  isImageFile,
  sendGroupMessage,
  team_chat_data,
} from "./data";
import TeamChartCard from "./TeamChartCard";
import SendIcon from "@/public/icons/send-msg.svg";
import { SearchIcon, SendMessageIcon } from "@/public/icons/icons";
import { TeamChatHeader } from "./team-chat-components";
import DeleteModal from "./DeleteModal";
import { Box } from "@mui/material";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useTeamChatStore } from "@/store/teamChatStore";
import useFetch from "@/hooks/useFetch";
import { string } from "zod";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import { TeamMessageCardSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { reverse } from "lodash";
//import { ModalTrigger } from "@/components/Modal/modal";
import MessageAttachment from "@/components/Message/message-attachment";
import {
  useVoiceVisualizer,
  VoiceVisualizer,
} from "@hasma/react-voice-visualizer";
import WavesurferPlayer from "@wavesurfer/react";
import PlayIcon from "@/public/icons/play-icon.svg";
import PauseIcon from "@/public/icons/pause-icon.svg";
import DeleteIcon from "@/public/icons/del.svg";

import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import TeamMessageAttachment from "@/components/Message/Team/TeamMessageAttachment";

import dayjs from "dayjs";

const TeamChatLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { id } = useParams();
  const {
    data: allGroupData,
    error,
    silentLoading,
    loading,
    refetch,
    isNetworkError,
  } = useFetch<GroupsResponse>(`group-chat/all-group`);

  //const {data: apiData, isNetworkError, error } = useFetch("group-chat/all-group");

  const groupCount = allGroupData?.group_count;
  const groupList = allGroupData?.groups;

  const { isCustom } = useWindowWidth(900);
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [group, setGroup] = useState(groupList ?? []);
  const params = useParams();
  const paramId = params.id;

  const [message, setMessage] = useState<string>("");
  const [groupId, setGroupId] = useState(paramId ?? "");

  const [audioUrl, setAudioUrl] = useState("");
  const voiceControls = useVoiceVisualizer();
  const [playbackWS, setPlaybackWS] = useState<any>(null);
  const [reqLoading, setReqLoading] = useState(false);

  const onReady = (ws: any) => {
    setPlaybackWS(ws);
    setIsPlaying(false);
  };
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlayPause = () => {
    playbackWS && playbackWS.playPause();
  };

  const filteredMemberList: Group[] =
    (groupList?.length ?? 0) > 0
      ? (groupList ?? []).filter((member) =>
          member.group_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const { isDeleteMember, openDeleteMember, closeDeleteMember } =
    useTeamChatStore();

  useRefetchOnEvent("refetch_team_chat", () => {
    refetch({ silent: true });
  });

  useEffect(() => {
    if (paramId) {
      setGroupId(paramId);
    }
  }, [paramId]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Reset height to recalculate
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      // Set new height with max limit
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 100) + "px";
    }
  };

  const sendMessage = async () => {
    const payload = {
      content: message,
      content_type: "text",
      //reply_to: "null",
    };
    try {
      setReqLoading(true);
      if (groupId && message.length > 0) {
        await sendGroupMessage(groupId as string, objectToFormData(payload));
        setMessage("");
      }
    } catch (error) {
      toast.error("Fail to send msg");
    } finally {
      setReqLoading(false);
    }
  };

  const transformGroupData = (data: Group) => {
    const isImage = isImageFile(data?.latest_message?.content);
    return {
      id: data.group_id.toString(),
      pfp: data?.group_picture ?? "",
      desc: data?.latest_message?.content ?? "",
      time: formatMessageDate(data?.latest_message?.timestamp) ?? "",
      fullname: data.group_name,
      verified: true,
      messages: data.unread_message_count ?? 0,
      content_type: isImage ? "image" : data?.latest_message?.content_type,
    };
  };

  const handleSendAudio = async () => {
    if (!voiceControls.recordedBlob) return;
    const audioFile = new File([voiceControls.recordedBlob], "voice-note.wav", {
      type: voiceControls.recordedBlob.type,
    });
    const payload = {
      file: audioFile,
      content: null,
      content_type: "audio",
      //receiver_type: "user",
    };
    try {
      setReqLoading(true);
      const res = await sendGroupMessage(`${id}`, objectToFormData(payload));
      if (res) {
        setAudioUrl("");
        window.dispatchEvent(new Event("refetch_team_message"));
      }
    } catch (err) {
      toast.error("Failed to send audio message");
    } finally {
      setReqLoading(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  useEffect(() => {
    if (voiceControls.recordedBlob) {
      const url = URL.createObjectURL(voiceControls.recordedBlob);
      setAudioUrl(url);
    } else {
      setAudioUrl("");
    }
  }, [voiceControls.recordedBlob]);

  //   const sortGroupsByLatestMessage = (groups: Group[]) => {
  //     return [...groups].sort((a, b) => {
  //         // If a group has no messages, push it to the top (until it gets a message)
  //         if (!a.latest_message?.timestamp) return -1;
  //         if (!b.latest_message?.timestamp) return 1;

  //         return dayjs(b.latest_message?.timestamp).valueOf() - dayjs(a.latest_message?.timestamp).valueOf();
  //     });
  // };

  if (isNetworkError) {
    return <NetworkError />;
  }

  return (
    <>
      <TeamChatHeader />
      <div className="flex bg-white dark:bg-darkText-primary h-[70vh]">
        {isCustom && id ? null : (
          <div className="flex flex-1 p-4 pr-0">
            <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
              <div className="flex gap-4 items-center justify-between sticky top-0 z-[2] bg-white dark:bg-darkText-primary pb-2">
                {!isSearch && groupCount && (
                  <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-semibold">Groups</h2>
                    <div className="flex items-center justify-center text-sm rounded-full w-6 h-6 text-white bg-brand-9">
                      {groupCount ?? groupCount}
                    </div>
                  </div>
                )}
                {isSearch && (
                  <div className="flex w-3/4 bg-darkText-primary gap-2 items-center rounded-lg h-10 transition-all duration-300 ease-in-out">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full border border-text-disabled dark:bg-darkText-primary focus:outline-none rounded-lg h-full px-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
                <button
                  className="flex"
                  onClick={() => setIsSearch((prev) => !prev)}
                >
                  <SearchIcon size={35} />
                </button>
              </div>
              <div className="custom-flex-col relative z-[1] pb-4">
                {loading ? (
                  <TeamMessageCardSkeleton count={5} />
                ) : (
                  groupList &&
                  groupList?.length > 0 &&
                  filteredMemberList
                    ?.reverse()
                    ?.map((member, idx) => (
                      <TeamChartCard
                        key={idx}
                        {...transformGroupData(member)}
                        highlight={member.group_id.toString() === id}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        )}
        {(!isCustom || id) && (
          <div className="flex-1">
            <div className="custom-flex-col h-full">
              {children}
              {id && (
                <div className="py-4 px-6 flex items-center gap-4">
                  <Modal>
                    <ModalTrigger asChild>
                      {!audioUrl && !voiceControls.isRecordingInProgress && (
                        <button type="button">
                          <Picture src={ClipBlue} alt="attachment" size={24} />
                        </button>
                      )}
                    </ModalTrigger>
                    <ModalContent>
                      <TeamMessageAttachment
                        onEmojiSelect={handleEmojiSelect}
                        id={paramId as string}
                      />
                    </ModalContent>
                  </Modal>
                  {!audioUrl && !voiceControls.isRecordingInProgress && (
                    <textarea
                      ref={textareaRef}
                      id="chat"
                      name="message"
                      onChange={handleChangeTextArea}
                      value={message}
                      placeholder="Type your message here"
                      className="flex-1 text-sm w-full p-2 border rounded-lg resize-none overflow-hidden focus:outline-none focus:border-blue-500"
                      rows={1}
                      style={{ minHeight: "40px", maxHeight: "100px" }}
                    />
                  )}
                  {message.length > 0 ? (
                    <button onClick={sendMessage}>
                      <Picture src={SendIcon} alt="text message" size={24} />
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
                      {}
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

                  {voiceControls.isRecordingInProgress && (
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* <Modal
        //={isDeleteMember}
        //onClose={closeDeleteMember}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DeleteModal />
        </Box>
      </Modal> */}
    </>
  );
};

export default TeamChatLayout;
