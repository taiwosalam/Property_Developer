// Types
import type { cardProps } from "./types";

// Imports
import clsx from "clsx";
import Image from "next/image";

const Card: React.FC<cardProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "rounded-[8px] h-[130px] py-4 px-[18px] text-text-primary bg-white shadow-md",
        className
      )}
      {...props}
    >
      <div className="w-full flex justify-between mb-1">
        <p className="text-text-secondary text-sm">{props.title}</p>
        <div
          className={`h-[35px] w-[35px] flex items-center rounded-[6px] p-2`}
          style={{
            backgroundColor: props.bg,
          }}
        >
          <Image src={props.icon} alt="icon" width={24} height={24} />
        </div>
      </div>
      <div className="text-3xl mb-2">{props.value}</div>
      <div>
        <p className="text-text-secondary text-sm">
          {props.subvalue}
          <span className="text-text-label text-xs capitaliz ml-2">
            this month
          </span>
        </p>
      </div>
    </div>
  );
};

export default Card;
