import Input from "@/components/Form/Input/input";
import { VerticalEllipsis, SendMessageIcon } from "@/public/icons/icons";
import Image from "next/image";
import Message from "./message";

const MessagesFromTask = () => {
  return (
    <div
      className="rounded-lg border border-[rgba(193,194,195,0.40)] bg-white"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="p-4 flex justify-between bg-brand-1 rounded-t-lg">
        <h6 className="text-black text-base font-medium">Messages from Task</h6>
        <span className="text-borders-normal">
          <VerticalEllipsis />
        </span>
      </div>

      <div className="px-4 pb-8 bg-white rounded-b-lg">
        <div className="pt-4 h-[370px] overflow-y-scroll mb-4 custom-round-scrollbar custom-flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.isOwnMessage ? "justify-end" : ""
              }`}
            >
              {/* Show avatar on the left for others and on the right for own messages */}
              {!message.isOwnMessage && (
                <Image
                  src={message.avatar}
                  alt={message.user}
                  width={40}
                  height={40}
                  className="rounded-full mr-2"
                />
              )}

              <div
                className={`p-3 rounded-lg text-sm max-w-xs ${
                  message.isOwnMessage
                    ? "bg-brand-9 text-white"
                    : "bg-neutral-3 text-black"
                }`}
              >
                <p className="font-bold">{message.user}</p>
                <p>{message.text}</p>
              </div>

              {/* Own message avatar on the right */}
              {message.isOwnMessage && (
                <Image
                  src={message.avatar}
                  alt={message.user}
                  width={40}
                  height={40}
                  className="rounded-full ml-2"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
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

const messages = [
  {
    id: 1,
    user: "Muibi Saheed",
    isOwnMessage: true, // Current user
    text: "Hey team, do we have updates on the task?",
    avatar: "/path/to/own-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 2,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Yes, I'm working on the designs now. Should be done by EOD.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 3,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "I've just completed the backend integration.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "8:32am",
  },

  {
    id: 4,
    user: "Muibi Saheed",
    isOwnMessage: true, // Current user
    text: "Great! Once designs are in, we can test everything together.",
    avatar: "/path/to/own-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 5,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Any updates on the client feedback?",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 6,
    user: "Muibi Saheed",
    isOwnMessage: true, // Current user
    text: "Client has approved the changes. We’re good to go!",
    avatar: "/path/to/own-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 7,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Awesome! I'll wrap up my part and notify you when it's done.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 8,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Let's have a final review tomorrow morning.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 9,
    user: "Muibi Saheed",
    isOwnMessage: true, // Current user
    text: "Sounds good. I'll prepare the presentation for the review.",
    avatar: "/path/to/own-avatar.jpg",
    time: "8:32am",
  },
  {
    id: 10,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Thanks, everyone! Let’s aim to finish by tomorrow.",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "8:32am",
  },
];

export default MessagesFromTask;
