"use client";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialSignInButton from "../github-auth-button";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
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
