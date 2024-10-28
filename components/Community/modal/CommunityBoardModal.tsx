import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX, VectorIcon } from "@/public/icons/icons";
import Link from "next/link";


const CommunityBoardModal = ({ lists }: { lists: { title: string; desc: string; link: string }[] }) => {
  return (
    <div className="w-[700px] max-w-[80%] max-h-[50vh] h-full rounded-[20px] bg-white dark:darkText-primary overflow-y-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] dark:border-darkText-1 sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white dark:bg-darkText-primary">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy dark:text-white text-base md:text-lg lg:text-xl font-bold capitalize">
             Community Board
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button" aria-label="close">
          <DeleteIconX size={34} />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="flex items-center justify-center my-auto px-10 dark:bg-darkText-primary">
        <div className="mt-4 space-y-3">
          {lists.map((item, index) => (
            <Link href={item.link} key={index} className="flex items-start flex-col gap-2">
              <div className="head flex items-center justify-between w-full">
                <p className="text-5 font-bold">{item.title}</p>
                <VectorIcon />
              </div>
              <p className="text-sm pr-5 text-text-disabled">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityBoardModal;
