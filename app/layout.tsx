import "@/styles/globals.css";
import { Suspense } from "react";

// Imports
import { Toaster } from "sonner";
import { primaryFont } from "@/utils/fonts";
import ThemeProvider from "./theme-provider";
import { Theme } from "@/components/theme";
import { RoleProvider } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { fetchProfile } from "@/lib/profile";

export async function generateMetadata() {
  const data = await fetchProfile();
  const companyName = data.data.company?.company_name || "Our Property";
  const companyLogo = data.data.company?.company_logo || "/default-favicon.ico";

  return {
    title: companyName,
    description: "Admin Portal",
    icons: { icon: companyLogo },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${primaryFont.className} antialiased`}
        suppressHydrationWarning
      >
        <RoleProvider>
          <Theme
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider />
            <Suspense
              fallback={
                <div>
                  <PageCircleLoader />
                </div>
              }
            >
              <div className="w-full relative z-[1]">{children}</div>
            </Suspense>
            <div id="portal" className="z-[2]">
              <Toaster
                richColors
                className={`${primaryFont.className} antialiased z-[1000]`}
                position="top-right"
                duration={5000}
              />
            </div>
          </Theme>
        </RoleProvider>
      </body>
    </html>
  );
}
