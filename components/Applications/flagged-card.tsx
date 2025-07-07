import { empty } from "@/app/config";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { SectionSeparator } from "../Section/section-components";
import { getBadgeColor } from "@/lib/utils";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/general-store";

interface IFaggerCard {
  flagger_id: number;
  flagger_name: string;
  tier_id: number;
  email: string;
  phone: string;
  company_name: string;
  picture: string | null;
  is_flagged: boolean;
  reason: string | null;
  appeal_reason: string | null;
  status: "rejected" | "pending" | "evaluated" | "approved";
}
export const FlaggedCard = ({ ...props }: IFaggerCard) => {
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const goToMessage = () => {
    if (!props?.flagger_id) {
      toast.warning("User ID not Found!");
      return;
    }

    // Set the user data in the global store
    const newMessageUserData = {
      branch_id: 0,
      id: props?.flagger_id,
      imageUrl: props?.picture || empty,
      name: props?.flagger_name || "Unknown User",
      position: "agent",
    };
    setGlobalStore("messageUserData", newMessageUserData);

    // Redirect to the messaging page
    router.push(`/messages/${props?.flagger_id}`);
  };
  
  return (
    <>
      <div
        className={`h-full border border-brand-tertiary bg-[#F9F9F9] dark:bg-[#020617] dark:border-[#3C3D37] p-3 rounded-lg`}
        style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.05)" }}
      >
        <div className="flex gap-10">
          <div className="flex gap-2">
            <div className="relative overflow-hidden flex-shrink-0 w-[90px] h-[90px]">
              <Image
                src={props?.picture || "/empty/SampleLandlord.jpeg"}
                alt={"Profile"}
                fill
                sizes="300px"
                className="object-cover rounded-full aspect-square"
              />
            </div>
            <div className="flex-1 flex flex-col items-start px-2">
              <p className="flex items-center justify-center font-bold text-black dark:text-darkText-1 text-sm capitalize">
                <span className="text-ellipsis line-clamp-1 break-all capitalize">
                  {props?.flagger_name}
                  <span className="ml-2">
                    {props?.tier_id === 2 && <BadgeIcon color="gray" />}
                  </span>
                </span>
              </p>
              <p className="font-normal text-black dark:text-darkText-1 text-xs mb-1 text-ellipsis line-clamp-1 break-all">
                {props?.email}
              </p>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-xs text-[#8D8D8D] dark:text-darkText-2 text-ellipsis line-clamp-1 py-2">
                  {props?.phone}
                </p>
              </div>

              <button
                className="bg-opacity-40 text-brand-9 py-1 rounded-xl bg-brand-5 px-3 h-6 text-sm flex justify-center items-center"
                onClick={goToMessage}
              >
                Message
              </button>
            </div>
          </div>

          <div className="border-l border-slate-300 flex-1">
            <div className="pl-4 flex flex-col justify-between h-full gap-1">
              <p className="text-red-500 dark:bg-red-200 capitalize">
                {props?.reason}
              </p>
              {/* <p className="text-blue-600">
                Kindly advice the applicant to resolve any outstanding issues
                with their previous manager in order to lift the flag on their
                account.
              </p> */}

              <div className="">
                <p className="text-lg text-black dark:text-slate-300 font-bold">
                  {props?.company_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
