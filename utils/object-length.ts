// Types
import type { ObjectLengthProps } from "./types";

export const objectLength = (obj: ObjectLengthProps) => {
  return Object.entries(obj).length;
};
