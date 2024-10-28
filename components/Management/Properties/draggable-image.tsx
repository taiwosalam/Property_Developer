import Image from "next/image";
import { DeleteIconOrange } from "@/public/icons/icons";
// import { type UniqueIdentifier } from "@dnd-kit/core";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { Draggable } from "@hello-pangea/dnd";

interface DraggableImageProps {
  id: string;
  image: string;
  index: number;
  removeImage: (index: number) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  id,
  image,
  index,
  removeImage,
}) => {
  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          aria-roledescription="Press spacebar to lift Image"
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
            onMouseDown={(e) => {
              removeImage(index);
              e.stopPropagation();
            }} // Prevent drag events
            className="absolute top-1 right-1"
          >
            <DeleteIconOrange size={20} />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableImage;
