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
    <div className="custom-flex-col gap-6 max-w-[940px]">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="director_name"
          label="full name"
          placeholder="Write here"
          inputTextStyles={`text-xs md:text-sm font-normal`}
          className="lg:col-span-2"
        />
        <Select
          id="director_title"
          label="personal title / qualification"
          options={titles}
          textStyles={`text-xs md:text-sm font-normal`}
        />

        <Select
          id="director_experience"
          label="years in business"
          placeholder="Write here"
          textStyles={`text-xs md:text-sm font-normal`}
          options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
        />
        <Input
          id="director_email"
          label="alternative email"
          type="email"
          placeholder="example@mail.com"
          inputTextStyles={`text-xs md:text-sm font-normal`}
        />
        <PhoneNumberInput
          id="director_phone"
          label="phone number"
          placeholder="80 0000 0000"
          inputTextStyles={`text-xs md:text-sm font-normal`}
        />
      </div>
      <div>
        <div>
       
          <input type="hidden" name="director_about" value={aboutDirector} />
          <TextArea
            id="director_about"
            label="About Director"
            placeholder="Write about the director"
            value={aboutDirector}
            onChange={setAboutDirector}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
