import Input from "@/components/Form/Input/input";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import MessageCard from "@/components/Message/message-card";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { PlusIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { useMessages } from "@/contexts/messageContext";

const MessagesSidebar = ({
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  id,
}: any) => {
  const {
    searchQuery,
    setSearchQuery,
    filteredMessages,
    usersMsgLoading,
    usersData,
  } = useMessages();

  return (
    <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar relative">
      <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2">
        <div className="flex-1 relative">
          <Input
            id="search"
            className="w-full"
            placeholder="Search for messages"
            leftIcon={"/icons/search-icon.svg"}
            inputClassName="pr-[52px] border-transparent"
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <FilterButton
              noTitle
              className="bg-transparent py-[10px] px-4"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />
            <MessagesFilterMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              filterOptions={[
                { label: "Inbox" },
                { label: "Groups" },
                { label: "Unread" },
              ]}
            />
          </div>
        </div>
      </div>
      {filteredMessages.length === 0 ? (
        <></>
      ) : usersMsgLoading ? (
        <div className="custom-flex-col gap-2 relative z-[1] pb-4">
          {[...Array(8)].map((_, idx) => (
            <MessageCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="custom-flex-col relative z-[1] pb-4">
          {filteredMessages.map((message, idx) =>
            message.type === "group" ? (
              <MessageCard
                key={idx}
                {...message}
                highlight={message.id === id}
              />
            ) : (
              <MessageCard
                key={idx}
                {...message}
                highlight={message.id === id}
              />
            )
          )}
        </div>
      )}
      {/* Floating action button */}
      <div className="fixed bottom-20 z-[10] max-w-[50px]">
        <Modal>
          <ModalTrigger asChild>
            <button
              onClick={() => {}}
              className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
            >
              <PlusIcon />
            </button>
          </ModalTrigger>
          <ModalContent>
            <SelectChatUsersModal loading={usersMsgLoading} />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default MessagesSidebar;
