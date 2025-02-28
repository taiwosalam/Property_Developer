// Imports
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import { titles } from "@/data";

const ProfileInformation = ({
  data,
  year,
  bio,
}: {
  data?: any;
  year?: string;
  bio?: string;
}) => {
  console.log("wow", data);
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
          defaultValue={data?.full_name}
        />
        <Select
          id="director_personal_title"
          label="personal title / qualification"
          options={titles}
          hiddenInputClassName="setup-f"
          defaultValue={data?.designation}
        />

        <Select
          id="director_experience"
          label="years in business"
          placeholder="Write here"
          options={[
            "1+",
            "2+",
            "3+",
            "4+",
            "5+",
            "6+",
            "7+",
            "8+",
            "9+",
            "10+",
          ]}
          hiddenInputClassName="setup-f"
          defaultValue={year}
        />
        <Input
          id="director_email"
          label="director email"
          type="email"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          defaultValue={data?.email}
        />
        <PhoneNumberInput
          id="director_phone_number"
          label="phone number"
          placeholder="800 0000 000"
          inputClassName="setup-f"
          defaultValue={data?.phone_number}
        />
      </div>
      <TextArea
        id="about_director"
        label="About Director"
        placeholder="Write about the director"
        hiddenInputClassName="setup-f"
        defaultValue={bio}
      />
    </div>
  );
};

export default ProfileInformation;
