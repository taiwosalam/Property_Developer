import { ChevronLeft } from "@/public/icons/icons";
import Image from "next/image";

interface AttachedImagesGridProps {
  images: string[];
}

const AttachedImagesGrid: React.FC<AttachedImagesGridProps> = ({ images }) => {
  return (
    <div className="space-y-4">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-[16px] font-medium">Attached Images</h2>
        <button type="button" className="flex items-center space-x-2 text-text-label text-sm font-medium">
          <p>Hide Images</p>
          <div className="-rotate-90">
            <ChevronLeft fill="#5A5D61" />
          </div>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.slice(0, 3).map((src, index) => (
          <div
            key={index}
            className="w-full md:h-[200px] h-[120px] xl:h-[115px] lg:h-[140px] bg-gray-200 rounded-lg relative overflow-hidden"
          >
            <Image
              src={src}
              alt={`image-${index}`}
              fill
              sizes="auto"
              priority
              className="object-cover object-center"
              quality={60}
            />
          </div>
        ))}
        {images.length > 3 && (
          <div className="w-full md:h-[200px] h-[120px] xl:h-[115px] lg:h-[140px] bg-gray-200 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <span className="text-xl text-white">+ {images.length - 3}</span>
            </div>
            <Image
              src={images[3]}
              alt="image-3"
              fill
              sizes="auto"
              priority
              className="object-cover object-center"
              quality={60}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachedImagesGrid;
