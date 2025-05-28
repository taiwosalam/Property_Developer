import { ChevronLeft } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { GroupedMessages } from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/type";
import { empty } from "@/app/config";

interface Participant {
  id: string;
  name: string;
  pfp: string;
  onlineStatus: string;
}

const IndividualChat: React.FC<{
  closeChat: () => void;
  messages: GroupedMessages[];
  participant: Participant;
}> = ({ closeChat, messages, participant }) => {
  return (
    <div className="h-full flex flex-col relative">
      <div className="sticky z-[2] top-0 py-4 px-6 bg-neutral-2 dark:bg-[#3C3D37]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeChat}
            aria-label="Back"
            className="p-1"
          >
            <ChevronLeft />
          </button>
          <button className="flex items-center gap-4 text-left" type="button">
            <Picture
              src={participant.pfp ?? empty}
              alt="profile picture"
              size={32}
              rounded
              status={participant.onlineStatus === "online"}
            />
            <div>
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {participant.name}
              </p>
              <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
                {participant.onlineStatus}
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="flex-1 z-[1] py-5 px-6 overflow-auto custom-round-scrollbar bg-white dark:bg-darkText-primary custom-flex-col gap-8">
        {messages.map((group) => (
          <Messages
            key={group.day}
            day={group.day}
            messages={group.messages}
            noScroll
          />
        ))}
      </div>
    </div>
  );
};

export default IndividualChat;
