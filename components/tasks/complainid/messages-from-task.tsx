import Input from "@/components/Form/Input/input";
import { SendMessageIcon, VerticalEllipsisIcon } from "@/public/icons/icons";
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
          <VerticalEllipsisIcon />
        </span>
      </div>

      <div className="pb-8 bg-white rounded-b-lg">
        <div className="p-4 h-[320px] overflow-y-scroll custom-round-scrollbar custom-flex-col gap-4">
          {messages.map((m) => (
            <Message key={m.id} {...m} />
          ))}
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

const messages = [
  {
    id: 1,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Hey team, did we get the client approval on the design?",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "Yesterday, 3:45pm",
  },
  {
    id: 2,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Yes, the client approved it yesterday evening.",
    avatar: "/path/to/own-avatar.jpg",
    time: "Yesterday, 3:47pm",
  },
  {
    id: 3,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Great! I’ll move forward with the backend integration.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "Yesterday, 4:00pm",
  },
  {
    id: 4,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Let me know if you need any help with testing.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "Yesterday, 4:15pm",
  },
  {
    id: 5,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Sure, Tolu. I'll let you know once we’re done with the integration.",
    avatar: "/path/to/own-avatar.jpg",
    time: "Yesterday, 4:18pm",
  },
  {
    id: 6,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Oladapo, how long do you think it’ll take?",
    avatar: "/path/to/own-avatar.jpg",
    time: "Yesterday, 4:19pm",
  },
  {
    id: 7,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "I should be done by later tonight, depending on the complexity.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "Yesterday, 4:30pm",
  },
  {
    id: 8,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Thanks, everyone. Let’s aim to wrap this up by tomorrow.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "Yesterday, 4:45pm",
  },
  {
    id: 9,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Sounds good to me!",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "Yesterday, 5:00pm",
  },
  {
    id: 10,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Ayobami, any updates on the frontend assets?",
    avatar: "/path/to/own-avatar.jpg",
    time: "Today, 8:10am",
  },
  {
    id: 11,
    user: "Mr Ayobami",
    isOwnMessage: false,
    text: "Yes, I just finalized the last set of assets. I'll share them soon.",
    avatar: "/path/to/ayobami-avatar.jpg",
    time: "Today, 8:15am",
  },
  {
    id: 12,
    user: "Mr Oladapo",
    isOwnMessage: false,
    text: "Backend is 95% done. I’ll notify you when I’m wrapping up.",
    avatar: "/path/to/oladapo-avatar.jpg",
    time: "Today, 8:25am",
  },
  {
    id: 13,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Awesome! Once everything is ready, we’ll sync for testing.",
    avatar: "/path/to/own-avatar.jpg",
    time: "Today, 8:30am",
  },
  {
    id: 14,
    user: "Muibi Saheed",
    isOwnMessage: true,
    text: "Let’s aim to do the review by noon today.",
    avatar: "/path/to/own-avatar.jpg",
    time: "Today, 8:31am",
  },
  {
    id: 15,
    user: "Mr Tolu",
    isOwnMessage: false,
    text: "Agreed. I’ll be ready by then.",
    avatar: "/path/to/tolu-avatar.jpg",
    time: "Today, 8:35am",
  },
];

export default MessagesFromTask;
