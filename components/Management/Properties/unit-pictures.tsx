import { useEffect } from "react";
import { PlusIcon } from "@/public/icons/icons";
import DraggableImage from "./draggable-image";
import { useUnitForm } from "./unit-form-context";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAddUnitStore } from "@/store/add-unit-store";
import { MAX_FILE_SIZE_MB } from "@/data";
import { useMultipleImageUpload } from "@/hooks/useMultipleImageUpload";

const UnitPictures = () => {
  const { images, setImages, isEditing, formResetKey } = useUnitForm();
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const maxImages = propertyType === "facility" ? 5 : 14;

  const {
    fileInputRef,
    handleFileChange,
    handleImageReorder,
    removeImage,
    resetImages,
  } = useMultipleImageUpload({
    maxImages: maxImages,
    maxFileSizeMB: MAX_FILE_SIZE_MB,
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

  return (
    <div className={clsx(isEditing && "!mt-0")}>
      <h4 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
        Unit Pictures
      </h4>
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
              className="flex gap-4 overflow-x-auto custom-round-scrollbar overflow-y-hidden"
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
                  className="flex-shrink-0 w-[285px] h-[155px] rounded-lg border-2 border-dashed border-[#626262] bg-white flex flex-col items-center justify-center cursor-pointer text-[#626262]"
                >
                  <PlusIcon />
                  <span className="text-black text-base font-normal mt-2">
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
};

export default UnitPictures;
