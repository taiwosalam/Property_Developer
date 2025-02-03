import Message from "./message";
import { MessagesProps } from "./types";

const Messages: React.FC<MessagesProps> = ({ day, messages, userId }) => {
  return (
    <div className="custom-flex-col gap-8">
      {/* Day Label */}
      <div className="flex justify-center sticky top-0">
        <p className="py-1 px-2 rounded-[4px] bg-neutral-2 dark:bg-darkText-primary text-text-quaternary dark:text-white text-[10px] font-normal capitalize">
          {day}
        </p>
      </div>

      {/* Messages List */}
      <div className="custom-flex-col gap-4">
        {messages?.map((m, index) => {
          const isFromUser = m.sender_id === userId;
          return (
            <Message
              key={index}
              type={isFromUser ? "from user" : "to user"}
              time={m.time}
              text={m.text}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Messages;