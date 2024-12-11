"use client";

import Image from "next/image";
import React, { CSSProperties, useState, useRef, useEffect } from "react";

// Types
import type { InventoryItemProps } from "./types";

// Imports
import { inventory_conditions } from "./data";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { InventoryField } from "./inventory-components";
import {
  CameraIcon,
  EditPencilIcon,
  ImageIcon,
  PlusIcon,
} from "@/public/icons/icons";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { CounterButton } from "@/components/Settings/SettingsEnrollment/settings-enrollment-components";
import { toast } from "sonner";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { MAX_FILE_SIZE_MB } from "@/data";
import DraggableImage from "../Properties/draggable-image";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";

interface AddPictureModalProps {
  handleSave: () => void;
  handleDragEnd: (result: DropResult) => void;
  sortableImages: any[];
  removeImage: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  images: any[];
  index: number;
  video?: string;
}

const InventoryItem: React.FC<InventoryItemProps & { index: number }> = ({
  data,
  edit,
  index,
  inventoryFiles,
  setInventoryFiles,
  video,
}) => {
  const initialImages = data?.images || [];
  const isDarkMode = useDarkMode();
  const [screenModal, setScreenModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [count, setCount] = useState<string | number>(data?.quantity || data?.unit || 1);

  const maxNumberOfImages = 6;
  const {
    images,
    imageFiles,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleImageReorder,
    resetImages,
  } = useMultipleImageUpload({
    maxImages: maxNumberOfImages,
    maxFileSizeMB: MAX_FILE_SIZE_MB,
    initialImages: initialImages,
  });
  
useEffect(() => {
  if (inventoryFiles?.length === 0 && setInventoryFiles) {
    // Set inventoryFiles to initialImages when the user hasn't uploaded any images yet
    setInventoryFiles((prevState: File[][]) => {
      const updatedFiles = [...prevState];
      updatedFiles[index] = initialImages as unknown as File[]; // Set initial images for the specific index
      return updatedFiles;
    });
  }
}, [initialImages, inventoryFiles, index]);

// Use imageFiles (from useMultipleImageUpload) when user interacts with the image input
useEffect(() => {
  if (imageFiles?.length > 0 && setInventoryFiles) {
    setInventoryFiles((prevState: File[][]) => {
      const updatedFiles = [...prevState];
      updatedFiles[index] = imageFiles as unknown as File[]; // Update the images for the specific index
      return updatedFiles;
    });
  }
}, [imageFiles, index]);

  const handleSave = () => {
    setOpenModal(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    handleImageReorder(source.index, destination.index);
  };

  const sortableImages = images.map((image, index) => ({
    id: uuidv4(),
    index,
    image,
  }));

  const handleIncrement = () => {
  setCount((prevCount) => Number(prevCount) + 1);
};

const handleDecrement = () => {
  setCount((prevCount) => Math.max(1, Number(prevCount) - 1));
};


  const input_styles: CSSProperties = {
    backgroundColor: isDarkMode ? "#020617" : "white",
  };

  return (
    <div
      className="w-full p-[18px] pb-0 flex-1 bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="pb-[18px]">
        <div className="flex flex-wrap-reverse items-center gap-5 2xl:gap-[66px]">
          <div className="custom-flex-col gap-6 flex-1 py-2 min-w-[240px]">
            <div className="custom-flex-col gap-2 flex-1">
              {edit ? (
                <Input
                  id={`item-name-${index}`}
                  name={`item-name-${index}`}
                  label="Inventory name/Unit"
                  className="flex-1"
                  style={input_styles}
                  defaultValue={data?.name || data?.description || ""}
                />
              ) : (
                <InventoryField>
                  {data?.name || data?.description || "---"}
                </InventoryField>
              )}
            </div>
            <div className="flex gap-4">
              {edit ? (
                <>
                  <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      name={`quantity-${index}`}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                    />
                    <div className="btn flex flex-col items-end justify-end">
                      <CounterButton
                        onClick={handleIncrement}
                        icon="/icons/plus.svg"
                        alt="plus"
                      />
                      <CounterButton
                        onClick={handleDecrement}
                        icon="/icons/minus.svg"
                        alt="minus"
                      />
                    </div>
                  </div>
                  <Select
                    id={`condition-${index}`}
                    name={`condition-${index}`}
                    placeholder="Condition"
                    options={inventory_conditions}
                    className="flex-1"
                    isSearchable={false}
                    defaultValue={data?.condition}
                  />
                </>
              ) : (
                <>
                  <InventoryField>
                    {data?.unit || data?.quantity || "---"}
                  </InventoryField>
                  <InventoryField>{data?.condition || "---"}</InventoryField>
                </>
              )}
            </div>
          </div>
          <div className="relative h-full min-h-[165px] aspect-square rounded-2xl overflow-hidden">
            {/* Image Modal */}
            <PopupImageModal
              isOpen={screenModal}
              onClose={() => setScreenModal(false)}
              images={images.map((image) => ({
                src: image,
              }))}
              video={video}
            />
            {/* NOT EDIT MODE START */}
            <div
              className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer flex-shrink-0"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              role="button"
              onClick={() => setScreenModal(true)}
            >
              {images.length > 0 && (
                <Image
                  src={images[0] || data?.images[0] || ""}
                  alt={`Inventory Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
             {!edit && <div
                className="absolute top-2 right-2 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5 cursor-pointer"
                onClick={() => setScreenModal(true)}
              >
                <CameraIcon />
                <p className="text-black font-medium text-[10px] cursor-pointer">
                  +{images.length}
                </p>
              </div>}
            </div>
            {/* NOT EDIT MODE END */}
            {edit && (
              <div
                className={`absolute inset-0 flex ${
                  images.length === 0
                    ? "items-center justify-center"
                    : "flex-col items-end justify-between mr-4 my-4"
                }`}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
              >
                {edit && images.length > 0 && (
                  <div
                    className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5 cursor-pointer"
                    onClick={() => setScreenModal(true)}
                  >
                    <CameraIcon />
                    <p className="text-black font-medium text-[10px] cursor-pointer">
                      +{images.length}
                    </p>
                  </div>
                )}
                <Modal state={{ isOpen: openModal, setIsOpen: setOpenModal }}>
                  <ModalTrigger>
                    {images.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 custom-primary-color">
                        <ImageIcon />
                        <p className="text-brand-9 text-sm font-semibold">
                          Add picture
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end items-end">
                        <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                          <EditPencilIcon size={10} />
                          <p className="text-black font-medium text-[10px]">
                            Manage
                          </p>
                        </div>
                      </div>
                    )}
                  </ModalTrigger>
                  <ModalContent>
                    <LandlordTenantModalPreset heading="Add Pictures">
                      <AddPictureModal
                        handleSave={handleSave}
                        handleDragEnd={handleDragEnd}
                        sortableImages={sortableImages}
                        removeImage={removeImage}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        images={images}
                        index={index}
                      />
                    </LandlordTenantModalPreset>
                  </ModalContent>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;

const AddPictureModal = ({
  handleSave,
  handleDragEnd,
  sortableImages,
  removeImage,
  fileInputRef,
  handleFileChange,
  images,
  index,
}: AddPictureModalProps) => {
  const maxNumberOfImages = 6;
  // console.log("Images - ", images);

  return (
    <div className="">
      <p className="mb-5 text-text-secondary dark:text-darkText-1 text-base font-normal">
        Set Inventory pictures for easy recognition (maximum of{" "}
        {maxNumberOfImages} images). Please drag your preferred image and place
        it in the first position to make it the primary display.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="property-images" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 overflow-x-auto custom-round-scrollbar overflow-y-hidden pb-2"
            >
              {sortableImages.map((s) => (
                <DraggableImage
                  key={s.id}
                  id={s.id}
                  image={s.image}
                  index={s.index}
                  removeImage={removeImage}
                />
              ))}
              {provided.placeholder}
              {images.length < 6 && (
                <label
                  htmlFor="inventory_pictures"
                  className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262] dark:text-darkText-2"
                >
                  <PlusIcon />
                  <span className="text-black dark:text-white text-base font-normal mt-2">
                    Add Pictures
                  </span>
                  <input
                    id="inventory_pictures"
                    name={`image-${index}`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave}>Submit</Button>
      </div>
    </div>
  );
};