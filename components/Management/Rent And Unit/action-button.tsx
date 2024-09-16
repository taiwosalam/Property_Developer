import Link from "next/link";
import { ActionButtonProps } from "./types";

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  color,
  route,
}) => (
  <Link href={route} passHref>
    <div
      className="py-2 px-4 rounded-[20px] text-white text-xs font-medium cursor-pointer"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  </Link>
);
