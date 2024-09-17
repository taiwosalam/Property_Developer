// Types
import type { cardProps } from "./types";

// Imports
import clsx from "clsx";
import Image from "next/image";

const Card: React.FC<cardProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "rounded-[8px] min-w-[270px] md:min-w-full md:h-[130px] py-4 px-[18px] text-text-primary bg-white shadow-md",
        className
      )}
      {...props}
    >
      <div className="w-full flex justify-between mb-1">
        <p className="text-text-secondary text-sm font-medium">{props.title}</p>
        <div
          className={`h-[35px] w-[35px] flex items-center rounded-[6px] p-1 justify-center`}
          style={{
            backgroundColor: props.bg,
          }}
        >
          <Image src={props.icon} alt="icon" width={33} height={33} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{props.value}</div>
      <div>
        <p className="text-text-secondary text-sm font-medium">
          {props.subvalue}
          <span className="text-text-label text-xs font-normal capitalize ml-2">
            This month
          </span>
        </p>
      </div>
    </div>
  );
};

export default Card;
