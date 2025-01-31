"use client";

import { useParams, useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { message_card_data, message_data } from "@/components/Message/data";

const Chat = () => {
  const router = useRouter();
  const { id } = useParams();

  const data = message_data.find((item) => item.id === id);

  if (!data) return router.replace("/messages");

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/messages")}>
            <Picture src={ChevronLeft} alt="back" size={20} />
          </button>
          <button className="flex items-center gap-4 text-left">
            <Picture
              src={data.pfp}
              alt="profile picture"
              size={32}
              rounded
              status
            />
            <div className="custom-flex-col">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {data.fullname}
              </p>
              <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
                Tap here for contact info
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        <Messages day="yesterday" />
        <Messages day="today" />
      </div>
    </>
  );
};

export default Chat;
