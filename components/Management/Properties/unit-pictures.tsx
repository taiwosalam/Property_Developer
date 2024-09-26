import { PlusIcon, DeleteIconOrange } from "@/public/icons/icons";
import Image from "next/image";
import { useUnitForm } from "./unit-form-context";
import clsx from "clsx";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MAX_FILE_SIZE_MB = 15; // Maximum file size in MB

interface SortableImageProps {
  id: UniqueIdentifier;
  image: string;
  index: number;
  removeImage: (index: number) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
  id,
  image,
  index,
  removeImage,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-shrink-0 relative w-[285px] h-[155px] rounded-lg overflow-hidden border border-gray-300"
    >
      <Image
        src={image}
        alt={`Property Image ${index + 1}`}
        className="object-cover object-center w-full h-full"
        fill
      />
      <button
        type="button"
        aria-label="Remove Image"
        // onClick={(e) => {
        //   console.log("clicked remove");
        //   e.stopPropagation();
        //   removeImage(index);
        // }}
        onMouseDown={(e) => {
          removeImage(index);
          e.stopPropagation();
        }} // Prevent drag events
        className="absolute top-1 right-1"
      >
        <DeleteIconOrange size={20} />
      </button>
    </div>
  );
};

const UnitPictures = () => {
  const { images, setImages, removeImage, isEditing } = useUnitForm();

  const sortableImages = images.map((image, index) => ({
    id: index,
    index,
    image,
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (activeId !== overId) {
      const oldIndex = sortableImages.findIndex(
        (image) => image.id === active.id
      );
      const newIndex = sortableImages.findIndex(
        (image) => image.id === over.id
      );
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages, { append: false });
    }
  };

  return (
    <div className={clsx(isEditing && "!mt-0")}>
      <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
        Unit Pictures
      </h4>
      <hr
        className={clsx(
          "my-4 border-none bg-borders-dark",
          isEditing ? "h-[1px]" : "h-[2px]"
        )}
      />
      <p className="text-text-secondary mb-5">
        Unit pictures are what will be shown to potential clients on the mobile
        app and your default website (maximum of 14 images). Please drag your
        preferred image and place it in the first position to make it the
        primary display.
      </p>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortableImages.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden">
            {sortableImages.map((s) => (
              <SortableImage
                key={s.id}
                id={s.id}
                image={s.image}
                index={s.index}
                removeImage={removeImage}
              />
            ))}
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
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default UnitPictures;
