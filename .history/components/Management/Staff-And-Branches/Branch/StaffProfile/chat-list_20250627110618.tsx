import { StaffChatTypes } from "@/app/(nav)/management/staff-branch/[branchId]/branch-staff/[staffId]/type";
import FilterButton from "@/components/FilterButton/filter-button";
import { message_card_data } from "@/components/Message/data";
import MessageCard from "@/components/Message/message-card";
import SearchInput from "@/components/SearchInput/search-input";
import { useEffect, useState } from "react";

const ChatList: React.FC<{
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  staffChats: StaffChatTypes[];
}> = ({ activeChatId, setActiveChatId, staffChats }) => {
  const [filteredChats, setFilteredChats] = useState<StaffChatTypes[]>(staffChats);
  // console.log("staffChats passed to list", staffChats);

  // Handle search input
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredChats(staffChats); // Reset to original chats if query is empty
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = staffChats.filter((chat) => {
      // Search in fullname and desc
      const matchesFullname = chat.fullname?.toLowerCase().includes(lowerQuery);
      const matchesDesc = chat.desc?.toLowerCase().includes(lowerQuery);

      // Search in message text within groupedMessages
      const matchesMessages = chat.groupedMessages.some((group) =>
        group.messages.some((msg) => msg.text.toLowerCase().includes(lowerQuery))
      );

      return matchesFullname || matchesDesc || matchesMessages;
    });

    setFilteredChats(filtered);
  };

  // Update filteredChats when staffChats prop changes
  useEffect(() => {
    setFilteredChats(staffChats);
  }, [staffChats]);

  return (
    <div className="h-full flex flex-col gap-4 relative">
      <div className="flex gap-3 sticky top-0 z-[2] p-4 pb-0 bg-white dark:bg-darkText-primary">
        <SearchInput
          placeholder="Search for messages"
          className="flex-1 bg-neutral-2"
          onSearch={handleSearch}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-round-scrollbar custom-flex-col relative z-[1] pl-4 pr-2 pt-0 pb-4">
        {filteredChats.length > 0 ? (
          filteredChats.map((message, idx) => (
            <MessageCard
              key={idx}
              pfp={message.pfp}
              desc={message.desc}
              time={message.time}
              fullname={message.fullname}
              id={message.id}
              messages={message.messages}
              verified={message.verified}
              content_type={message.content_type}
              online={message.online}
              last_seen={message.last_seen}
              title=""
              role=""
              tier={0}
              // unread_count={message.unread_count}
              highlight={message.id === activeChatId}
              onClick={() => setActiveChatId(message.id)}
            />
          ))
        ) : (
          <p className="text-text-disabled text-center py-4">No Chat/Message found</p>
        )}
      </div>

      
      {/* <div className="flex-1 overflow-y-auto custom-round-scrollbar custom-flex-col relative z-[1] pl-4 pr-2 pt-0 pb-4">
        {filteredChats?.map((message, idx) => (
          <MessageCard
            key={idx}
            pfp={message.pfp}
            desc={message.desc}
            time={message.time}
            fullname={message.fullname}
            id={message.id}
            messages={message.messages}
            verified={message.verified}
            content_type={message.content_type}
            online={message.online}
            last_seen={message.last_seen}
            // unread_count={message.unread_count}
            highlight={message.id === activeChatId}
            onClick={() => setActiveChatId(message.id)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default ChatList;
