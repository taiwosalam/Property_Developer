// Types
import type { AvatarsProps } from "./types";

import { avatarLinks, branchAvatarLinks } from "./data";
import Picture from "../Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";

const Avatars: React.FC<AvatarsProps> = ({
  onClick,
  maxNumber = 200,
  branch,
}) => {
  const { isMobile } = useWindowWidth();
  const links = branch ? branchAvatarLinks : avatarLinks;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
      {links.slice(0, maxNumber).map((avatar, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => {
            onClick?.(avatar);
          }}
          className="w-fit mx-auto"
        >
          <Picture
            rounded
            size={isMobile ? 70 : 110}
            alt="avatar"
            src={avatar}
          />
        </button>
      ))}
    </div>
  );
};

export default Avatars;
