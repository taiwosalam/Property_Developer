import React, { useContext, useEffect } from "react";
import { ExclamationMark, PlusIcon } from "@/public/icons/icons";
import DraggableImage from "./draggable-image";
import { useUnitForm } from "./unit-form-context";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAddUnitStore } from "@/store/add-unit-store";
// import { MAX_FILE_SIZE_MB } from "@/data";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";
import { useGlobalStore } from "@/store/general-store";
import Button from "@/components/Form/Button/button";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { toast } from "sonner";
import { useTourStore } from "@/store/tour-store";
import { usePathname } from "next/navigation";

const UnitPictures = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
  const allowEditUnit = useGlobalStore((s) => s.allowEditUnit);
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const {
    images,
    setImages,
    isEditing,
    formResetKey,
    notYetUploaded,
    unitData,
  } = useUnitForm();
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const maxImages = propertyType === "facility" ? 5 : 14;
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm);
  // const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);

  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const { submitLoading, setIsEditing, resetForm } = useUnitForm();

  const {
    fileInputRef,
    handleFileChange,
    handleImageReorder,
    removeImage,
    resetImages,
  } = useMultipleImageUpload({
    maxImages: maxImages,
    initialImages: images,
    onImagesUpdate: (a) => {
      setImages({ images: a.images, imageFiles: a.imageFiles });
    },
  });

  const sortableImages = images.map((image, index) => ({
    id: uuidv4(),
    index,
    image,
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    handleImageReorder(source.index, destination.index);
  };

  useEffect(() => {
    if (formResetKey !== 0) {
      resetImages();
    }
  }, [formResetKey, resetImages]);

  const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleInputChange();
    if (!canSubmit) {
      toast.error(
        `The following fields are required: ${missingFields.join(", ")}`
      );
      return;
    }
    const form = e.currentTarget.form;
    form?.requestSubmit();
  };

  const pathname = usePathname();

  // Tour implementation
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("EditPropertyTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  // Check if the current form's ID matches any unit in addedUnits
  const isExistingUnit =
    unitData?.id && addedUnits.some((unit) => unit.id === unitData.id);

  // Show buttons if:
  // 1. notYetUploaded is true (unsaved unit)
  // 2. newForm is true (blank form)
  // 3. unitData is undefined or unitData.id is undefined (new form with no unit data)
  // 4. The form's ID does NOT match any unit in addedUnits
  const shouldShowButtons =
    addedUnits.length > 0 &&
    (notYetUploaded || newForm || !unitData || !unitData.id) &&
    !isExistingUnit;

  const handleTourSection = () => {
    if (propertyType === "facility" && pathname.startsWith("/manager")) {
      goToStep(21);
    } else if (
      propertyType === "rental" &&
      pathname.startsWith("/accountant")
    ) {
      goToStep(25);
    } else if(propertyType === "facility" && pathname.startsWith("/accountant")){
      goToStep(20);
    }
     else if (propertyType === "facility") {
      goToStep(22);
    } else if (propertyType === "rental" && pathname.startsWith("/manager")) {
      goToStep(26);
    } else if (propertyType === "rental") {
      goToStep(27);
    } else if (
      propertyType === "facility" &&
      pathname.startsWith("/management")
    ) {
      goToStep(6);
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "unit-form-pictures-wrapper unit-pictures-upload unit-picture-wrapper scroll-mt-[160px]",
        isEditing && "!mt-0"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="flex items-center text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
            {propertyType === "rental" && (
              <span className="text-red-500">*</span>
            )}
            Unit Pictures
          </h4>
          <button
            onClick={handleTourSection}
            type="button"
            className="text-orange-normal"
          >
            <ExclamationMark />
          </button>
        </div>

        {shouldShowButtons && (
          <div className="flex gap-4 justify-end edit-unit-action-btns">
            <Button
              size="sm_medium"
              variant="light_red"
              className="py-1 px-8"
              onClick={() => {
                setAddUnitStore("newForm", false);
                setGlobalStore("closeUnitForm", true);
              }}
            >
              Remove
            </Button>
            <Button
              type="button"
              size="sm_medium"
              className="py-1 px-8"
              disabled={submitLoading}
              onClick={handleUpdateClick}
            >
              {submitLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        )}
      </div>
      <hr
        className={clsx(
          "my-4 border-none bg-borders-dark",
          isEditing ? "h-[1px]" : "h-[2px]"
        )}
      />
      <p className="text-text-secondary dark:text-darkText-1 mb-5">
        Unit pictures are what will be shown to potential clients on the mobile
        app and your default website (maximum of 14 images). Please drag your
        preferred image and place it in the first position to make it the
        primary display.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="unit-images" direction="horizontal">
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
              {images.length < maxImages && (
                <label
                  htmlFor="unit_pictures"
                  className="unit-picture-wrapper flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white dark:bg-darkText-primary flex flex-col items-center justify-center cursor-pointer text-[#626262]"
                >
                  <PlusIcon />
                  <span className="text-black dark:text-white text-base font-normal mt-2">
                    Add Pictures
                  </span>
                  <input
                    id="unit_pictures"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});
UnitPictures.displayName = "UnitPictures";
export default UnitPictures;
