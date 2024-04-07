"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
