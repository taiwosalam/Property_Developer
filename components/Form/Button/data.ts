const default_border = "border-2 border-solid border-transparent";
const default_interaction = "active:bg-transparent hover:opacity-70";

export const button_variants = {
  variant: {
    border: "custom-border-button",
    change: "bg-neutral-2 text-brand-9",
    default: "custom-default-button text-white",

    sky_blue: `${default_border} bg-brand-1 text-brand-9 active:border-brand-1 ${default_interaction}`,
    light_red: `${default_border} bg-status-error-1 text-status-error-primary active:border-status-error-1 ${default_interaction}`,
    light_green: `${default_border} bg-status-success-1 text-status-success-primary active:border-success-1 ${default_interaction}`,
    red: `${default_border} bg-status-error-primary text-white active:border-status-error-primary active:text-status-error-primary ${default_interaction}`,
    blank: `${default_border}`,
    custom: "",
  },
  size: {
    sm: "py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2.5vw,1rem)] text-[clamp(0.875rem,2.5vw,1rem)] font-normal",
    mid: "py-[clamp(0.625rem,2vw,0.875rem)] px-[clamp(0.75rem,2.5vw,1rem)] text-[clamp(1rem,3vw,1.125rem)] font-medium",
    default:
      "py-[clamp(0.5rem,2vw,0.875rem)] px-[clamp(0.75rem,3vw,3rem)] text-[clamp(0.875rem,3vw,1.125rem)] font-bold",
    xs_medium: "text-[clamp(0.75rem,2vw,0.875rem)] font-medium",
    xs_normal: "text-[clamp(0.75rem,2vw,0.875rem)] font-normal",
    xs_bold: "text-[clamp(0.75rem,2vw,0.875rem)] font-bold",
    sm_normal: "text-[clamp(0.875rem,2.5vw,1rem)] font-normal",
    sm_medium: "text-[clamp(0.875rem,2.5vw,1rem)] font-medium",
    sm_bold: "text-[clamp(0.875rem,2.5vw,1rem)] font-bold",
    base_medium: "text-[clamp(1rem,3vw,1.125rem)] font-medium",
    base_bold: "text-[clamp(1rem,3vw,1.125rem)] font-bold",
    "16_bold": "text-[clamp(1rem,3vw,1.125rem)] font-bold",
    custom: "",
  },
};
