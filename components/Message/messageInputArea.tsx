"use client";
import {
  useVoiceVisualizer,
  VoiceVisualizer,
} from "@hasma/react-voice-visualizer";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import MessageAttachment from "@/components/Message/message-attachment";
import {
  MessageAttachIcon,
  MessageSendIcon,
  MessageMicIcon,
  MessageDeleteIcon,
  MessageVNPlayIcon,
  MessageVNPauseIcon,
  MessageEmojiIcon,
} from "@/public/icons/icons";
import WavesurferPlayer from "@wavesurfer/react";
import { StopCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/contexts/messageContext";
import { MessageInput } from "./messageInput";
import { EmojiComponent } from "./message-attachments-components";

const MessageInputArea = () => {
  const { id } = useParams();
  const {
    message,
    setMessage,
    reqLoading,
    audioUrl,
    setAudioUrl,
    handleSendMsg,
    handleSendAudio,
  } = useMessages();

  // Voice logic
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackWS, setPlaybackWS] = useState<any>(null);

  const onReady = (ws: any) => {
    setPlaybackWS(ws);
    setIsPlaying(false);
  };
  const onPlayPause = () => playbackWS && playbackWS.playPause();

  const voiceControls = useVoiceVisualizer();

  // When recordedBlob updates, create a URL for playback.
  useEffect(() => {
    if (voiceControls.recordedBlob) {
      const url = URL.createObjectURL(voiceControls.recordedBlob);
      setAudioUrl(url);
    } else {
      setAudioUrl("");
    }
    // eslint-disable-next-line
  }, [voiceControls.recordedBlob]);

  // Input/attachment handlers
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Emoji popover logic
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const emojiPopoverRef = useRef<HTMLDivElement>(null);

  // Open emoji popover
  const handleShowEmoji = () => setShowEmoji(true);

  // Close ONLY if click outside emoji icon and popover
  useEffect(() => {
    if (!showEmoji) return;
    const handleClick = (e: MouseEvent) => {
      if (
        emojiBtnRef.current &&
        emojiBtnRef.current.contains(e.target as Node)
      ) {
        // Clicked the icon, keep open
        return;
      }
      if (
        emojiPopoverRef.current &&
        emojiPopoverRef.current.contains(e.target as Node)
      ) {
        // Clicked inside the emoji popover, keep open
        return;
      }
      // Clicked outside both, close
      setShowEmoji(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmoji]);

  // Emoji handler
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev: string) => (prev || "") + emoji);
  };

  return (
    <div className="py-4 px-6 flex w-full items-center gap-4">
      {!audioUrl && !voiceControls.isRecordingInProgress && (
        <div className="flex w-full items-center gap-4">
          <Modal>
            <ModalTrigger asChild>
              <button type="button" className="text-brand-9">
                <MessageAttachIcon size={30} />
              </button>
            </ModalTrigger>
            <ModalContent>
              <MessageAttachment
                onEmojiSelect={handleEmojiSelect}
                id={id as string}
              />
            </ModalContent>
          </Modal>
          {/* CHAT INPUT AND EMOJI PICKER */}
          <div className="w-full flex items-center border-solid border-brand-9 bg-neutral-3 outline-brand-9 dark:bg-darkText-primary relative">
            <MessageInput
              name="chat"
              id="chat"
              placeholder="Type your message here"
              className="w-full text-sm w-[90%] border-none focus:ring-0 focus:outline-none focus:border-none bg-transparent"
              value={message}
              onChange={handleMessageChange}
            />
            <div className="flex relative items-center justify-end w-[10%] justify-center text-brand-9">
              <button
                type="button"
                ref={emojiBtnRef}
                className="p-1 rounded hover:bg-neutral-2"
                tabIndex={0}
                aria-label="Add emoji"
                onClick={handleShowEmoji}
              >
                <MessageEmojiIcon />
              </button>
              {/* Drop-up emoji popover */}
              {showEmoji && (
                <div
                  ref={emojiPopoverRef}
                  className="absolute right-0 bottom-[110%] z-50"
                  style={{ minWidth: 260 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white dark:bg-darkText-primary border shadow-md rounded-lg p-2">
                    <EmojiComponent onEmojiSelect={handleEmojiSelect} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* SEND MESSAGE BUTTON */}
      {message ? (
        <button
          type="button"
          className="text-brand-9"
          onClick={() => handleSendMsg(id as string)}
        >
          {reqLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-brand-9 rounded-full" />
          ) : (
            <MessageSendIcon size={30} />
          )}
        </button>
      ) : (
        <>
          {/* MICRO BUTTON */}
          {!audioUrl && !voiceControls.isRecordingInProgress && (
            <button
              type="button"
              className="text-brand-9"
              onClick={voiceControls.startRecording}
            >
              <MessageMicIcon size={30} />
            </button>
          )}
          {voiceControls.isRecordingInProgress && (
            <div className="flex flex-col gap-2 w-full items-center justify-center mt-2">
              <div className="w-full mt-2">
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
                  className="px-3 py-1 rounded text-brand-9 text-sm"
                >
                  {voiceControls.isPausedRecording ? (
                    <MessageVNPlayIcon size={30} />
                  ) : (
                    <MessageVNPauseIcon size={30} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    voiceControls.stopRecording();
                    setAudioUrl("");
                  }}
                  className="rounded text-brand-9 text-sm"
                >
                  <StopCircleIcon size={30} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {audioUrl && (
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="text-brand-9"
            type="button"
            onClick={() => setAudioUrl("")}
          >
            <MessageDeleteIcon size={30} />
          </button>
          <WavesurferPlayer
            height={40}
            width={400}
            waveColor="#e5e7eb"
            progressColor="var(--primary-color)"
            url={audioUrl}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="text-brand-9"
              onClick={onPlayPause}
            >
              <MessageVNPlayIcon size={30} />
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendAudio(
                  id as string,
                  voiceControls.recordedBlob,
                  voiceControls.stopRecording
                )
              }
              disabled={reqLoading}
              className="text-brand-9"
            >
              {reqLoading ? (
                <div className="w-5 h-5 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <MessageSendIcon size={30} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInputArea;
