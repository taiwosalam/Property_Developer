import React, { useState } from 'react'
import LandlordTenantModalPreset from '../Management/landlord-tenant-modal-preset'
import Input from '../Form/Input/input'
import FilterButton from '../FilterButton/filter-button'
import MessagesFilterMenu from './messages-filter-menu'
import Image from 'next/image'
import Avatar1 from "@/public/empty/avatar-1.svg";
import MessageUserCard from './user-card'
import { UsersProps } from '@/app/(nav)/(messages-reviews)/messages/types'

const SelectChatUsersModal = ({usersData}: {usersData: UsersProps[]}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <LandlordTenantModalPreset
            heading="Select User to send message"
            style={{ width: "40%", maxWidth: "40%", maxHeight: "70%" }}
        // back={activeStep !== "options" ? { handleBack } : undefined}
        >
            <div className="flex-1 relative -mt-4 mb-4 sticky top-4 z-[2]">
                <Input
                    id="search"
                    className="w-full"
                    placeholder="Search for users"
                    leftIcon={"/icons/search-icon.svg"}
                    inputClassName="pr-[52px] border-transparent"
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
            {usersData.map((user) => (
                <MessageUserCard
                    key={user.id}
                    imageUrl={user.imageUrl}
                    name={user.name}
                    position={user.position}
                />
            ))}
        </LandlordTenantModalPreset>
    )
}

export default SelectChatUsersModal