import clsx from "clsx";
import { UserTagProps } from "./types";

const UserTag: React.FC<UserTagProps> = ({ className, type }) => {
  const tagClasses =
    type === "mobile"
      ? "bg-status-success-1 text-status-success-3"
      : "bg-brand-3 text-brand-9";
  return (
    <p
      className={clsx(
        "rounded-lg py-1 px-6 text-[10px] capitalize text-center max-w-[70px]",
        tagClasses,
        className
      )}
    >
      {type}
    </p>
  );
};

export default UserTag;
