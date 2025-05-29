"use client";
import NetworkError from "@/components/Error/NetworkError";
import Button from "@/components/Form/Button/button";
import useFetch from "@/hooks/useFetch";

const TeamChat = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="custom-flex-col gap-6 max-w-[100%]">
        <div className="custom-flex-col gap-4">
          <div className="flex justify-center">
            {/* <Image src={LogoPlaceholder} alt="logo" width={200} /> */}
          </div>
          <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
            It appears that you do not have any chats open. Please click on a
            chat to open one, or click on the new message button to start a new
            message.
          </p>
        </div>
        <div className="flex justify-center">
          <Button size="sm_medium" className="py-2 px-7">
            Start New Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
