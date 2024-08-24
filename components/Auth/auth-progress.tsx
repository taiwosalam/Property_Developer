//types
import type { ProgresBarProps } from "./types";

export const ProgressBar: React.FC<ProgresBarProps> = ({ progress }) => {
  return (
    <div className="w-full flex gap-x-3 mx-auto mt-10">
      {/* First Half */}
      <div className="relative h-1 w-1/2 bg-[#C1C2C3] rounded overflow-hidden">
        <div
          style={{ width: `${progress >= 50 ? 100 : progress * 2}%` }}
          className={`absolute left-0 top-0 h-1 ${
            progress >= 50 ? "bg-[#01BA4C]" : "bg-[#01BA4C]"
          } rounded-l transition-all duration-300`}
        />
      </div>

      {/* Second Half */}
      <div className="relative h-1 w-1/2 bg-[#C1C2C3] rounded overflow-hidden">
        <div
          style={{ width: `${progress > 50 ? (progress - 50) * 2 : 0}%` }}
          className={`absolute left-0 top-0 h-1 ${
            progress > 50 ? "bg-[#01BA4C]" : "bg-[#C1C2C3]"
          } rounded-r transition-all duration-300`}
        />
      </div>
    </div>
  );
};
