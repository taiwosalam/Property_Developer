"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { CSSProperties } from "react";
import Link from "next/link";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "../Form/Button/button";
import { ModalTrigger } from "../Modal/modal";
import TextArea from "../Form/TextArea/textarea";
import { DeleteIconX } from "@/public/icons/icons";

export const LandlordTenantInfoBox: React.FC<{
  style?: CSSProperties;
  children: React.ReactNode;
  className?: string;
}> = ({ style, children, className }) => (
  <div
    className={clsx(
      "p-4 bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden",
      className
    )}
    style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)", ...style }}
  >
    {children}
  </div>
);

export const LandlordTenantInfo: React.FC<{
  heading?: string;
  separator?: boolean;
  info: Record<string, string | null>;
  containerClassName?: string;
}> = ({ info, heading, separator, containerClassName }) => (
  <LandlordTenantInfoBox className={containerClassName}>
    <div className="custom-flex-col gap-4">
      {heading && (
        <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
          {heading.split("_").join(" ")}
        </h3>
      )}
      {separator && (
        <div className="w-full border border-dashed border-brand-9 opacity-40"></div>
      )}
      <div className="flex gap-10 text-sm lg:text-base font-normal capitalize">
        <div className="custom-flex-col gap-4">
          {Object.keys(info).map((key, idx) => (
            <p key={idx} className="text-[#747474] dark:text-darkText-1">
              {key.split("_").join(" ")}:
            </p>
          ))}
        </div>
        <div className="custom-flex-col gap-4">
          {Object.values(info).map((value, idx) => (
            <p key={idx} className="text-black dark:text-darkText-2">
              {value?.split("_").join(" ") ?? "N/A"}
            </p>
          ))}
        </div>
      </div>
    </div>
  </LandlordTenantInfoBox>
);

export const LandlordTenantInfoSection: React.FC<{
  title: string;
  minimized?: boolean;
  children: React.ReactNode;
}> = ({ title, children, minimized }) => {
  const commonClasses = "capitalize dark:text-white";
  return (
    <div
      className={clsx("custom-flex-col", {
        "gap-2": minimized,
        "gap-5": !minimized,
      })}
    >
      {minimized ? (
        <h3
          className={clsx(
            commonClasses,
            "text-text-quaternary text-base md:text-lg font-medium"
          )}
        >
          {title}
        </h3>
      ) : (
        <h2
          className={clsx(
            commonClasses,
            "text-black text-lg md:text-xl lg:text-2xl font-bold"
          )}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export interface AttachedDocumentCard {
  id: string | number;
  name: string;
  date?: string;
  thumbnail?: string;
  link: string;
}

export const LandlordTenantInfoDocument: React.FC<AttachedDocumentCard> = ({
  name,
  date,
  thumbnail,
  link,
}) => (
  <Link
    href={link}
    className="w-[160px] h-[168px] rounded-2xl overflow-hidden bg-text-disabled custom-flex-col"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div className="flex-1">
      <div
        className="w-full h-full bg-text-disabled"
        style={{
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
    <div className="p-4 bg-brand-primary text-white text-sm lg:text-base font-medium">
      <p className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
        {name}
      </p>
      <p>{date}</p>
    </div>
  </Link>
);

export const LandlordTenantInfoEditSection: React.FC<{
  title: string;
  style?: CSSProperties;
  headingStyle?: CSSProperties;
  children: React.ReactNode;
}> = ({ title, style, children, headingStyle }) => (
  <div
    className="p-6 pt-5 rounded-[20px] bg-white dark:bg-darkText-primary custom-flex-col gap-10"
    style={style}
  >
    <h2
      className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold capitalize"
      style={headingStyle}
    >
      {title}
    </h2>
    {children}
  </div>
);

export const LandlordTenantInfoEditGrid: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-y-5 gap-x-6 xl:gap-x-[60px]">
    {children}
  </div>
);

export const NotesInfoBox: React.FC<{
  notes: { last_updated: string; write_up: string };
}> = ({ notes }) => {
  return (
    <LandlordTenantInfoBox className="custom-flex-col gap-4">
      <div className="flex justify-between gap-4">
        <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-end gap-1">
          <span>Note</span>
          <sub className="text-sm font-normal bottom-[unset]">
            <span className="font-bold">Last Updated</span> {notes.last_updated}
          </sub>
        </h3>
      </div>
      <TruncatedText
        lines={7}
        className="text-text-quaternary dark:text-darkText-2 text-sm lg:text-base font-normal"
      >
        {notes.write_up}
      </TruncatedText>
    </LandlordTenantInfoBox>
  );
};

export const MobileNotesModal: React.FC<{
  notes: { last_updated: string; write_up: string };
}> = ({ notes }) => {
  const [editNote, setEditNote] = useState(false);
  const [note, setNote] = useState(notes.write_up);

  useEffect(() => {
    setNote(notes.write_up);
  }, [notes]);

  return (
    <LandlordTenantInfoBox className="w-[600px] max-w-[80%] max-h-[85%] min-h-[250px] bg-white dark:bg-darkText-primary rounded-lg overflow-auto custom-round-scrollbar">
      <div className="flex justify-between gap-4 sticky z-[1] top-0 bg-white dark:bg-black">
        <div className="flex gap-2 items-center">
          <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-end gap-1">
            <span>Note</span>
            <sub className="text-sm font-normal bottom-[unset]">
              <span className="font-bold">Last Updated</span>{" "}
              {notes.last_updated}
            </sub>
          </h3>
          <div className="flex items-center gap-2">
            {editNote ? (
              <>
                <Button
                  variant="light_red"
                  size="xs_normal"
                  className="py-1 px-2"
                  onClick={() => setNote("")}
                >
                  Clear
                </Button>
                <Button
                  variant="sky_blue"
                  size="xs_normal"
                  className="py-1 px-2"
                >
                  Update
                </Button>
              </>
            ) : (
              <Button
                variant="sky_blue"
                size="xs_normal"
                className="py-1 px-2"
                onClick={() => setEditNote(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        <ModalTrigger aria-label="Close" close>
          <DeleteIconX size={28} />
        </ModalTrigger>
      </div>
      <div className="pt-2">
        {editNote ? (
          <TextArea
            id="write_up"
            value={note}
            onChange={(value) => setNote(value)}
            inputSpaceClassName="!h-[auto] min-h-[160px]"
          />
        ) : (
          <TruncatedText
            lines={7}
            className="text-text-quaternary dark:text-darkText-2 text-sm lg:text-base font-normal"
          >
            {notes.write_up}
          </TruncatedText>
        )}
      </div>
    </LandlordTenantInfoBox>
  );
};
