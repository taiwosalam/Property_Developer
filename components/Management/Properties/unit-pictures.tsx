import { PlusIcon } from "@/public/icons/icons";
import DraggableImage from "./draggable-image";
import { useUnitForm } from "./unit-form-context";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAddUnitStore } from "@/store/add-unit-store";
import { MAX_FILE_SIZE_MB } from "@/data";

const UnitPictures = () => {
  const { images, setImages, removeImage, isEditing } = useUnitForm();
  const propertyDetails = useAddUnitStore((state) => state.propertyDetails);

  const sortableImages = images.map((image, index) => ({
    id: uuidv4(),
    index,
    image,
  }));

  const maxImages =
    propertyDetails?.category === "estate" ||
    propertyDetails?.category === "facility"
      ? 5
      : 14;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    files = files.slice(0, maxImages - images.length);
    const validImages: string[] = [];
    const oversizeImages: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Upload only image files.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        oversizeImages.push(file.name);
        continue;
      }
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          validImages.push(reader.result as string);
          if (validImages.length + oversizeImages.length === files.length) {
            setImages(validImages, { append: true });
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("There was an error processing your image. Please try again.");
      }
    }

    if (oversizeImages.length > 0) {
      alert(
        `Some files were not uploaded due to exceeding the maximum size: ${MAX_FILE_SIZE_MB} MB`
      );
    }
    e.target.value = ""; // Reset input value to allow re-uploading the same file
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    const newImages = Array.from(images);
    const [movedImage] = newImages.splice(source.index, 1);
    newImages.splice(destination.index, 0, movedImage);
    setImages(newImages, { append: false });
  };

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
              {images.length < 14 && (
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
