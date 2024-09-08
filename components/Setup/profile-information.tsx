// Imports
import { useState, useContext, useEffect } from "react";
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import { titles } from "@/data";
import { FlowProgressContext } from "../FlowProgress/flow-progress";

const ProfileInformation = () => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [aboutDirector, setAboutDirector] = useState("");

  // To trigger Flow Progress
  useEffect(() => {
    handleInputChange();
  }, [aboutDirector, handleInputChange]);
  return (
    <div className="custom-flex-col gap-6 max-w-[940px]">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="director_name"
          label="full name"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f"
          className="lg:col-span-2"
        />
        <Select
          name="director_title"
          id="director_title"
          label="personal title / qualification"
          options={titles}
          hiddenInputClassName="setup-f"
        />

        <Select
          name="director_experience"
          id="director_experience"
          label="years in business"
          placeholder="Write here"
          options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
          hiddenInputClassName="setup-f"
        />
        <Input
          id="director_email"
          label="alternative email"
          type="email"
          placeholder="example@mail.com"
          inputClassName="rounded-[8px] setup-f"
        />
        <PhoneNumberInput
          id="director_phone"
          label="phone number"
          placeholder="800 0000 000"
          inputClassName="setup-f"
        />
      </div>
      <div>
        <input
          type="hidden"
          name="director_about"
          value={aboutDirector}
          className="setup-f"
        />
        <TextArea
          id="director_about"
          label="About Director"
          placeholder="Write about the director"
          value={aboutDirector}
          onChange={setAboutDirector}
        />
      </div>
    </div>
  );
};

export default ProfileInformation;
