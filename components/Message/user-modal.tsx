import React, { useState, useEffect } from 'react';
import LandlordTenantModalPreset from '../Management/landlord-tenant-modal-preset';
import Input from '../Form/Input/input';
import FilterButton from '../FilterButton/filter-button';
import MessagesFilterMenu from './messages-filter-menu';
import MessageUserCard from './user-card';
import { Filters, UsersProps } from '@/app/(nav)/(messages-reviews)/messages/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModal } from '../Modal/modal';
import { positionMap } from '@/app/(nav)/(messages-reviews)/messages/data';
import MessageUserCardSkeleton from '../Skeleton/message-user-card-skeleton';
import useWindowWidth from '@/hooks/useWindowWidth';

const SelectChatUsersModal = ({
    usersData,
    loading,
    filters = { 
        roles: { manager: 0, account: 0, staff: 0, director: 0 },
        branches: [] 
    },  
}: {
    usersData: UsersProps[],
    filters?: Filters
    loading?: boolean;
}) => {
    const router = useRouter()
    const { setIsOpen } = useModal()
    const { isMobile } = useWindowWidth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UsersProps[]>(usersData || []);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle search input change
    const handleSearchChange = (data: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(data);
    };


    const handleFilterApply = (selectedFilters: string[]) => {
        if (selectedFilters.length === 0) {
            setFilteredUsers(usersData); // Reset to all users if no filter is selected
        } else {
            const normalizedFilters = selectedFilters
                .map(filter => positionMap[filter]) // Convert filters to match user.position
                .filter(Boolean); // Remove undefined values

            const filtered = usersData.filter(user =>
                normalizedFilters.includes(user.position)
            );

            setFilteredUsers(filtered);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(usersData); // Show all users when search is empty
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = usersData.filter(user =>
                user.name.toLowerCase().includes(lowercasedTerm) ||
                user.position?.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, usersData]);

    const handleUserClicked = (id: string) => {
        router.push('/messages/' + id)
        setIsOpen(false)
    }

    return (
        <LandlordTenantModalPreset
            heading="Select User to send message"
            style={{ width: isMobile ? "80%" : "40%", maxWidth: "80%", maxHeight: "70%" }}
        >
            <div className="flex-1 relative -mt-4 mb-4 sticky top-4 z-[2]">
                <Input
                    id="search"
                    className="w-full"
                    placeholder="Search for users"
                    leftIcon={"/icons/search-icon.svg"}
                    inputClassName="pr-[52px] border-transparent"
                    value={searchTerm}
                    onChange={handleSearchChange} // Attach the change handler
                />

                <div className="absolute top-1/2 right-0 -translate-y-1/2">
                    <FilterButton
                        noTitle
                        className="bg-transparent py-[10px] px-4"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    />
                    {!loading &&
                        <MessagesFilterMenu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            onFilterApply={handleFilterApply}
                            setSelectedLabel={setSelectedFilter}
                            filterOptions={[
                                { label: "Branch Manager", value: filters.roles?.manager ?? 0 },
                                { label: "Account Officer", value: filters.roles?.account ?? 0 },
                                { label: "Staff", value: filters.roles?.staff ?? 0 },
                                { label: "Director", value: filters.roles?.director ?? 0 },
                                { label: "Landlord/Landlady", value: 0 },
                                { label: "Tenant/Occupants", value: 0 },
                                { label: "Service Provider", value: 0 },
                            ]}
                        />}
                </div>
            </div>

            {/* User List */}
            {loading
                ? [...Array(5)].map((_, index) => <MessageUserCardSkeleton key={index} />)
                : filteredUsers?.length > 0 ? (
                    filteredUsers?.map((user) => (
                        <div className='hover:cursor-pointer' onClick={() => handleUserClicked(user.id)} key={user.id}>
                            <MessageUserCard
                                imageUrl={user.imageUrl}
                                name={user.name}
                                position={user.position}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No user found.</p>
                )
            }
        </LandlordTenantModalPreset>
    );
};

export default SelectChatUsersModal;