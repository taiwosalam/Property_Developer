import { empty } from "@/app/config";
import Image from "next/image";

interface Contributor {
  name?: string;
  picture?: string;
  title?: string;
  role?: string;
  professional_title?: string;
  phone_number?: string;
  phone?: string;
  email?: string;
  bio?: string;
}

const ContributorUser = ({ contributors }: { contributors: Contributor }) => {
  console.log("contributors here", contributors);
  const { name, picture, title, role, phone_number, phone, email, bio, professional_title } =
    contributors || {};
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="imgWrapper h-[154px] w-[154px] mx-auto md:mx-0 shadow-lg rounded-md p-2">
          <Image
            src={picture || empty}
            alt="user"
            width={300}
            height={300}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="userDetails flex flex-col gap-1">
          <p className="dark:text-white text-black text-[20px] font-bold">
            {`${title || ""} ${name || "--- ---"}`}
          </p>
          <div className="flex flex-col lg:flex-col gap-2">
            <p className="text-brand-9 text-sm">{professional_title || ""}</p>
            <p className="text-white bg-[#003DAD] px-2 py-1 text-xs w-fit rounded-lg">
              {role || ""}
            </p>
          </div>
          <p className="text-sm">Contact : {phone || phone_number || ""}</p>
          <p className="text-sm">Email Address: {email || ""}</p>
        </div>
      </div>
      <div className="desc text-sm">
        <div dangerouslySetInnerHTML={{ __html: bio || "" }} />
      </div>
      <div className="btn flex items-center justify-center w-full">
        <button className="w-1/2 text-sm bg-secondary border border-brand-9 text-brand-9 px-4 py-1 rounded-md">
          Message
        </button>
      </div>
    </div>
  );
};

export default ContributorUser;
