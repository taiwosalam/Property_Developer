"use client";
import Button from "@/components/Form/Button/button";
import { EmptyListIcon } from "@/public/icons/icons";

const NoTeamChat = () => {
  return (
    <div className="flex justify-center flex-col items-center my-auto w-full">
      <div className="w-full text-brand-9 h-full flex justify-center items-center mb-4">
        <EmptyListIcon />
      </div>
      <Button size="sm_medium" className="py-2 px-7">
        Create Team Chat
      </Button>
      <div className="mt-6 text-slate-600 space-y-4 mx-auto">
        <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
          You haven&apos;t created a team chat yet
        </p>
        <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20" />
        <p className="text-text-secondary dark:text-darkText-2 font-normal text-sm">
          It looks like you haven&apos;t created a team chat yet. Click Create Team
          Chat to set one up. Team chat allows you to create a group chat for a
          specific department in your organization.
          <br />
          <br />
          You can select users to add, assign a name and description. All added
          members will see the group in their profiles. To learn more about this
          page later, click your profile picture at the top right of the
          dashboard and select Assistance & Support.
        </p>
      </div>
    </div>
  );
};

export default NoTeamChat;
