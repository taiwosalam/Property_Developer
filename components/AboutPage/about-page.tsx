import Button from "../Form/Button/button";
import { AboutPageProps } from "./types";
import Image from "next/image";
import CloseCircle from "@/public/icons/close-circle.svg";
import { PlayIconButton } from "@/public/icons/icons";
import { ModalTrigger } from "../Modal/modal";
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import Link from "next/link";
const DynamicReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const AboutPage: React.FC<AboutPageProps> = ({
  title,
  description,
  video,
  readingLink,
}) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="w-[600px] max-w-[90%] rounded-[10px] max-h-[90%] bg-white overflow-x-hidden overflow-y-scroll">
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
        {readingLink && (
          <Link href={readingLink} prefetch={false} target="_blank" className="font-medium hover:text-brand-7 transition-all duration-300 hover:font-bold">
            Read More....
          </Link>
        )}
        {isClient &&
          <div className="rounded-[4px] border-4 border-text-tertiary w-full h-[205px] my-6">
            <DynamicReactPlayer url={video} width="100%" height="100%" pip controls
              playIcon={<PlayIconButton />}
              config={{
              }} />
          </div>
        }
        <ModalTrigger close asChild className="w-full">
          <Button className="w-full" type="button">Continue</Button>
        </ModalTrigger>
      </div>
    </div>
  );
};

export default AboutPage;
