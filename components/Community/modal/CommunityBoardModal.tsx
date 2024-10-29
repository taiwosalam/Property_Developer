import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX, VectorIcon } from "@/public/icons/icons";
import Link from "next/link";
import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";

const CommunityBoardModal = ({
  lists,
}: {
  lists: { title: string; desc: string; link: string }[];
}) => {
  return (
    <ModalPreset heading="Community Board">
      {/* body */}

      <div className="space-y-3">
        {lists.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="flex items-start flex-col gap-2"
          >
            <div className="head flex items-center justify-between w-full">
              <p className="text-5 font-bold">{item.title}</p>
              <VectorIcon />
            </div>
            <p className="text-sm pr-5 text-text-disabled">{item.desc}</p>
          </Link>
        ))}
      </div>
    </ModalPreset>
  );
};

export default CommunityBoardModal;
