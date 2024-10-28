import Image from "next/image";
import Link from "next/link";
import BadgeIcon, {
  badgeIconColors,
  BadgeIconColors,
} from "../BadgeIcon/badge-icon";
import { ThreadCardProps } from "@/app/(nav)/tasks/agent-community/type";
import {
  CommentIcon,
  ShareIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";

const ThreadCard = ({
  name,
  picture_url,
  role,
  user_pics,
  title,
  desc,
  time,
  comments,
}: ThreadCardProps) => {
  return (
    <div className="max-w-[360px] bg-white dark:bg-darkText-primary rounded-lg p-4 shadow-md">
      <Link href="/tasks/agent-community/123/preview">
        <ThreadHeader
          user_pics={user_pics}
          name={name}
          role={role}
          time={time}
        />
        <ThreadBody title={title} picture_url={picture_url} desc={desc} />
      </Link>
      <ThreadFooter comments={comments} />
    </div>
  );
};

export default ThreadCard;

const ThreadHeader = ({
  user_pics,
  name,
  role,
  time,
}: {
  user_pics: string;
  name: string;
  role: string;
  time: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="imgWrapper flex gap-2 rounded-full">
        <Image
          src={user_pics}
          alt={name}
          width={20}
          height={20}
          className="w-10 h-10 object-cover"
        />
        <div className="flex flex-col">
          <p className="dark:text-white relative">
            {name}
            <span className="badge absolute -top-7 -right-5">
              <BadgeIcon color="gray" />
            </span>
          </p>
          <p className="text-brand-9 text-sm"> {role} </p>
        </div>
      </div>
      <div className="time">
        <p className="text-sm text-[#6083ED]"> {time} </p>
      </div>
    </div>
  );
};

const ThreadBody = ({
  title,
  picture_url,
  desc,
}: {
  title: string;
  picture_url: string;
  desc: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-black text-5 dark:text-white leading-5 truncate font-bold mt-4">
        {title}
      </h2>
      <p className="text-sm line-clamp-3"> {desc} </p>
      <div className="imagWrapper">
        <Image
          src={picture_url}
          alt="Thread"
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

const ThreadFooter = ({ comments }: { comments: string }) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="like-dislike flex gap-2">
        <button className="flex items-center gap-1">
          <ThumbsUp />
          <p> 10 </p>
        </button>
        <button className="flex items-center gap-1">
          <ThumbsDown />
          <p> 10 </p>
        </button>
      </div>

      <button className="flex items-center gap-2">
        <CommentIcon />
        <span className="text-sm dark:text:darkText-1">{comments}</span>
      </button>

      <button className="flex items-center gap-1">
        <ShareIcon />
        <span>share</span>
      </button>
    </div>
  );
};
