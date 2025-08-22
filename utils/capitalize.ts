// Types
import type { CapitalizeProps } from "./types";

export const capitalize = ({
  input,
  mode = "sentence",
}: CapitalizeProps): string => {
  if (mode === "word") {
    return input.replace(/\b\w/g, (char) => char.toUpperCase());
  } else if (mode === "sentence") {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  return input;
};
