"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { auth } from "@/core/database/firebase";
import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

export default function SocialSignInButton({
  provider,
}: {
  provider: "github" | "google";
}) {
  const [signInWithGithub, userGithub, loadingGithub, errorGithub] =
    useSignInWithGithub(auth);
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  const signIn = provider === "github" ? signInWithGithub : signInWithGoogle;
  const Icon = provider === "github" ? Icons.gitHub : Icons.google;
  const buttonText = `Continue with ${
    provider.charAt(0).toUpperCase() + provider.slice(1)
  }`;

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => signIn()}
    >
      <Icon className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
