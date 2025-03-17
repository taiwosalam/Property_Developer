import Image from "next/image";
import { useContext } from "react";
// Import
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import { DeleteIconOrange, UploadImageIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { useImageUploader } from "@/hooks/useImageUploader";

const ProfilePicture = () => {
  const { handleInputChange } = useContext(FlowProgressContext);

  const { preview, inputFileRef, handleImageChange, clearSelection } =
    useImageUploader({
      maxSize: { unit: "MB", value: 2 },
    });

  const handleButtonClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e);
    handleInputChange();
  };

  const handleDeleteImage = () => {
    clearSelection();
    handleInputChange();
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="profile picture">
        The profile photo size should be 100 x 100 pixels with a maximum file
        size of 2MB.
      </SectionHeading>

      <div className="flex gap-2">
        <input
          name="director_profile_picture"
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={handleFileChange}
          className="hidden setup-f required"
        />
        {preview ? (
          <div className="w-[100px] h-[100px] relative">
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-[-15px] right-[-25px] z-10"
              aria-label="Delete"
            >
              <DeleteIconOrange />
            </button>
            <Image
              src={preview}
              alt="Profile Picture"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg w-[100px] h-[100px]"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
          >
            <UploadImageIcon />
            <span className="text-text-secondary text-xs font-normal">
              Upload Profile Picture
            </span>
          </button>
        )}
        {preview && (
          <div className="flex items-end">
            <Button
              type="button"
              variant="change"
              size="sm"
              onClick={handleButtonClick}
            >
              Change Picture
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;



//FOR FUTURE -if need for default profile


// import Image from "next/image";
// import { useContext } from "react";
// // Imports
// import { SectionHeading } from "../Section/section-components";
// import Button from "../Form/Button/button";
// import { DeleteIconOrange, UploadImageIcon } from "@/public/icons/icons";
// import { FlowProgressContext } from "../FlowProgress/flow-progress";
// import { useImageUploader } from "@/hooks/useImageUploader";

// interface ProfilePictureProps {
//   defaultImage?: string; // Path to the default image
// }

// const ProfilePicture: React.FC<ProfilePictureProps> = ({ defaultImage }) => {
//   const { handleInputChange } = useContext(FlowProgressContext);

//   const { preview, inputFileRef, handleImageChange, clearSelection } =
//     useImageUploader({
//       maxSize: { unit: "MB", value: 2 },
//     });

//   const handleButtonClick = () => {
//     if (inputFileRef.current) {
//       inputFileRef.current.click();
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     handleImageChange(e);
//     handleInputChange();
//   };

//   const handleDeleteImage = () => {
//     clearSelection();
//     handleInputChange();
//   };

//   // Use the uploaded preview if available; otherwise, fallback to the defaultImage
//   const imageToShow = preview || defaultImage;

//   return (
//     <div className="custom-flex-col gap-5">
//       <SectionHeading title="profile picture">
//         The profile photo size should be 100 x 100 pixels with a maximum file
//         size of 2MB.
//       </SectionHeading>

//       <div className="flex gap-2">
//         <input
//           name="director_profile_picture"
//           type="file"
//           accept="image/*"
//           ref={inputFileRef}
//           onChange={handleFileChange}
//           className="hidden setup-f required"
//         />
//         {imageToShow ? (
//           <div className="w-[100px] h-[100px] relative">
//             <button
//               type="button"
//               onClick={handleDeleteImage}
//               className="absolute top-[-15px] right-[-25px] z-10"
//               aria-label="Delete"
//             >
//               <DeleteIconOrange />
//             </button>
//             <Image
//               src={imageToShow}
//               alt="Profile Picture"
//               fill
//               style={{ objectFit: "cover" }}
//               className="rounded-lg w-[100px] h-[100px]"
//             />
//           </div>
//         ) : (
//           <button
//             type="button"
//             onClick={handleButtonClick}
//             className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
//           >
//             <UploadImageIcon />
//             <span className="text-text-secondary text-xs font-normal">
//               Upload Profile Picture
//             </span>
//           </button>
//         )}
//         {imageToShow && (
//           <div className="flex items-end">
//             <Button
//               type="button"
//               variant="change"
//               size="sm"
//               onClick={handleButtonClick}
//             >
//               Change Picture
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePicture;