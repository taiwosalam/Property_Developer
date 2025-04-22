"use client";
// Imports
import { useContext, useEffect, useState } from "react";
import DateInput from "../Form/DateInput/date-input";
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import { titles } from "@/data";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import dayjs from "dayjs";

const ProfileInformation = ({
  data,
  year,
  bio,
}: {
  data?: any;
  year?: string;
  bio?: string;
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [phoneNumber, setPhoneNumber] = useState("");

  const yearsOptions = Array.from({ length: 10 }, (_, i) => {
    const yearValue = i + 1;
    return { label: `${yearValue} years +`, value: `${yearValue}+` };
  });

  return (
    <div className="custom-flex-col gap-6 max-w-[940px]">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          id="director_personal_title"
          label="personal title"
          options={titles}
          hiddenInputClassName="setu-f"
          defaultValue={data?.designation}
        />

        <Input
          required
          id="director_full_name"
          label="full name"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          className="lg:col-span-2"
          defaultValue={data?.full_name}
        />

        <DateInput
          id="director_experience"
          label="years in business"
          // onChange={handleInputChange}
          inputClassName="setu-f required"
          disableFuture
          defaultValue={year ? dayjs(year) : undefined}
        />
        <Input
          id="director_email"
          label="email"
          type="email"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          defaultValue={data?.email}
        />

        <PhoneNumberInput
          id="director_phone_number"
          label="phone number"
          placeholder="800 0000 000"
          value={data?.phone_number}
          onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
        {/* <PhoneNumberInput
          id="director_phone_number"
          label="phone number"
          placeholder="800 0000 000"
          inputClassName="setup-f"
          onChange={(e) => handeleChange(e)}
          // defaultValue={data?.phone_number}
        /> */}
      </div>
      <TextArea
        id="about_director"
        label="About Director"
        placeholder="Write about the director"
        hiddenInputClassName="setu-f"
        defaultValue={bio}
      />
    </div>
  );
};

export default ProfileInformation;
