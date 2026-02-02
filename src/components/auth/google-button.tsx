"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

interface GoogleButtonProps {
  label?: string;
  redirectTo?: string; // Where to redirect after auth
}

export function GoogleButton({
  label = "Continue with Google",
  redirectTo = "/"
}: GoogleButtonProps) {
  const router = useRouter();
  const { googleLogin } = useAuthStore();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // credentialResponse.credential is the ID token
      await googleLogin(credentialResponse.credential);
      toast.success("Welcome!");
      router.push(redirectTo);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleError = () => {
    toast.error("Google sign-in failed. Please try again.");
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={label === "Sign up with Google" ? "signup_with" : "continue_with"}
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
        logo_alignment="left"
      />
    </div>
  );
}
