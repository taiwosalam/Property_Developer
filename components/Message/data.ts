// Types
import { PageMessages } from "@/app/(nav)/(messages-reviews)/messages/types";
import type { MessageCardProps } from "./types";

// Images
import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";
import { empty } from "@/app/config";

export const message_card_data: PageMessages[] = [
  {
    id: "",
    pfp: empty,
    desc: "",
    time: "",
    fullname: "",
    messages: 5,
    verified: true,
    content_type: "",
  },
];

export interface EmojiComponentProps {
  onEmojiSelect: (emoji: string) => void;
}

export interface AudioProps {
  id: string;
}

export const message_data: MessageCardProps[] = [
  {
    id: "1",
    pfp: Avatar1,
    desc: "Hey, I just wanted to check in and see how you're doing. It's been a while since we last spoke, and I wanted to make sure everything is going well on your end. Let me know if you need anything!",
    time: "2:00 PM",
    fullname: "John Doe",
    messages: 5,
    verified: true,
  },
  {
    id: "2",
    pfp: Avatar2,
    desc: "Can we reschedule our meeting to tomorrow? I have a conflict that came up last minute, and I want to make sure we have enough time to discuss everything thoroughly.",
    time: "3:15 PM",
    fullname: "Jane Smith",
    verified: true,
  },
  {
    id: "3",
    pfp: Avatar3,
    desc: "Here's the document you requested. Let me know if you need any more information or if there are any changes you would like me to make before we finalize everything.",
    time: "1:30 PM",
    fullname: "Michael Johnson",
    messages: 2,
  },
  {
    id: "4",
    pfp: Avatar4,
    desc: "I'm available to help with the project. Just let me know when you need me, and I'll be there to assist with anything that comes up. Looking forward to working together!",
    time: "4:00 PM",
    fullname: "Emily Davis",
    verified: false,
  },
  {
    id: "5",
    pfp: Avatar1,
    desc: "Thanks for the update! Looking forward to it. If there's anything else you need from me before then, feel free to reach out.",
    time: "5:45 PM",
    fullname: "Robert Brown",
    messages: 3,
  },
  {
    id: "6",
    pfp: Avatar2,
    desc: "Happy birthday! Hope you have a great day celebrating with friends and family. Don't forget to make a wish!",
    time: "6:20 PM",
    fullname: "Jessica Wilson",
    messages: 1,
    verified: true,
  },
  {
    id: "7",
    pfp: Avatar3,
    desc: "Let me know if you need any further assistance. I'm here to help with anything you might need.",
    time: "7:00 PM",
    fullname: "David Lee",
  },
  {
    id: "8",
    pfp: Avatar4,
    desc: "I'm almost finished with the report. Just a few more details to wrap up, and I'll send it over for your review.",
    time: "8:10 PM",
    fullname: "Sophia Martinez",
    verified: false,
  },
  {
    id: "9",
    pfp: Avatar1,
    desc: "Would you like to join us for dinner tonight? We're planning to go to a new restaurant that just opened downtown. It would be great to catch up with you!",
    time: "9:05 PM",
    fullname: "Daniel Garcia",
    messages: 4,
  },
  {
    id: "10",
    pfp: Avatar2,
    desc: "Please review the attached file. It's important that we get this finalized before the end of the day.",
    time: "10:30 PM",
    fullname: "Olivia Hernandez",
    verified: true,
  },
];
