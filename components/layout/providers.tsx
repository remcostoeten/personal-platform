"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { AuthContextProvider } from "@/core/providers/auth-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}