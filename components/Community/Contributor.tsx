import Image from "next/image";
import SampleUser from "@/public/empty/sample-user.svg";

export const ContributorDetails = ({ title }: { title: string }) => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Posted Date </p>
          <p className="dark:text-white text-black text-sm"> 12/10/2024 </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Last Updated </p>
          <p className="dark:text-white text-black text-sm"> 12/10/2024 </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Target Audience </p>
          <p className="dark:text-white text-black text-sm">
            All State, All Logal Government Area
          </p>
        </div>
      </div>
      <ContributorUser />
    </div>
  );
};

const ContributorUser = () => {
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex gap-4">
        <div className="imgWrapper h-[154px] w-[154px]">
          <Image src={SampleUser} alt="user" width={300} height={300} />
        </div>
        <div className="userDetails flex flex-col gap-1">
          <p className="dark:text-white text-black text-[25px] font-bold">
            {" "}
            ESV Taiwo Salami{" "}
          </p>
          <p className="text-brand-9 text-sm"> Estate Surveyor & Valuer </p>
          <p className="text-white bg-[#003DAD] px-2 py-1 text-xs w-fit rounded-lg">
            Manager
          </p>
          <p className="text-sm"> Contact : +2348100000000 </p>
          <p className="text-sm"> Email Address: emailaddress@gmail.com </p>
        </div>
      </div>
      <div className="desc text-sm">
        <p>
          A multi-family home, also know as a duplex, triplex, or multi-unit
          building, is a residential property that living read more. They want
          to work with their budget in booking an appointment. They wants to
          ease themselves of the stress of having to que, and also reduce the
          time spent searching for something new. They wants to ease themselves
          of the stress of having to que, and also reduce the time spent
          searching for something new.
        </p>
      </div>
      <div className="btn flex items-center justify-center w-full">
        <button className="w-1/2 text-sm border border-brand-9 text-brand-9 px-4 py-1 rounded-lg">
          Message
        </button>
      </div>
    </div>
  );
};
