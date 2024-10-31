// Types
import type { MessageCardProps } from "@/components/Message/types";

// Images
import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";

export const team_chat_data: MessageCardProps[] = [
  {
    id: "1",
    pfp: Avatar1,
    desc: "Hey, I just wanted to check in and see how you're doing. It's been a while since we last spoke, and I wanted to make sure everything is going well on your end. Let me know if you need anything!",
    time: "2:00 PM",
    fullname: "Security Department",
    messages: 5,
    verified: true,
  },
  {
    id: "2",
    pfp: Avatar2,
    desc: "Can we reschedule our meeting to tomorrow? I have a conflict that came up last minute, and I want to make sure we have enough time to discuss everything thoroughly.",
    time: "3:15 PM",
    fullname: "Accounting Department",
    verified: true,
  },
  {
    id: "3",
    pfp: Avatar3,
    desc: "Here's the document you requested. Let me know if you need any more information or if there are any changes you would like me to make before we finalize everything.",
    time: "1:30 PM",
    fullname: "Lounge & Drinks",
    messages: 2,
  },
  {
    id: "4",
    pfp: Avatar4,
    desc: "I'm available to help with the project. Just let me know when you need me, and I'll be there to assist with anything that comes up. Looking forward to working together!",
    time: "4:00 PM",
    fullname: "Cleaning & Laundering",
    verified: false,
  },
  {
    id: "5",
    pfp: Avatar1,
    desc: "Thanks for the update! Looking forward to it. If there's anything else you need from me before then, feel free to reach out.",
    time: "5:45 PM",
    fullname: "All Staff",
    messages: 3,
  },
  {
    id: "6",
    pfp: Avatar2,
    desc: "Happy birthday! Hope you have a great day celebrating with friends and family. Don't forget to make a wish!",
    time: "6:20 PM",
    fullname: "HR Department",
    messages: 1,
    verified: true,
  },
  {
    id: "7",
    pfp: Avatar3,
    desc: "Let me know if you need any further assistance. I'm here to help with anything you might need.",
    time: "7:00 PM",
    fullname: "Maintenance Department",
  },
  {
    id: "8",
    pfp: Avatar4,
    desc: "I'm almost finished with the report. Just a few more details to wrap up, and I'll send it over for your review.",
    time: "8:10 PM",
    fullname: "Frontend Dev",
    verified: false,
  },
  {
    id: "9",
    pfp: Avatar1,
    desc: "Would you like to join us for dinner tonight? We're planning to go to a new restaurant that just opened downtown. It would be great to catch up with you!",
    time: "9:05 PM",
    fullname: "Backend Dev",
    messages: 4,
  },
  {
    id: "10",
    pfp: Avatar2,
    desc: "Please review the attached file. It's important that we get this finalized before the end of the day.",
    time: "10:30 PM",
    fullname: "Marketing Department",
    verified: true,
  },
];