// Imports
import { useState } from "react";
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumber/phone-number";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import { titles } from "@/data";

const ProfileInformation = () => {
  const [aboutDirector, setAboutDirector] = useState("");
  return (
    <div className="custom-flex-col gap-6">
      <div className="flex gap-5">
        <Input
          required
          id="director_name"
          label="full name"
          placeholder="Write here"
          className="flex-1 max-w-[620px]"
          inputTextStyles={`text-sm font-normal`}
        />
        <Select
          id="director_title"
          label="personal title / qualification"
          className="flex w-[300px]"
          options={titles}
          textStyles={`text-sm font-normal`}
        />
      </div>
      <div className="flex gap-5">
        <Select
          id="director_experience"
          label="years in business"
          placeholder="Write here"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal`}
          options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
        />
        <Input
          id="director_email"
          label="alternative email"
          type="email"
          placeholder="example@mail.com"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal`}
        />
        <PhoneNumberInput
          id="director_phone"
          label="phone number"
          placeholder="80 0000 0000"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal`}
        />
      </div>
      <div>
        <div>
          {/* Hidden input field for about director*/}
          <input type="hidden" name="director_about" value={aboutDirector} />
          <TextArea
            id="director_about"
            label="About Director"
            placeholder="Write about the director"
            textAreaStyles="w-[940px]"
            value={aboutDirector}
            onChange={setAboutDirector}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
