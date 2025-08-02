import clsx from "clsx";
import Image from "next/image";
import SamplePic from "@/public/empty/SampleLandlord.jpeg";

interface MessageProps {
  text: string;
  time: string;
  user: string;
  isOwnMessage: boolean;
  avatar: string;
  isLastInSequence: boolean;
  isConsecutive: boolean;
}

const Message: React.FC<MessageProps> = ({
  text,
  user,
  isOwnMessage,
  time,
  avatar,
  isLastInSequence,
  isConsecutive,
}) => {
  // Use system's locale format for time
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  }).format(new Date(time));

  return (
    <div
      className={clsx("w-full flex text-xs", { "justify-end": isOwnMessage })}
    >
      <div
        className={clsx(
          !isOwnMessage && "flex items-end gap-1",
          "max-w-[70%] font-medium"
        )}
      >
        {!isOwnMessage && (
          <>
            {isLastInSequence ? (
              <div className="rounded-full overflow-hidden w-[30px] h-[30px] relative flex-shrink-0 custom-secondary-bg">
                <Image
                  src={avatar}
                  alt={user}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-[30px] flex-shrink-0"></div>
            )}
          </>
        )}
        <div
          className={clsx(
            "py-2 px-3 rounded-t-lg flex flex-col",
            !isOwnMessage
              ? clsx(
                  "bg-neutral-2",
                  isLastInSequence
                    ? "rounded-t-lg rounded-br-lg" // Last in sequence, remove bottom left corner radius
                    : "rounded-lg" // For consecutive messages not last in sequence, full border-radius
                )
              : clsx(
                  "bg-status-caution-1",
                  isLastInSequence
                    ? "rounded-t-lg rounded-bl-lg" // Last in sequence for own messages, remove bottom right corner radius
                    : "rounded-lg" // For consecutive own messages not last in sequence, full border-radius
                )
          )}
        >
          {!isOwnMessage && !isConsecutive && (
            <p className="text-brand-10 mb-1 capitalize">{user}</p>
          )}
          <p className="text-text-quaternary">{text}</p>
          <time className="mt-1 font-normal text-[10px] text-text-disabled self-end">
            {formattedTime}
          </time>
        </div>
      </div>
    </div>
  );
};

export default Message;
