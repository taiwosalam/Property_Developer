import React from "react";

// Imports
import Input from "../Form/Input/input";

const ProfileInformation = () => {
  return (
    <div className="custom-flex-col gap-6">
      <div className="flex gap-5">
        <Input
          required
          id="fullname"
          label="full name"
          placeholder="Ajadi david"
          className="flex-1"
        />
        <Input
          id="title"
          label="personal title / qualification"
          placeholder="ESQ"
          className="flex-1"
        />
        <Input
          id="business-years"
          label="years in business"
          placeholder="10"
          className="flex-1"
        />
        <Input
          id="alt-email"
          label="alternative email"
          placeholder="ajadidavid@gmail.com"
          className="flex-1"
        />
      </div>
      <div className="flex gap-5">
        <Input
          id="about-director"
          label="about director"
          placeholder=""
          className="flex-1"
        />
        <Input
          id="phone-number"
          label="phone number"
          placeholder="08159225689"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ProfileInformation;
