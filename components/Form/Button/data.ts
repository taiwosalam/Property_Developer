const default_border = "border-2 border-solid border-transparent";
const default_interaction = "active:bg-transparent hover:opacity-70";

export const button_variants = {
  variant: {
    border: "custom-border-button",
    change: "bg-neutral-2 text-brand-9",
    default: "custom-default-button text-white",

    sky_blue: `${default_border} bg-brand-1 text-brand-9 active:border-brand-1 ${default_interaction}`,
    light_red: `${default_border} bg-status-error-1 text-status-error-primary active:border-status-error-1 ${default_interaction}`,
    light_green: `${default_border} bg-success-1 text-status-success-primary active:border-success-1 ${default_interaction}`,

    blank: `${default_border}`,
  },
  size: {
    sm: "py-2 px-3 text-sm font-normal",
    mid: "py-[10px] px-3 text-base font-medium",
    default: "py-2 px-3 md:py-[10px] md:px-12 text-sm lg:text-lg font-bold",

    xs_medium: "font-medium text-xs",
    sm_medium: "font-medium text-sm",
    base_medium: "font-medium text-base",
  },
};
