import Button from "../Form/Button/button";
import { AboutPageProps } from "./types";
import Image from "next/image";
import CloseCircle from "@/public/icons/close-circle.svg";
import { PlayIconButton } from "@/public/icons/icons";
import { ModalTrigger } from "../Modal/modal";
import React from 'react'
// import ReactPlayer from 'react-player/lazy'

const AboutPage: React.FC<AboutPageProps> = ({
  title,
  description,
  video,
}) => {
  return (
    <div className="w-[600px] max-w-[90%] rounded-[10px] bg-white overflow-hidden">
      <div className="bg-brand-1 px-8 py-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
          <ModalTrigger close className="p-1" type="button">
            <Image src={CloseCircle} alt="close" width={24} height={24} />
          </ModalTrigger>
        </div>
      </div>
      <div className="px-8 py-6">
        <p className="mb-6">{description}</p>
        <div className="rounded-[4px] border-4 border-text-tertiary w-full h-[205px] mb-6">
          <ReactPlayer url={video} width={528} height={197} pip controls
            playIcon={<PlayIconButton />}
            config={{
            }} />
        </div>
        <ModalTrigger close className="w-full">
          <Button className="w-full" type="button">Continue</Button>
        </ModalTrigger>
      </div>
    </div>
  );
};

export default AboutPage;
