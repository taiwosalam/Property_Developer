import Button from "../Form/Button/button";
import { AboutPageProps } from "./types";
import Image from "next/image";
import AboutLandlordPic from "@/public/about/about-landlord.png";
import { PlayIconButton } from "@/public/icons/icons";

const AboutPage: React.FC<AboutPageProps> = ({
  title,
  description,
  video,
  handleClose,
}) => {
  return (
    <>
      <h2>{title}</h2>
      <div>
        <p className="mb-6">{description}</p>
        <div className="rounded-[4px] border-4 bg-text-tertiary overflow-hidden">
          <button
            type="button"
            aria-label="Play Video"
            className="absolute inset-0 flex items-center justify-center text-black"
          >
            <PlayIconButton />
          </button>
          {/* <Image src={AboutLandlordPic} alt={"about video/picture"} fill /> */}
        </div>
      </div>

      <Button onClick={handleClose}>Continue</Button>
    </>
  );
};

export default AboutPage;
