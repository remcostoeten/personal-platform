"use client";

import { useEffect, useState } from 'react';
import JSConfetti from 'js-confetti';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SocialSignInButton from '../auth/SocialSignInButton';

export default function UserAuthForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("sugababe@gmail.com");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [jsConfettiInstance, setJsConfettiInstance] = useState<JSConfetti | null>(null);

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

    const onSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in");
            toast("🎉 Sucessfully signed in");
            triggerConfetti("🎉");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-2 w-full">
                <div>
                    <label>Email</label>
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter your email..."
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label>Password</label>
                    <div>
                        <Input
                            type="password"
                            placeholder="Enter your password..."
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <Button disabled={loading} className="ml-auto w-full" type="submit">
                    Continue With Email
                </Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <SocialSignInButton provider="google" />
                <SocialSignInButton provider="github" />
            </div>
        </>
    );
}
