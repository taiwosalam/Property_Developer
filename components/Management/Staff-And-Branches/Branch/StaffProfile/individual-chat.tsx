import { ChevronLeft } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";

const IndividualChat: React.FC<{
  closeChat: () => void;
}> = ({ closeChat }) => {
  return (
    <div className="max-h-[600px] flex flex-col">
      <div className="py-4 px-6 bg-neutral-2 dark:bg-[#3C3D37]">
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
              src="/empty/SampleLandlord.jpeg"
              alt="profile picture"
              size={32}
              rounded
              status
            />
            <div>
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                John Doe
              </p>
              <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
                Online
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="flex-1 py-5 px-6 overflow-auto custom-round-scrollbar bg-white dark:bg-darkText-primary custom-flex-col gap-8">
        <Messages day="yesterday" />
        <Messages day="today" />
      </div>
    </div>
  );
};

export default IndividualChat;
