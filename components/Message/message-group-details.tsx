import Image from "next/image";
import { empty } from "@/app/config";
import parse from "html-react-parser";
import TruncatedText from "../TruncatedText/truncated-text";

interface IGroupDetails {
  about?: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
  };
}

const GroupDetails = ({ about }: IGroupDetails) => {
  return (
    <div className="p-4 transition-all duration-300 ease-in-out -mt-4">
      {/* Group Image */}
      <div className="imageWrapper h-[100px] w-[100px] relative overflow-hidden mb-3 mx-auto">
        <Image
          src={about?.picture || empty}
          alt="team chat"
          width={100}
          height={100}
          className="rounded-full w-full h-full object-cover"
        />
      </div>
      {/* Group Name */}
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex items-center w-full justify-between">
          <h3 className="text-text-primary dark:text-white text-[20px] font-semibold">
            {about?.group_name}
          </h3>
        </div>
        {/* Created At */}
        <div className="created">
          <h4 className="text-text-disabled text-md font-normal">Created</h4>
          <p className="text-text-primary dark:text-white text-xs font-medium">
            {about?.created_at}
          </p>
        </div>
        {/* Stats */}
        <div className="stats">
          <h4 className="text-text-disabled text-md font-normal">Stats</h4>
          <div className="flex items-center gap-2">
            <p className="text-text-disabled text-xs font-medium">
              {about?.total_members} Members
            </p>
            <div className="w-1 h-1 rounded-full bg-status-success-3"></div>
            <p className="text-text-disabled text-xs font-medium">
              {about?.total_active} Online
            </p>
          </div>
        </div>
        {/* Description */}
        <div className="flex">
          <h3 className="text-text-disabled text-md font-normal">
            Description
          </h3>
        </div>
        <div className="flex gap-2 w-full justify-between">
          <TruncatedText lines={5} as="p">
            <span className="text-text-primary dark:text-white text-xs font-medium">
              {parse(about?.description || "")}
            </span>
          </TruncatedText>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
