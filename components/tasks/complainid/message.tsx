import clsx from "clsx";
import Image from "next/image";
import SamplePic from "@/public/empty/SampleLandlord.jpeg";

interface MessageProps {
  text: string;
  time: string;
  user: string;
  isOwnMessage: boolean;
  avatar: string;
}

const Message: React.FC<MessageProps> = ({
  text,
  user,
  isOwnMessage,
  time,
  avatar,
}) => {
  return (
    <div className={clsx("flex text-xs", { "justify-end": isOwnMessage })}>
      <div
        className={clsx(
          !isOwnMessage && "flex items-end gap-1",
          "max-w-[70%] font-medium"
        )}
      >
        {!isOwnMessage && (
          <div className="rounded-full overflow-hidden w-[30px] h-[30px] relative flex-shrink-0">
            <Image src={SamplePic} alt={user} fill className="object-cover" />
          </div>
        )}
        <div
          className={clsx(
            "py-2 px-3 rounded-t-lg flex flex-col",
            !isOwnMessage
              ? "bg-neutral-2 rounded-br-lg"
              : "bg-status-caution-3 rounded-bl-lg"
          )}
        >
          {!isOwnMessage && <p className="text-brand-10 mb-1">{user}</p>}
          <p className="text-text-quaternary">{text}</p>
          <time className="mt-1 font-normal text-[10px] text-text-disabled self-end">
            {time}
          </time>
        </div>
      </div>
    </div>
  );
};

export default Message;
