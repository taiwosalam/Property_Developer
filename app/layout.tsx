import "@/styles/globals.css";

// Imports
import { Toaster } from "sonner";
import { primaryFont } from "@/utils/fonts";
import ThemeProvider from "./theme-provider";
import { Theme } from "@/components/theme";
import { getRoleFromCookie } from "@/utils/getRole";
import { RoleProvider } from "@/hooks/roleContext";
import { getLocalStorage } from "@/utils/local-storage";

export const metadata = {
  title: "Our Property",
  description: "Admin Portal",
  charset: "UTF-8",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUserDetails = getLocalStorage('additional_details');
  let appearance: { colorMode: string; view: string; navbar: string; fonts: string; dashboardColor: string; } | undefined;
  if (loggedInUserDetails) {
    ({ appearance } = loggedInUserDetails);
  }
  return (
    <html lang='en'>
      <body
        className={`${primaryFont.className} antialiased`}
        suppressHydrationWarning
      >
        <RoleProvider>
          <Theme
            attribute='class'
            // defaultTheme='light'
            defaultTheme={appearance?.colorMode || 'light'}
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider />
            <div className='w-full relative z-[1]'>{children}</div>
            <div
              id='portal'
              className='z-[2]'
            >
              <Toaster
                richColors
                className={`${primaryFont.className} antialiased z-[1000]`}
                position='top-right'
                duration={5000}
              />
            </div>
          </Theme>
        </RoleProvider>
      </body>
    </html>
  );
}
