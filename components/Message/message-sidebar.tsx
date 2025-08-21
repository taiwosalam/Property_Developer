import Input from "@/components/Form/Input/input";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import MessageCard from "@/components/Message/message-card";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { PlusIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { useMessages } from "@/contexts/messageContext";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const MessagesSidebar = ({
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  id,
}: any) => {
  const { role } = useRole();

  // PERMISSIONS
  const canViewAndreplyMessages =
    usePermission(role, "Can view and reply branch messages") ||
    role === "director";

  const {
    searchQuery,
    setSearchQuery,
    filteredMessages,
    usersMsgLoading,
    usersData,
    selectedFilters,
    pageUsersMsg,
    setSelectedFilters,
  } = useMessages();

  const handleFilterApply = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const inboxCount = pageUsersMsg.filter(
    (msg: any) => msg.type !== "group"
  ).length;
  const groupsCount = pageUsersMsg.filter(
    (msg: any) => msg.type === "group"
  ).length;
  const unreadCount = pageUsersMsg.filter(
    (msg: any) => msg.unread_count > 0
  ).length;

  return (
    <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar relative max-w-full">
    {/* // <div className="custom-flex-col pr-2 w-full min-h-0 overflow-y-auto custom-round-scrollbar relative max-w-full"> */}
      <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2 ">
      <div className="flex-1 relative min-w-0">
        <Input
          id="search"
          className="w-full min-w-0"
          placeholder="Search for messages..."
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
            onFilterApply={handleFilterApply}
            filterOptions={[
              { label: "Inbox", value: inboxCount || 0 },
              { label: "Groups", value: groupsCount || 0 },
              { label: "Unread", value: unreadCount || 0 },
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
        <div className="custom-flex-col  overflow-x-hidden relative z-[1] pb-4">
          {filteredMessages.map((message, idx) =>
            message.type === "group" && canViewAndreplyMessages ? (
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
      <div className="fixed bottom-[120px] z-[10] max-w-[50px]">
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
