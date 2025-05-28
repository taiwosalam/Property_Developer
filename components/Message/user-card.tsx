import React from "react";
import Image from "next/image";

interface CardProps {
  imageUrl: string;
  name: string;
  position: string;
}

const positionMap: Record<string, string> = {
  manager: "Branch Manager",
  director: "Director",
  staff: "Staff",
  account: "Account Officer",
};

const MessageUserCard = ({ imageUrl, name, position }: CardProps) => {
  const displayPosition = positionMap[position.toLowerCase()] || position;
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
        <p className="text-text-primary dark:text-white text-lg font-medium capitalize">
          {name}
        </p>
        <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal capitalize">
          {displayPosition}
        </p>
      </div>
    </div>
  );
};

export default MessageUserCard;
