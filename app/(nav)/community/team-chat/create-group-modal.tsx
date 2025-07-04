// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import { PlusIcon, SearchIcon } from "@/public/icons/icons";
// import Image from "next/image";
// import CheckboxDefault from "@/public/icons/checkbox-default.svg";
// import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
// import avatarIcon from "@/public/empty/avatar-2.svg";
// import { AuthForm } from "@/components/Auth/auth-components";
// import Button from "@/components/Form/Button/button";
// import Input from "@/components/Form/Input/input";
// import TextArea from "@/components/Form/TextArea/textarea";
// import useFetch from "@/hooks/useFetch";
// import { toast } from "sonner";
// import { TeamChatUsersResponse, GroupChatResponse } from "./types";
// import { transformTeamMemberData, IMemberList } from "./team.data";
// import { createNewTeamChat, addUserToGroup } from "./data";
// import useStep from "@/hooks/useStep";
// import { TeamChatMemberSkeleton } from "@/components/Skeleton/member-card-skeleton";
// import { ChevronLeftIcon } from "lucide-react";

// interface CreateGroupModalProps {
//   isOpen?: boolean; // Optional, as Modal controls open state
//   onClose?: () => void; // Optional, for custom close handling
// }

// const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const { activeStep, changeStep } = useStep(3); // 3 steps: select members, group details, success
//   const params = useParams();
//   const groupId = params?.id as string | undefined;
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
//   const [teamMembers, setTeamMembers] = useState<IMemberList | null>(null);
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [isCreating, setIsCreating] = useState(false);

//   const {
//     data: teamMemberData,
//     loading,
//     error,
//     isNetworkError,
//   } = useFetch<TeamChatUsersResponse>("/company/users");

//   useEffect(() => {
//     if (teamMemberData) {
//       const transformTeam = transformTeamMemberData(teamMemberData);
//       setTeamMembers(transformTeam);
//     }
//   }, [teamMemberData]);

//   const searchMembers =
//     teamMembers?.members?.filter((member) =>
//       member.username.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//   const handleCheckboxClick = (memberId: number) => {
//     setSelectedMembers((prev) =>
//       prev.includes(memberId)
//         ? prev.filter((id) => id !== memberId)
//         : [...prev, memberId]
//     );
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmitCreateGroup = async (formData: FormData) => {
//     setIsCreating(true);
//     selectedMembers.forEach((userId) =>
//       formData.append("user_ids[]", userId.toString())
//     );
//     formData.append("is_private", "1");
//     try {
//       const groupResponse = await createNewTeamChat(formData);
//       if (groupResponse) {
//         window.dispatchEvent(new Event("refetchTeamChat"));
//         changeStep("next"); // Move to success step
//       }
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to create group"
//       );
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleAddMembersToGroup = async () => {
//     if (groupId && selectedMembers.length > 0) {
//       const userFormData = new FormData();
//       selectedMembers.forEach((userId) =>
//         userFormData.append("user_ids[]", userId.toString())
//       );
//       try {
//         const res = await addUserToGroup(groupId, userFormData);
//         if (res) {
//           window.dispatchEvent(new Event("refetch_team_chat"));
//           onClose?.();
//         }
//       } catch (err) {
//         toast.error("Failed to add members");
//       }
//     }
//   };

//   const resetForm = () => {
//     setSelectedMembers([]);
//     setSearchTerm("");
//     setUploadedImage(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     changeStep("reset");
//   };

//   const handleCloseModal = () => {
//     resetForm();
//     onClose?.();
//   };

//   return (
//     <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg max-h-[80vh] overflow-y-auto custom-round-scrollbar p-4">
//       {activeStep === 1 && (
//         <>
//           <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary py-3">
//             <div className="flex items-center gap-2">
//               <button type="button" onClick={handleCloseModal}>
//                 <ChevronLeftIcon size={30} />
//               </button>
//               <h2 className="text-text-primary dark:text-white text-lg font-medium">
//                 New Group
//               </h2>
//             </div>
//             <div className="flex items-center gap-1 border border-text-disabled rounded-md p-1 mt-2">
//               <SearchIcon size={25} />
//               <input
//                 type="text"
//                 placeholder="Search Name"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="text-sm w-full dark:text-white dark:bg-darkText-primary focus:outline-none"
//               />
//             </div>
//             {selectedMembers.length > 0 && (
//               <div className="flex items-center justify-between gap-2 mt-2">
//                 <Button
//                   type="button"
//                   className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
//                   onClick={resetForm}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="button"
//                   className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
//                   onClick={
//                     groupId ? handleAddMembersToGroup : () => changeStep("next")
//                   }
//                 >
//                   {groupId ? `Add ${selectedMembers.length}` : "Next"}
//                 </Button>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-col gap-2">
//             {loading ? (
//               <TeamChatMemberSkeleton count={4} />
//             ) : searchMembers.length > 0 ? (
//               searchMembers.map((member) => (
//                 <div key={member.id} className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => handleCheckboxClick(member.id)}
//                     className="flex items-center gap-2"
//                   >
//                     <Image
//                       src={
//                         selectedMembers.includes(member.id)
//                           ? CheckboxChecked
//                           : CheckboxDefault
//                       }
//                       alt="checkbox"
//                       width={24}
//                       height={24}
//                       className="w-6 h-6"
//                     />
//                   </button>
//                   <Image
//                     src={member.profile_picture || avatarIcon}
//                     alt="profile"
//                     width={40}
//                     height={40}
//                     className="rounded-full w-10 h-10 object-cover"
//                   />
//                   <div className="flex flex-col">
//                     <p className="text-text-primary dark:text-white text-sm font-medium capitalize">
//                       {member.username}
//                     </p>
//                     <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal capitalize">
//                       {member.role}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-400">No users found</p>
//             )}
//           </div>
//         </>
//       )}
//       {activeStep === 2 && (
//         <div className="flex flex-col gap-4">
//           <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary py-3">
//             <div className="flex items-center gap-2">
//               <button type="button" onClick={() => changeStep("prev")}>
//                 <ChevronLeftIcon size={30} />
//               </button>
//               <h2 className="text-text-primary dark:text-white text-lg font-medium">
//                 Group Details
//               </h2>
//             </div>
//           </div>
//           <AuthForm
//             returnType="form-data"
//             onFormSubmit={handleSubmitCreateGroup}
//           >
//             <div className="flex flex-col gap-1">
//               <p className="dark:text-white">Group Name</p>
//               <Input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="Group Name"
//                 className="border border-text-disabled dark:bg-darkText-primary rounded-md px-2 py-3 w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-1 mt-4">
//               <p className="dark:text-white">Group Description</p>
//               <TextArea
//                 id="description"
//                 name="description"
//                 placeholder="Group Description"
//                 className="border border-text-disabled dark:bg-darkText-primary rounded-md px-2 py-3 w-full"
//               />
//             </div>
//             <div className="flex flex-col items-start gap-2 mt-2">
//               <p className="text-text-disabled text-sm">
//                 Formats: .jpg, .gif, .png (5MB max)
//               </p>
//               {uploadedImage ? (
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <input
//                     type="file"
//                     id="picture"
//                     name="picture"
//                     className="hidden"
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                   />
//                   <Image
//                     src={uploadedImage}
//                     alt="Uploaded Group"
//                     width={85}
//                     height={85}
//                     className="rounded-md object-cover"
//                   />
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   className="bg-[#F4F4F9] dark:bg-darkText-primary border border-dashed border-text-label text-sm text-text-label w-2/4 h-[85px] rounded-md flex flex-col items-center justify-center gap-2"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <input
//                     id="picture"
//                     name="picture"
//                     type="file"
//                     className="hidden"
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                   />
//                   <PlusIcon />
//                   Add Image
//                 </button>
//               )}
//             </div>
//             <div className="flex items-center justify-between gap-2 mt-6">
//               <Button
//                 type="button"
//                 className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
//                 onClick={handleCloseModal}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isCreating}
//                 className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
//               >
//                 {isCreating ? "Creating..." : "Create"}
//               </Button>
//             </div>
//           </AuthForm>
//         </div>
//       )}
//       {activeStep === 3 && (
//         <div className="flex flex-col items-center gap-4 p-4">
//           <p className="text-text-primary dark:text-white text-lg font-medium">
//             Success!
//           </p>
//           <p className="text-text-disabled text-sm font-normal text-center">
//             You have successfully set up a group chat for the team.
//           </p>
//           <Button
//             type="button"
//             className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
//             onClick={handleCloseModal}
//           >
//             OK
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateGroupModal;

"use client";

import React from "react";
import useStep from "@/hooks/useStep";
import SelectMembersStep from "./SelectMembersStep";
import SuccessStep from "./SuccessStep";
import { CreateGroupProvider } from "@/contexts/createGroup";
import GroupDetailsStep from "./GroupDetailSteps";

interface CreateGroupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
  const { activeStep, changeStep } = useStep(3);

  const handleCloseModal = () => {
    // changeStep("reset");
    onClose?.();
  };

  return (
    <CreateGroupProvider>
      <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary rounded-xl max-h-[70vh] lg:min-w-[35%] min-w-[50%] overflow-y-auto custom-round-scrollbar px-4">
        {activeStep === 1 && (
          <SelectMembersStep
            onClose={handleCloseModal}
            onNext={() => changeStep("next")}
          />
        )}
        {activeStep === 2 && (
          <GroupDetailsStep
            onBack={() => changeStep("prev")}
            onClose={handleCloseModal}
          />
        )}
        {activeStep === 3 && <SuccessStep onClose={handleCloseModal} />}
      </div>
    </CreateGroupProvider>
  );
};

export default CreateGroupModal;
