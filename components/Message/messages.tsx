import React from "react";

// Imports
import Message from "./message";
import { MessagesProps } from "./types";

const Messages: React.FC<MessagesProps> = ({ day }) => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="flex justify-center sticky top-0">
        <p className="py-1 px-2 rounded-[4px] bg-neutral-2 text-text-quaternary text-[10px] font-normal capitalize">
          {day}
        </p>
      </div>
      <div className="custom-flex-col gap-4">
        <Message
          type="from user"
          time="8:32am"
          text="Nunc quis cursus quis mauris vel efficitur. Donec at bibendum leo, nec consequat mauris. Duis id risus nulla."
        />
        <Message
          type="to user"
          time="8:32am"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae ullamcorper urna. "
        />
        <Message
          type="from user"
          time="8:32am"
          text="Nunc quis sagittis justo, ac fringilla nulla. Quisque eu risus ex. Quisque cursus quis mauris vel efficitur. Donec at bibendum leo, nec consequat mauris. Duis id risus nulla."
        />
        <Message
          type="to user"
          time="8:32am"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae ullamcorper urna. "
        />
      </div>
    </div>
  );
};

export default Messages;
