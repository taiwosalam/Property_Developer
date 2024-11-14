// Imports
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import { titles } from "@/data";

const ProfileInformation = () => {
  return (
    <div className="custom-flex-col gap-6 max-w-[940px]">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          required
          id="director_full_name"
          label="full name"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          className="lg:col-span-2"
        />
        <Select
          id="director_personal_title"
          label="personal title / qualification"
          options={titles}
          hiddenInputClassName="setup-f"
        />

        <Select
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
          inputClassName="rounded-[8px] setup-f bg-white"
        />
        <PhoneNumberInput
          id="director_phone_number"
          label="phone number"
          placeholder="800 0000 000"
          inputClassName="setup-f"
        />
      </div>
      <TextArea
        id="about_director"
        label="About Director"
        placeholder="Write about the director"
        hiddenInputClassName="setup-f"
      />
    </div>
  );
};

export default ProfileInformation;
