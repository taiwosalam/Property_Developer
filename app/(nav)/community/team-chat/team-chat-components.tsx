// import Button from "@/components/Form/Button/button";
// import GroupImage from "@/public/empty/SampleLandlord.jpeg";
// import PencilIcon from "@/public/icons/pencil.svg";
// import PageTitle from "@/components/PageTitle/page-title";
// import Image from "next/image";
// import ModalPreset from "@/components/Modal/modal-preset";
// import { useEffect, useState } from "react";
// import GroupChatCamera from "@/public/icons/group-camera.svg";
// import {
//   team_chat_data,
//   team_chat_members_data,
//   updateGroupNameAndDescription,
// } from "./data";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
// import MemberComponent from "./Member";
// import useStep from "@/hooks/useStep";
// import SaveIcon from "@/public/icons/save.svg";
// import useFetch from "@/hooks/useFetch";
// import dayjs from "dayjs";
// import avatarIcon from "@/public/empty/avatar-2.svg";
// import { AuthForm } from "@/components/Auth/auth-components";
// import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
// import { AboutTeamModal } from "@/components/Skeleton/member-card-skeleton";
// import { GroupChatResponse, User } from "./types";
// import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

// export const TeamChatHeader = () => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const { activeStep, changeStep } = useStep(2);
//   return (
//     <div className="flex items-center justify-between w-full mb-4">
//       <PageTitle
//         title="Team Chat"
//         aboutPageModalData={{
//           title: "Team Chat",
//           description:
//             "This page contains a list of Team Chat on the platform.",
//         }}
//       />
//       <Modal>
//         <ModalTrigger asChild>
//           <Button size="base_medium" type="button" className="px-8 py-2">
//             + Create Team Chat
//           </Button>
//         </ModalTrigger>
//         <ModalContent>
//           {/* <MemberComponent
//             title="New Group"
//             handleClose={handleClose}
//             group={true}
//             step={activeStep}
//             setStep={changeStep}
//             nextStep={() => changeStep("next")}
//           /> */}
//           here we put modal logics
//         </ModalContent>
//       </Modal>
//       {/* {open && (
//           <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//           >
//             {activeStep === 1 ? (
//               <Box sx={style}>
//                 <div className="w-full h-full flex items-center justify-center">
//                   <div className="flex flex-col gap-4 bg-white h-[500px] w-full dark:bg-darkText-primary rounded-lg overflow-y-auto custom-round-scrollbar">
//                     <MemberComponent
//                       title="New Group"
//                       handleClose={handleClose}
//                       group={true}
//                       step={activeStep}
//                       setStep={changeStep}
//                       nextStep={() => changeStep("next")}
//                     />
//                   </div>
//                 </div>
//               </Box>
//             ) : (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                 }}
//               >
//                 <ModalPreset type="success">
//                   <p className="text-text-disabled text-sm font-normal">
//                     You have successfully set up a group chat for the team.
//                   </p>
//                   <div className="flex justify-center">
//                     <Button onClick={handleClose}>ok</Button>
//                   </div>
//                 </ModalPreset>
//               </div>
//             )}
//           </Modal>
//         )} */}
//     </div>
//   );
// };


"use client";

import React from "react";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateGroupModal from "./create-group-modal";

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4 px-4">
      <PageTitle
        title="Team Chat"
        aboutPageModalData={{
          title: "Team Chat",
          description:
            "This page contains a list of Team Chat on the platform.",
        }}
      />
      <Modal>
        <ModalTrigger asChild>
          <Button size="base_medium" type="button" className="px-8 py-2">
            + Create Team Chat
          </Button>
        </ModalTrigger>
        <ModalContent>
          <CreateGroupModal />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeamChatHeader;
