import { empty } from "@/app/config";
import Image from "next/image";
import TruncatedText from "../TruncatedText/truncated-text";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { useGlobalStore } from "@/store/general-store";
import { useEffect } from "react";
import Button from "../Form/Button/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  tier?: number;
  id: number;
}

const ContributorUser = ({ contributors }: { contributors: Contributor }) => {
  const {
    name,
    picture,
    title,
    role,
    phone_number,
    phone,
    email,
    bio,
    professional_title,
    tier,
    id,
  } = contributors || {};

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const router = useRouter();

  useEffect(() => {
    if (contributors) {
      const newMessageUserData = {
        branch_id: 0,
        id,
        imageUrl: picture || empty,
        name: name || "",
        position: "contributor",
      };
      const currentMessageUserData = useGlobalStore.getState()?.messageUserData;

      if (
        JSON.stringify(currentMessageUserData) !==
        JSON.stringify(newMessageUserData)
      ) {
        setGlobalStore("messageUserData", newMessageUserData);
      }
    }
  }, [setGlobalStore, contributors]);

  const goToMessage = () => {
    if (!id) return toast.warning("User ID not Found!");
    router.push(`/messages/${id}`);
  };

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
          <div className="flex gap-1 items-start">
            <p className="dark:text-white text-black text-[20px] font-bold capitalize">
              {`${title || ""} ${name || "--- ---"}`}
            </p>
            {tier && tier > 1 && <BadgeIcon color={"gray"} />}
          </div>
          <div className="flex flex-col lg:flex-col gap-2">
            <p className="text-brand-9 text-sm capitalize">
              {professional_title || ""}
            </p>
            <p className="text-white bg-brand-9 px-2 py-1 text-xs w-fit rounded-lg capitalize">
              {role || ""}
            </p>
          </div>
          <p className="text-sm">Contact : {phone || phone_number || ""}</p>
          <p className="text-sm">Email Address: {email || ""}</p>
        </div>
      </div>
      <div className="desc text-sm">
        <TruncatedText as="div" lines={3}>
          <div
            className="text-text-quaternary dark:text-darkText-2 text-sm font-normal"
            dangerouslySetInnerHTML={{ __html: bio || "" }}
          />
        </TruncatedText>
      </div>
      <div className="btn flex items-center justify-center w-full">
        <Button
          onClick={goToMessage}
          size="sm_normal"
          variant="border"
          className="w-1/2 py-2"
        >
          Message
        </Button>
      </div>
    </div>
  );
};

export default ContributorUser;
