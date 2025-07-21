"use client";
import clsx from "clsx";
import moment from "moment";
//import Input from "@/components/Form/Input/input";
import { SendMessageIcon, VerticalEllipsisIcon } from "@/public/icons/icons";
import Message from "./message";
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { sendTaskComment } from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/Form/Button/button";
import { Loader2, SendIcon } from "lucide-react";
import Input from "@mui/material/Input/Input";

interface MessageFromTaskProps {
  comments?: {
    id: number;
    user: string;
    isOwnMessage: boolean;
    text: string;
    avatar: string;
    time: string;
  }[];
}
const MessagesFromTask = ({ comments }: MessageFromTaskProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [inputContent, setInputContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const param = useParams();
  const id = param.complainId as string;

  const handleContentOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value);
  };

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    const container = containerRef.current;
    if (container) {
      const stickyElements = container.querySelectorAll(".sticky-date-label");
      stickyElements?.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        // Check if the sticky element has reached the top of the container
        if (
          // Add padding 16px
          rect.top <= containerRect.top + 16 &&
          rect.bottom >= containerRect.top
        ) {
          element.classList.add("is-sticking");
          (element as HTMLElement).style.opacity = "1";
        } else {
          element.classList.remove("is-sticking");
        }
      });
    }
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (isScrolling) return;
    const stickyElements =
      containerRef.current?.querySelectorAll(".sticky-date-label");
    stickyElements?.forEach((element) => {
      const isSticking = element.classList.contains("is-sticking");
      (element as HTMLElement).style.opacity = isSticking ? "0" : "1";
    });
  }, [isScrolling]);

  const handleSendTask = async () => {
    if (!inputContent) return;
    try {
      setIsSending(true);
      const res = await sendTaskComment(id, inputContent.trim());
      if (res) {
        setInputContent("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Add effect to scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isSending) {
      event.preventDefault();
      handleSendTask();
    }
  };

  return (
    <div
      className="rounded-lg border border-[rgba(193,194,195,0.40)] bg-white dark:border-darkText-2"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="p-4 flex justify-between bg-brand-1 rounded-t-lg">
        <h6 className="text-black text-base font-medium">Messages from Task</h6>
        <span className="text-borders-normal">
          <VerticalEllipsisIcon />
        </span>
      </div>

      <div className="pb-8 bg-white dark:bg-[#3C3D37] rounded-b-lg">
        <div
          ref={containerRef}
          className="p-4 h-[320px] w-full overflow-y-scroll custom-round-scrollbar custom-flex-col"
        >
          {comments && comments.length === 0 ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-center text-darkText-2 dark:text-gray-400">No message yet</p>
            </div>
          ) : (
            comments &&
            comments.length > 0 &&
            comments.map((m, index) => {
              const currentDate = moment(m.time).startOf("day");
              const previousDate =
                index > 0
                  ? moment(comments[index - 1].time).startOf("day")
                  : null;

              const showDateLabel =
                !previousDate || !currentDate.isSame(previousDate, "day");
              return (
                <div
                  key={m.id}
                  className={clsx("flex flex-col items-center", {
                    "mb-1":
                      index !== messages.length - 1 &&
                      m.user === messages[index + 1]?.user,
                    "mb-4":
                      index !== messages.length - 1 &&
                      m.user !== messages[index + 1]?.user,
                  })}
                >
                  {showDateLabel && (
                    <div
                      className={clsx(
                        "sticky-date-label text-xs border border-gray-300 dark:border-darkText-2 bg-white dark:bg-darkText-primary px-2 text-center w-fit rounded-full my-2 sticky top-0 transition-opacity duration-300"
                      )}
                    >
                      {moment(m.time).calendar(null, {
                        sameDay: "[Today]",
                        lastDay: "[Yesterday]",
                        lastWeek: "dddd",
                        sameElse: function (now) {
                          return moment(m.time).isBefore(
                            moment().subtract(1, "year")
                          )
                            ? "MMM D, YYYY"
                            : "ddd, MMM D";
                        },
                      })}
                    </div>
                  )}
                  <Message
                    key={m.id}
                    {...m}
                    isLastInSequence={
                      index === messages.length - 1 ||
                      messages[index + 1]?.user !== m.user // Indicates whether this is the last message from d same sender in the consecutive sequence
                    }
                    isConsecutive={
                      index > 0 && messages[index - 1]?.user === m.user // Check if the previous message is from the same user
                    }
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 py-1 flex items-center justify-between gap-2">
          <input
            id="message"
            placeholder="Type your message here"
            className="p-3 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out"
            onChange={handleContentOnChange}
            value={inputContent}
            onKeyDown={handleKeyDown}
          />
          <Button
            disabled={isSending}
            size="xs_medium"
            className="px-4 py-2"
            onClick={handleSendTask}
          >
            {isSending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendMessageIcon />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesFromTask;

const messages = [
  {
    id: 1,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Hey team, did we get the client approval on the design?",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "2023-01-16 22:06:31",
  },
  {
    id: 2,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Yes, the client approved it yesterday evening.",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-18 22:07:31",
  },
  {
    id: 3,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Great! I’ll move forward with the backend integration.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "2024-09-18 22:08:31",
  },
  {
    id: 4,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Let me know if you need any help with testing.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "2024-09-18 23:15:31",
  },
  {
    id: 5,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Sure, Tolu. I'll let you know once we’re done with the integration.",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-18 23:18:31",
  },
  {
    id: 6,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Oladapo, how long do you think it’ll take?",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-20 05:30:31",
  },
  {
    id: 7,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "I should be done by later tonight, depending on the complexity.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "2024-09-20 15:03:12",
  },
  {
    id: 8,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Thanks, everyone. Let’s aim to wrap this up by tomorrow.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "2024-09-21 10:03:12",
  },
  {
    id: 9,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Sounds good to me!",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "2024-09-21 10:04:12",
  },
  {
    id: 10,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Ayobami, any updates on the frontend assets?",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-21 10:23:12",
  },
  {
    id: 11,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Yes, I just finalized the last set of assets. I'll share them soon.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "2024-09-21 13:06:12",
  },
  {
    id: 12,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Backend is 95% done. I’ll notify you when I’m wrapping up.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "2024-09-22 10:03:12",
  },
  {
    id: 13,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Awesome! Once everything is ready, we’ll sync for testing.",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-22 11:03:12",
  },
  {
    id: 14,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Let’s aim to do the review by noon today.",
    avatar: "/path/to/own-avatar.jpg",
    time: "2024-09-23 06:03:12",
  },
  {
    id: 15,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Agreed. I’ll be ready by then.",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "2024-09-23 10:03:12",
  },
  {
    id: 16,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Got my messages?",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "2024-09-23 10:03:12",
  },
];
