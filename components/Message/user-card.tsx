import React from 'react'
import Image from 'next/image'

interface CardProps {
    imageUrl: string
    name: string
    position: string
}

const MessageUserCard = ({
    imageUrl,
    name,
    position
}: CardProps) => {
    return (
        <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center h-14 w-14 gap-2 custom-secondary-bg rounded-full">
                <Image
                    src={imageUrl}
                    alt="profile"
                    width={60}
                    height={60}
                    className="rounded-full w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col">
                <p className="text-text-primary dark:text-white text-lg font-medium">
                    {name}
                </p>
                <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal">
                    {position}
                </p>
            </div>
        </div>
    )
}

export default MessageUserCard