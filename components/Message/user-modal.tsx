import React, { useState, useEffect } from 'react';
import LandlordTenantModalPreset from '../Management/landlord-tenant-modal-preset';
import Input from '../Form/Input/input';
import FilterButton from '../FilterButton/filter-button';
import MessagesFilterMenu from './messages-filter-menu';
import MessageUserCard from './user-card';
import { UsersProps } from '@/app/(nav)/(messages-reviews)/messages/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModal } from '../Modal/modal';

const SelectChatUsersModal = ({ usersData }: { usersData: UsersProps[] }) => {
    const router = useRouter()
    const { setIsOpen } = useModal()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<UsersProps[]>(usersData);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle search input change
    const handleSearchChange = (data: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(data);
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
            style={{ width: "40%", maxWidth: "40%", maxHeight: "70%" }}
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
                    <MessagesFilterMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        filterOptions={[
                            { label: "Branch Manager" },
                            { label: "Account Officer" },
                            { label: "Staff" },
                            { label: "Landlord/Landlady" },
                            { label: "Tenant/Occupants" },
                            { label: "Service Provider" },
                        ]}
                    />
                </div>
            </div>

            {/* User List */}
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
            )}
        </LandlordTenantModalPreset>
    );
};

export default SelectChatUsersModal;