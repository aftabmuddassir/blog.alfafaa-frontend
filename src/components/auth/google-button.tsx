"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

interface GoogleButtonProps {
  label?: string;
}

// Google Icon SVG
function GoogleIcon({ className = "w-4 h-4 sm:w-5 sm:h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleButton({ label = "Continue with Google" }: GoogleButtonProps) {
  const router = useRouter();
  const { googleLogin, isLoading } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      // Note: In production, you would use Google Identity Services
      // to get the ID token, then call googleLogin(idToken)
      // For now, we'll show a placeholder message

      // This is where you'd integrate with Google OAuth:
      // 1. Load Google Identity Services SDK
      // 2. Initialize with your client ID
      // 3. Trigger sign-in flow
      // 4. Get the credential.credential (ID token)
      // 5. Call googleLogin(idToken)

      toast.info("Google OAuth integration requires Google Client ID setup");

      // Example implementation:
      // const response = await google.accounts.id.prompt();
      // const idToken = response.credential;
      // await googleLogin(idToken);
      // router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <GoogleIcon />
      <span className="ml-2">{label}</span>
    </Button>
  );
}
