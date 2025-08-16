export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    size?:
      | "sm"
      | "mid"
      | "default"
      | "xs_medium"
      | "xs_normal"
      | "xs_bold"
      | "sm_normal"
      | "sm_medium"
      | "sm_bold"
      | "base_medium"
      | "base_bold"
      | "16_bold"
      | "lg_normal"
      | "lg_medium"
      | "lg_bold"
      | "xl_normal"
      | "xl_medium"
      | "xl_bold"
      | "custom";
    variant?:
      | "border"
      | "change"
      | "default"
      | "sky_blue"
      | "light_red"
      | "light_green"
      | "red"
      | "blank"
      | "custom";
    className?: string;
    children: React.ReactNode;
  }
  