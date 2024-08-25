import React from "react";

// Import
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";

const ProfilePicture = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="profile picture">
        The profile photo size should be 180 x 180 pixels with a maximum file
        size of 2MB.
      </SectionHeading>
      <div className="flex gap-2">
        <div className="w-[200px] h-[200px] bg-text-disabled"></div>
        <div className="flex items-end">
          <Button variant="change" size="sm">
            Change image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
