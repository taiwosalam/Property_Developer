"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTeamChatStore } from "@/store/teamChatStore";
import { PlusIcon, SearchIcon } from "@/public/icons/icons";
import {
  addUserToGroup,
  createNewTeamChat,
  team_chat_members_data,
} from "./data";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import FilterButton from "@/components/FilterButton/filter-button";
import Avatar1 from "@/public/empty/avatar-1.svg";
//import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import {
  Group,
  GroupChat,
  GroupChatResponse,
  GroupsResponse,
  UsersResponse,
} from "./types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { AuthForm } from "@/components/Auth/auth-components";
import { boolean } from "zod";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { AxiosResponse } from "axios";
import ChildModal from "./child-modal";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import { TeamChatMemberSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const MemberComponent = ({
  title,
  group,
  nextStep,
  handleClose,
}: {
  title: string;
  group?: boolean;
  handleClose?: () => void;
  nextStep?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  let selectedCount: number = 0;
  const { closeAddMember } = useTeamChatStore();
  const [isGroupDesc, setIsGroupDesc] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

  const {
    data: teamMembers,
    error,
    loading,
    isNetworkError,
    silentLoading,
  } = useFetch<UsersResponse>("/company/users");

  const teamList = teamMembers?.data?.users;

  const searchMembers = teamList?.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    Array(team_chat_members_data.length).fill(false)
  );
  const [selectedMembersState, setSelectedMembers] = useState<string[]>([]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // State for uploaded image
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the click event to toggle the checkbox state
  const handleCheckboxClick = (index: number) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !newCheckedStates[index];

    const newSelectedMembers = searchMembers
      ?.filter((_, idx) => newCheckedStates[idx])
      .map((member) => member.id.toString());
    setCheckedStates(newCheckedStates);
    setSelectedMembers(newSelectedMembers || []);
  };

  // Calculate the number of selected checkboxes
  selectedCount = checkedStates.filter((checked) => checked).length;

  const openGroupDesc = () => {
    setIsGroupDesc(true);
  };

  // const handleBackNavigation = () => {
  //   if (isGroupDesc) {
  //     setIsGroupDesc(false);
  //   } else if (open) {
  //     if (handleClose) {
  //       if (handleClose) {
  //         if (handleClose) {
  //           if (handleClose) handleClose();
  //         }
  //       }
  //     }
  //   } else {
  //     closeAddMember();
  //   }
  // };

  const cancel = () => {
    selectedCount = 0;
    setCheckedStates(Array(team_chat_members_data.length).fill(false));
    setSelectedMembers([]);
  };
  const params = useParams();
  const paramId = params?.id;

  const [isCreating, setIsCreating] = useState(false);
  const [createResponse, setCreateResponse] = useState<
    GroupChatResponse | undefined
  >(undefined);
  const [groupId, setGroupId] = useState(paramId ?? "")
  const handleSubmitCreateGroup = async (formData: FormData) => {
    setIsCreating(true);
    try {
      const groupResponse = await createNewTeamChat(formData);
      if (groupResponse) {
        setCreateResponse(groupResponse.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if(createResponse && paramId){
      setGroupId(paramId as string);
    }

  }, [paramId])

  useEffect(() => {
    if (createResponse?.group_chat?.id && selectedMembersState.length > 0) {
      const groupId = createResponse.group_chat.id;

      const userFormData = new FormData();
      selectedMembersState.forEach((userId) => {
        userFormData.append("user_ids[]", userId);
      });

      addUserToGroup(groupId.toString(), userFormData)
        .then((res) => {
          if (res && handleClose) handleClose();
        })
        .catch((err) => console.error("Error adding users:", err));
    }
  }, [createResponse]);

  const addNewUserToGroup = () => {
    if (groupId && selectedMembersState.length > 0) {

      const userFormData = new FormData();
      selectedMembersState.forEach((userId) => {
        userFormData.append("user_ids[]", userId);
      });

      addUserToGroup(groupId as string, userFormData)
        .then((res) => {
          console.log(res);
          if (res) {
            window.dispatchEvent(new Event("refetch_team_chat"));
            if (handleClose) handleClose();
          };
        })
        .catch((err) => console.error("Error adding users:", err));
    }
  };

  return (
    <>
      <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary mt-0 py-3 px-4">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={handleClose}
        >
          <span>
            <ChevronLeftIcon size={30} />
          </span>
          <h2 className="text-text-primary dark:text-white text-lg font-medium">
            {title}
          </h2>
        </button>
        <div className="searchWrapper flex items-center justify-between mt-2 gap-1 border border-text-disabled rounded-md p-1 w-full h-[50px]">
          <div className="flex items-center gap-1">
            <SearchIcon size={25} />
            <input
              type="text"
              placeholder="Search Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm w-full dark:text-white dark:bg-darkText-primary focus:outline-none"
            />
          </div>
          <div>
            <div onClick={handleOpen}>
              {/*
              <ChildModal />*/}
            </div>
            <Modal
              state={{
                isOpen: false,
                setIsOpen: setOpen,
              }}
              // onClose={handleClose}
              // closeAfterTransition
              // aria-labelledby="modal-modal-title"
              // aria-describedby="modal-modal-description"
            >
              <p></p>
              {/* <Box sx={style}>
                <div className="w-full h-full flex items-center justify-center">
                  <FilterModal isDateTrue handleFilterApply={() => {}} />
                </div>
              </Box> */}
            </Modal>
          </div>
        </div>
        {selectedCount > 0 && !isGroupDesc && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              onClick={cancel}
              type="button"
              className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (group) {
                  openGroupDesc();
                } else {
                  addNewUserToGroup()
                }
              }}
              type="button"
              className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
            >
              {group ? "Next" : "Add"} {selectedCount}
            </button>
          </div>
        )}
      </div>
      {!isGroupDesc && (
        <div className="flex flex-col w-full gap-2 px-4">
          {silentLoading ? (
            <TeamChatMemberSkeleton count={4} />
          ) : searchMembers && searchMembers?.length > 0 ? (
            searchMembers?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="checkbox">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => handleCheckboxClick(index)}
                    type="button"
                  >
                    <Image
                      src={
                        checkedStates[index] ? CheckboxChecked : CheckboxDefault
                      }
                      alt="checkbox"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={item.profile_picture}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-text-primary dark:text-white text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal">
                    {item.role}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No users yet</p>
          )}
        </div>
      )}
      {isGroupDesc && (
        <div className="text-text-primary text-sm font-medium px-4 pb-4">
          <AuthForm
            returnType="form-data"
            onFormSubmit={handleSubmitCreateGroup}
          >
            <div className="flex flex-col gap-1">
              <p className="dark:text-white">Group Name</p>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Group Name"
                className="border border-text-disabled dark:bg-darkText-primary rounded-md px-2 py-3 w-full"
              />
            </div>
            <div className="flex flex-col mt-4 gap-1">
              <p className="dark:text-white">Group Description</p>
              <div className="w-full">
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Group Description"
                  className="border border-text-disabled dark:bg-darkText-primary rounded-md px-2 py-3 w-full"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 mt-2">
              <p className="text-text-disabled">
                Formats are .jpg, .gif and .png only 5MB max
              </p>
              {uploadedImage ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    id="picture"
                    name="picture"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Image
                    src={uploadedImage}
                    alt="Uploaded Group"
                    width={85}
                    height={85}
                    className="rounded-md object-cover"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-[#F4F4F9] dark:bg-darkText-primary border border-dashed border-text-label text-sm text-text-label w-2/4 h-[85px] rounded-md flex flex-col items-center justify-center gap-2"
                  onClick={() => fileInputRef.current?.click()} // Trigger file input click
                >
                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <PlusIcon />
                  Add Image
                </button>
              )}
            </div>
            <div className="btns flex items-center justify-between gap-2 mt-2">
              <button
                onClick={handleClose}
                type="button"
                className="text-sm text-white bg-text-disabled w-1/2 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </AuthForm>
        </div>
      )}
    </>
  );
};

export default MemberComponent;
