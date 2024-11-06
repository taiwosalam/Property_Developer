import FilterButton from "@/components/FilterButton/filter-button";
import { message_card_data } from "@/components/Message/data";
import MessageCard from "@/components/Message/message-card";
import SearchInput from "@/components/SearchInput/search-input";

const ChatList: React.FC<{
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
}> = ({ activeChatId, setActiveChatId }) => {
  return (
    <div className="h-full flex flex-col gap-4 relative">
      <div className="flex gap-3 sticky top-0 z-[2] p-4 pb-0 bg-white dark:bg-darkText-primary">
        <SearchInput
          placeholder="Search for messages"
          className="flex-1 bg-neutral-2"
        />
        <FilterButton
          className="bg-neutral-2 rounded-lg dark:bg-darkText-primary dark:border dark:border-darkText-1"
          noTitle
          style={{
            padding: "10px 16px",
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-round-scrollbar custom-flex-col relative z-[1] pl-4 pr-2 pt-0 pb-4">
        {message_card_data.map((message, idx) => (
          <MessageCard
            key={idx}
            {...message}
            highlight={message.id === activeChatId}
            onClick={() => setActiveChatId(message.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
