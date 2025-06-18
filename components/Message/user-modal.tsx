import React, { useState, useEffect } from "react";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Input from "../Form/Input/input";
import FilterButton from "../FilterButton/filter-button";
import MessagesFilterMenu from "./messages-filter-menu";
import MessageUserCard from "./user-card";
import {
  Filters,
  UsersProps,
} from "@/app/(nav)/(messages-reviews)/messages/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModal } from "../Modal/modal";
import { positionMap } from "@/app/(nav)/(messages-reviews)/messages/data";
import MessageUserCardSkeleton from "../Skeleton/message-user-card-skeleton";
import useWindowWidth from "@/hooks/useWindowWidth";
import { getLocalStorage } from "@/utils/local-storage";
import { useGlobalStore } from "@/store/general-store";
import clsx from "clsx";

const SelectChatUsersModal = ({
  usersData,
  loading,
  filters = {
    roles: { manager: 0, account: 0, staff: 0, director: 0 },
    branches: [],
  },
}: {
  usersData: UsersProps[];
  filters?: Filters;
  loading?: boolean;
}) => {
  const router = useRouter();
  const { setIsOpen } = useModal();
  const loggedInUserId = getLocalStorage("user_id");
  const { isMobile } = useWindowWidth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { setGlobalInfoStore, getGlobalInfoStore } = useGlobalStore();
  const [filteredUsers, setFilteredUsers] = useState<UsersProps[]>(
    usersData || []
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle search input change
  const handleSearchChange = (
    data: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(data);
  };

  const handleFilterApply = (selectedFilters: string[]) => {
    if (selectedFilters.length === 0) {
      setFilteredUsers(usersData?.filter((user) => user.id !== loggedInUserId)); // Reset to all users except the logged-in user if no filter is selected
    } else {
      const normalizedFilters = selectedFilters
        .map((filter) => positionMap[filter]) // Convert filters to match user.position
        .filter(Boolean); // Remove undefined values

      const filtered = usersData?.filter(
        (user) =>
          normalizedFilters.includes(user.position) &&
          user.id !== loggedInUserId
      );

      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(usersData?.filter((user) => user.id !== loggedInUserId)); // Show all users except the logged-in user when search is empty
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = usersData.filter(
        (user) =>
          (user.name.toLowerCase().includes(lowercasedTerm) ||
            user.position?.toLowerCase().includes(lowercasedTerm)) &&
          user.id !== loggedInUserId
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, usersData, loggedInUserId]);

  // const handleUserClicked = (id: string) => {
  //   router.push("/messages/" + id);
  //   setIsOpen(false);
  // };


  const handleUserClicked = (user: UsersProps) => {
    try {
      const currentMessageUserData = getGlobalInfoStore("messageUserData");
      const newMessageUserData = {
        branch_id: Number(user.branch_id) || 0,
        id: Number(user.id),
        imageUrl: user.imageUrl || "",
        name: user.name,
        position: user.position || "",
      };

      // Compare using JSON.stringify
      if (
        JSON.stringify(currentMessageUserData) !==
        JSON.stringify(newMessageUserData)
      ) {
        setGlobalInfoStore("messageUserData", newMessageUserData);
      }

      router.push(`/messages/${user.id}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to navigate to messages");
    }
  };

  return (
    <LandlordTenantModalPreset
      heading="Contact List"
      noPaddingTop
      style={{
        width: isMobile ? "80%" : "40%",
        maxWidth: "80%",
        maxHeight: "70%",
        minHeight: "60%",
      }}
    >
      <div className="flex-1 flex sticky z-[3] top-0 pt-[12px] md:pt-[20px] items-center">
        <div className="flex-1 relative">
          <Input
            id="search"
            className="w-full"
            placeholder="Search for users"
            leftIcon={"/icons/search-icon.svg"}
            inputClassName="pr-[52px] border-transparent"
            value={searchTerm}
            onChange={handleSearchChange} // Attach the change handler
          />

          <div className="absolute top-1/2 flex items-center right-0 -translate-y-1/2">
            <FilterButton
              noTitle
              className="bg-transparent py-[10px] px-4"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />
            {!loading && (
              <MessagesFilterMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onFilterApply={handleFilterApply}
                setSelectedLabel={setSelectedFilter}
                filterOptions={[
                  { label: "Director", value: filters.roles?.director ?? 0 },
                  {
                    label: "Branch Manager",
                    value: filters.roles?.manager ?? 0,
                  },
                  {
                    label: "Account Officer",
                    value: filters.roles?.account ?? 0,
                  },
                  { label: "Staff", value: filters.roles?.staff ?? 0 },
                  // { label: "Landlord/Landlady", value: 0 },
                  // { label: "Tenant/Occupants", value: 0 },
                  // { label: "Service Provider", value: 0 },
                ]}
              />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        [...Array(5)].map((_, index) => <MessageUserCardSkeleton key={index} />)
      ) : filteredUsers?.length > 0 ? (
        filteredUsers?.map((user) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleUserClicked(user)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUserClicked(user);
              }
            }}
            className={clsx(
              "cursor-pointer transition-colors duration-200 hover:bg-neutral-1 dark:hover:bg-[#2A2B27]"
            )}
            key={user.id}
          >
            <MessageUserCard
              imageUrl={user.imageUrl}
              name={user.name}
              position={user.position}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-muted mt-4 text-[20px] font-semibold">
          No user found.
        </p>
      )}
    </LandlordTenantModalPreset>
  );
};

export default SelectChatUsersModal;
