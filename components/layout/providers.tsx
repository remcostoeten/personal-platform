"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { AuthContextProvider } from "@/core/providers/auth-provider";
import { TooltipProvider } from "../ui/tooltip";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthContextProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
