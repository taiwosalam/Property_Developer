import clsx from "clsx";
import { CSSProperties } from "react";

export const LandlordTenantInfoBox: React.FC<{
  style?: CSSProperties;
  children: React.ReactNode;
}> = ({ style, children }) => (
  <div
    className="p-4 bg-white rounded-2xl overflow-hidden"
    style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)", ...style }}
  >
    {children}
  </div>
);

export const LandlordTenantInfo: React.FC<{
  heading?: string;
  info: Record<string, string | null>;
}> = ({ info, heading }) => (
  <LandlordTenantInfoBox>
    <div className="custom-flex-col gap-4">
      {heading && (
        <p className="text-black text-xl font-bold capitalize">
          {heading.split("_").join(" ")}
        </p>
      )}
      <div className="flex gap-10 text-base font-normal capitalize">
        <div className="custom-flex-col gap-4">
          {Object.keys(info).map((key, idx) => (
            <p key={idx} className="text-[#747474]">
              {key.split("_").join(" ")}:
            </p>
          ))}
        </div>
        <div className="custom-flex-col gap-4">
          {Object.values(info).map((value, idx) => (
            <p key={idx} className="text-black">
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
}> = ({ title, children, minimized }) => (
  <div
    className={clsx("custom-flex-col", {
      "gap-2": minimized,
      "gap-6": !minimized,
    })}
  >
    <p
      className={clsx("capitalize", {
        "text-black text-2xl font-bold": !minimized,
        "text-text-quaternary text-xl font-medium": minimized,
      })}
    >
      {title}
    </p>
    {children}
  </div>
);

export const LandlordTenantInfoDocument: React.FC<{}> = () => (
  <div className="w-[160px] h-[168px] rounded-2xl overflow-hidden bg-text-disabled custom-flex-col">
    <div className="flex-1"></div>
    <div className="p-4 bg-brand-primary text-white text-base font-medium">
      <p className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
        Name of document
      </p>
      <p>12 Oct 2024</p>
    </div>
  </div>
);

export const LandlordTenantInfoEditSection: React.FC<{
  title: string;
  style?: CSSProperties;
  headingStyle?: CSSProperties;
  children: React.ReactNode;
}> = ({ title, style, children, headingStyle }) => (
  <div
    className="p-6 xl:p-10 pt-5 rounded-[20px] bg-white custom-flex-col gap-10"
    style={style}
  >
    <h2
      className="text-primary-navy text-xl font-bold capitalize"
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
  <div className="grid grid-cols-2 gap-y-5 gap-x-6 xl:gap-x-[60px]">
    {children}
  </div>
);

export const LandlordTenantUserTag: React.FC<{ type: "web" | "mobile" }> = ({
  type,
}) => (
  <div
    className={clsx("py-1 px-4 rounded-lg", {
      "bg-status-caution-1": type === "web",
      "bg-success-1": type === "mobile",
    })}
  >
    <p
      className={clsx("capitalize text-[10px] font-normal", {
        "text-status-caution-3 ": type === "web",
        "text-success-3 ": type === "mobile",
      })}
    >
      {type}
    </p>
  </div>
);
