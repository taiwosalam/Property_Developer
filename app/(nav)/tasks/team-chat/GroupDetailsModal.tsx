import clsx from "clsx";
import { useState } from "react";
import { About } from "./team-chat-components";
import AddMembers from "./AddMembers";

export const TeamChatGroupDetailsModal = () => {
  const [side, setSide] = useState<"about" | "members">("about");
  const activeStyle =
    "text-black bg-brand-9 text-sm dark:bg-[#3C3D37] transition-all duration-300 ease-in-out w-full py-1 rounded-lg";
  const inactiveStyle =
    "text-text-quaternary text-sm bg-transparent transition-all duration-300 ease-in-out";
  return (
    <div className="flex flex-col gap-4 bg-white h-[45vh] w-[30vw] dark:bg-black rounded-lg">
      <div className="flex h-full gap-2">
        <div className="flex flex-col gap-2 w-[25%] border-r border-neutral-3 dark:border-darkText-2 h-full p-4">
          <button
            className={clsx(activeStyle, {
              [inactiveStyle]: side !== "about",
            })}
            onClick={() => setSide("about")}
          >
            About
          </button>
          <button
            className={clsx(activeStyle, {
              [inactiveStyle]: side !== "members",
            })}
            onClick={() => setSide("members")}
          >
            Members
          </button>
        </div>
        <div className="w-[75%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar">
          {side === "about" && <About />}
          {side === "members" && <AddMembers />}
        </div>
      </div>
    </div>
  );
};
