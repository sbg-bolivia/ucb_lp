import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/AuthContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "@/hooks/useTRPC";
import { GA_TRACKING_ID } from "@/lib/analytics";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {GA_TRACKING_ID && <GoogleAnalytics gaTrackingId={GA_TRACKING_ID} />}
        <StructuredData />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <AuthProvider>
            <TRPCProvider>
              <RoleBasedRedirect>{children}</RoleBasedRedirect>
              <Toaster />
            </TRPCProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
