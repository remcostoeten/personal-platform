"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { auth } from "@/core/database/firebase";
import {
    useSignInWithGithub,
    useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import JSConfetti from 'js-confetti';

export default function SocialSignInButton({
    provider,
}: {
    provider: "github" | "google";
}) {
    const [signInWithGithub, userGithub, loadingGithub, errorGithub] =
        useSignInWithGithub(auth);
    const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
        useSignInWithGoogle(auth);
    const [jsConfettiInstance, setJsConfettiInstance] = useState<JSConfetti | null>(null);
    const router = useRouter();
    useEffect(() => {
        const confetti = new JSConfetti();
        setJsConfettiInstance(confetti);
    }, []);

    const triggerConfetti = (emoji: string) => {
        try {
            if (jsConfettiInstance) {
                jsConfettiInstance.addConfetti({
                    emojis: [emoji],
                    emojiSize: 70,
                    confettiNumber: 40,
                });
            }
        } catch (error) {
            console.error("Failed to trigger confetti", error);
        }
    };

    const signIn = provider === "github" ? signInWithGithub : signInWithGoogle;
    const Icon = provider === "github" ? Icons.gitHub : Icons.google;
    const buttonText = `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)
        }`;

    const handleSignIn = async () => {
        try {
            await signIn();
            console.log("User signed in");
            triggerConfetti("🎉");
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={handleSignIn}
        >
            <Icon className="mr-2 h-4 w-4" />
            {buttonText}
        </Button>
    );
}