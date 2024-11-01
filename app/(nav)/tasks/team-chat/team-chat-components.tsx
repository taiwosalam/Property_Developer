import Button from "@/components/Form/Button/button";
import { ModalContent, ModalTrigger, useModal } from "@/components/Modal/modal";
import GroupImage from "@/public/empty/SampleLandlord.jpeg";
import { Modal } from "@/components/Modal/modal";
import PencilIcon from "@/public/icons/pencil.svg";
import PageTitle from "@/components/PageTitle/page-title";
import Image from "next/image";
import { useState, useEffect } from "react";
import GroupChatCamera from "@/public/icons/group-camera.svg";
import { team_chat_data, team_chat_members_data } from "./data";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import MemberComponent from "./Member";

// Declare selectedMembers globally
let chosenMembers: string[] = [];
let selectedCount: number = 0;

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div>
        <PageTitle
          title="Team Chat"
          aboutPageModalData={{
            title: "Team Chat",
            description:
              "This page contains a list of Team Chat on the platform.",
          }}
        />
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create Team Chat
            </Button>
          </ModalTrigger>
          <ModalContent>
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col gap-4 bg-white h-[60vh] w-[30vw] dark:bg-black rounded-lg overflow-y-auto custom-round-scrollbar">
                <MemberComponent title="New Group" group={true} />
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export const About = () => {
  const router = useRouter();
  const { id } = useParams();

  const data = team_chat_data.find((item) => item.id === id) || {
    pfp: null,
    fullname: "",
    groupDesc: "",
  };
  const [groupImage, setGroupImage] = useState<string | null>(data.pfp);
  const [groupName, setGroupName] = useState<string>(data.fullname);
  const [groupDescription, setGroupDescription] = useState<string>(
    data.groupDesc || ""
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

  if (!data.pfp) {
    router.replace("/tasks/team-chat");
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="p-4">
      <div className="imageWrapper h-20 w-20 relative overflow-hidden">
        <Image
          src={groupImage || GroupImage}
          alt="team chat"
          width={100}
          height={100}
          className="rounded-full w-full h-full object-contain"
        />
        <div className="absolute bottom-0 right-0 bg-text-black p-1 w-full rounded-b-full bg-opacity-45">
          <button
            type="button"
            className="rounded-full text-center w-full"
            onClick={() =>
              (
                document.querySelector('input[type="file"]') as HTMLInputElement
              )?.click()
            }
          >
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex justify-center items-center">
              <Image src={GroupChatCamera} alt="edit" width={16} height={16} />
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center w-full justify-between">
          {isEditingName ? (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-text-primary text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
            />
          ) : (
            <h3 className="text-text-primary text-sm font-medium">
              {groupName}
            </h3>
          )}
          <button
            type="button"
            onClick={() => setIsEditingName(!isEditingName)}
          >
            <Image src={PencilIcon} alt="edit" width={16} height={16} />
          </button>
        </div>
        <div className="created">
          <h4 className="text-text-disabled text-sm font-normal">Created</h4>
          <p className="text-text-primary text-xs font-medium">
            12/12/2024 1:50AM
          </p>
        </div>
        <div className="stats">
          <h4 className="text-text-disabled text-sm font-normal">Stats</h4>
          <div className="flex items-center gap-2">
            <p className="text-text-disabled text-xs font-medium">
              30.2k Members
            </p>
            <div className="w-1 h-1 rounded-full bg-status-success-3"></div>
            <p className="text-status-success-3 text-xs font-medium">
              30 Online
            </p>
          </div>
        </div>
        <div className="flex">
          <h3 className="text-text-disabled text-sm font-normal">
            Description
          </h3>
        </div>
        <div className="flex gap-2 w-full justify-between">
          {isEditingDescription ? (
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="text-text-primary text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
            />
          ) : (
            <span className="text-text-primary text-xs font-medium">
              {groupDescription}
            </span>
          )}
          <button
            className="w-1/4 flex justify-end"
            type="button"
            onClick={() => setIsEditingDescription(!isEditingDescription)}
          >
            <Image src={PencilIcon} alt="edit" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// export const SelectMember = () => {
//   const [checkedStates, setCheckedStates] = useState<boolean[]>(
//     Array(team_chat_members_data.length).fill(false)
//   );
//   const [selectedMembersState, setSelectedMembers] = useState<string[]>([]);

//   // Handle the click event to toggle the checkbox state
//   const handleCheckboxClick = (index: number) => {
//     const newCheckedStates = [...checkedStates];
//     newCheckedStates[index] = !newCheckedStates[index];

//     const newSelectedMembers = team_chat_members_data
//       .filter((_, idx) => newCheckedStates[idx])
//       .map((member) => member.fullname);
//     setCheckedStates(newCheckedStates);
//     setSelectedMembers(newSelectedMembers);
//   };

//   // Calculate the number of selected checkboxes
//   selectedCount = checkedStates.filter((checked) => checked).length;

//   const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
//   // Function to filter members based on search input
//   const filteredMembers = team_chat_members_data.filter((member) =>
//     member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col w-full gap-2 px-4">
//       <MembersHeader selectedCount={selectedCount} />
//       {filteredMembers.map((item, index) => (
//         <div key={index} className="flex gap-2">
//           <div className="checkbox">
//             <button
//               className="flex items-center gap-2"
//               onClick={() => handleCheckboxClick(index)}
//               type="button"
//             >
//               <Image
//                 src={checkedStates[index] ? CheckboxChecked : CheckboxDefault}
//                 alt="checkbox"
//                 width={24}
//                 height={24}
//                 className="w-6 h-6"
//               />
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <Image
//               src={Avatar1}
//               alt="profile"
//               width={40}
//               height={40}
//               className="rounded-full w-full h-full object-contain"
//             />
//           </div>
//           <div className="flex flex-col">
//             <p className="text-text-primary text-sm font-medium">
//               {item.fullname}
//             </p>
//             <p className="text-text-quaternary text-xs font-normal">
//               {item.position}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
