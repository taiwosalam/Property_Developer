import clsx from "clsx";
import Image from "next/image";

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
      <div className="flex gap-1">
        {!isOwnMessage && (
          <div className="rounded-full w-[30px] h-[30px] relative">
            <Image src={avatar} alt={user} fill className="object-cover" />
          </div>
        )}
        <div
          className={clsx(
            "py-2 px-3 rounded-t-lg",
            !isOwnMessage ? "bg-neutral-2" : "bg-status-caution-3"
          )}
        >
          {!isOwnMessage && <p className="text-brand-10 mb-1">{user}</p>}
          <p className="text-text-quaternary">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
