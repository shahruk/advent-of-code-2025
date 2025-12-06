import type { Metadata } from "next";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css";

export const metadata: Metadata = {
  title: "Advent of Code 2025 - Web Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}