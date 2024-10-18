export interface LoaderBaseProps {
  layout: "dasboard" | "page" | "profile";
}

export interface LoadingPageProps extends LoaderBaseProps {
  layout: "page";
  hasStartCards?: boolean;
  statsCardCount?: number;
  hasPageTitle?: boolean;
  pageTitle?: string;
  view?: "grid" | "table";
}

export interface LoadingDasboardProps extends LoaderBaseProps {
  layout: "dasboard";
}

export interface LoadingProfileProps extends LoaderBaseProps {
  layout: "profile";
}

export type CustomLoaderProps =
  | LoadingPageProps
  | LoadingDasboardProps
  | LoadingProfileProps;
