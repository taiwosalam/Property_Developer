// Imports
import Input from "../Form/Input/input";
import PhoneNumberInput from "../Form/PhoneNumber/phone-number";
import Select from "../Form/Select/select";
import TextArea from "../Form/TextArea/textarea";
import type { DirectorDetails } from "@/app/setup/types";
import { titleOrQualifications } from "@/data";
interface ProfileInformationProps {
  directorDetails: DirectorDetails;
  onChange: (
    field: keyof DirectorDetails,
    value: string | File | null | number
  ) => void;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  directorDetails,
  onChange,
}) => {
  return (
    <div className="custom-flex-col gap-6">
      <div className="flex gap-5">
        <Input
          required
          id="fullname"
          label="full name"
          placeholder="Write here"
          className="flex-1 max-w-[620px]"
          inputTextStyles={`text-sm font-normal ${
            directorDetails.fullName === "" ? "bg-transparent" : ""
          }`}
          value={directorDetails.fullName}
          onChange={(value) => onChange("fullName", value)}
        />
        <Select
          id="title"
          label="personal title / qualification"
          className="flex w-[300px]"
          value={directorDetails.titleOrQualification}
          onChange={(value) => onChange("titleOrQualification", value)}
          options={titleOrQualifications}
          textStyles={`text-sm font-normal ${
            directorDetails.titleOrQualification === "" ? "bg-transparent" : ""
          }`}
        />
      </div>
      <div className="flex gap-5">
        <Select
          id="business-years"
          label="years in business"
          placeholder="5"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal ${
            !directorDetails.yearsInBusiness ? "bg-transparent" : ""
          }`}
          value={
            directorDetails.yearsInBusiness
              ? directorDetails.yearsInBusiness.toString()
              : ""
          }
          options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
          onChange={(value) => onChange("yearsInBusiness", value)}
        />
        <Input
          id="alt-email"
          label="alternative email"
          type="email"
          placeholder="example@mail.com"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            directorDetails.altEmail === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("altEmail", value)}
          value={directorDetails.altEmail}
        />
        <PhoneNumberInput
          id="phone-number"
          label="phone number"
          placeholder="80 0000 0000"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            directorDetails.phoneNumber === "" ? "bg-transparent" : ""
          }`}
          value={directorDetails.phoneNumber}
          onChange={(value) => onChange("phoneNumber", value)}
        />
      </div>
      <div className="flex">
        <TextArea
          id="about-director"
          label="About Director"
          placeholder="Write about the director"
          value={directorDetails.aboutDirector}
          onChange={(value) => onChange("aboutDirector", value)}
          textAreaStyles="w-[940px]"
        />
      </div>
    </div>
  );
};

export default ProfileInformation;
