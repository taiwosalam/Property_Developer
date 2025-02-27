import {
  AudioIcon,
  DocumentIcon,
  EmojiIcon,
  GalleryIcon,
} from "@/public/icons/icons";
import React from "react";

import {
  EmojiComponent,
  MessageGalleryComponent,
  MessageAudioComponent,
  MessageDocumentComponent,
} from "./team-message-attachment-component";
import useStep from "@/hooks/useStep";
import { MessageModalPreset } from "../message-attachments-components";

const TeamMessageAttachment: React.FC<{
  onEmojiSelect: (emoji: string) => void;
  id: string;
}> = ({ onEmojiSelect, id }) => {
  const { activeStep, changeStep } = useStep(5);

  const options = [
    {
      name: "Emoji",
      icon: <EmojiIcon />,
      component: <EmojiComponent onEmojiSelect={onEmojiSelect} />,
      heading: "Emoji",
    },
    {
      name: "Image",
      icon: <GalleryIcon />,
      component: <MessageGalleryComponent id={id} />,
      heading: "Image",
    },
    {
      name: "Audio",
      icon: <AudioIcon />,
      component: <MessageAudioComponent id={id} />,
      heading: "Audio",
    },
    {
      name: "Document",
      icon: <DocumentIcon />,
      component: <MessageDocumentComponent id={id} />,
      heading: "Document",
    },
  ];

  if (activeStep === 1) {
    return (
      <MessageModalPreset heading={"Attachments"}>
        <div className="flex flex-col gap-2 mt-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer bg-brand-9 w-full p-2 rounded-md"
              onClick={() => changeStep(index + 2)}
            >
              <div className="text-white">{option.icon}</div>
              <p className="text-white text-base font-medium">{option.name}</p>
            </div>
          ))}
        </div>
      </MessageModalPreset>
    );
  } else {
    const selectedIndex = activeStep - 2;
    const SelectedComponent = options[selectedIndex].component;
    const selectedHeading = options[selectedIndex].heading;

    return (
      <MessageModalPreset
        heading={selectedHeading}
        back={{ handleBack: () => changeStep(1) }}
      >
        {SelectedComponent}
      </MessageModalPreset>
    );
  }
};

export default TeamMessageAttachment;
