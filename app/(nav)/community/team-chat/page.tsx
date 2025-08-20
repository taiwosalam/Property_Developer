"use client";
import { empty } from "@/app/config";
import NetworkError from "@/components/Error/NetworkError";
import Button from "@/components/Form/Button/button";
import useFetch from "@/hooks/useFetch";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { getLocalStorage } from "@/utils/local-storage";
import Image from "next/image";

const TeamChat = () => {
  const { company_logo } = usePersonalInfoStore();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[100%]">
        <div className="custom-flex-col gap-4 px-10">
          <div className="flex justify-center h-[70px] w-[70px]">
            <Image
              src={company_logo || empty}
              alt="logo"
              width={500}
              height={500}
              className="object-contain h-full w-full"
            />
          </div>
          <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
            You don’t have any recent group chats open. To start or continue a
            conversation, click on a title from the chat list.
          </p>
        </div>
        {/* <div className="flex justify-center">
          <Button size="sm_medium" className="py-2 px-7">
            Start New Message
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default TeamChat;
