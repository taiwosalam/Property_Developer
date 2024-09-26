import Image from "next/image";
import { empty } from "@/app/config";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const Comment: React.FC<{ replies?: any }> = ({ replies }) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-9 h-9 rounded-full bg-neutral-2 overflow-hidden">
          <Image
            src={empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-text-primary text-sm font-medium flex items-center">
            <span className="text-ellipsis line-clamp-1">
              Oloruntoba Morakinyo
            </span>
            <BadgeIcon color="yellow" />
          </p>
          <p className="text-text-secondary text-sm font-medium">
            It is expected that cities and other states’ capitals without many
            security challenges will witness refinements. Many urban centres
            will witness positive changes in real estate
          </p>
        </div>
      </div>
      {/* {replies && } */}
      {replies && (
        <div className="">
          {Array(1)
            .fill(null)
            .map((_, index) => (
              <Comment key={index} /> //replies={reply.replies}
            ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
