"use client";
import clsx from "clsx";
import moment from "moment";
import Input from "@/components/Form/Input/input";
import { SendMessageIcon, VerticalEllipsisIcon } from "@/public/icons/icons";
import Message from "./message";
import { useRef, useState, useCallback, useEffect } from "react";

const MessagesFromTask = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

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
          className="p-4 h-[320px] overflow-y-scroll custom-round-scrollbar custom-flex-col"
        >
          {messages.map((m, index) => {
            const currentDate = moment(m.time).format("YYYY-MM-DD");
            const previousDate =
              index > 0
                ? moment(messages[index - 1].time).format("YYYY-MM-DD")
                : null;
            const showDateLabel = currentDate !== previousDate;
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
          })}
        </div>
        <div className="px-4 py-1 flex items-center justify-between gap-2">
          <Input
            id="message"
            placeholder="Type your message here"
            className="w-full bg-neutral-3 rounded"
            inputClassName="border-none"
          />
          <div className="bg-brand-9 p-2 rounded grid place-items-center">
            <span className="text-white">
              <SendMessageIcon />
            </span>
          </div>
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
