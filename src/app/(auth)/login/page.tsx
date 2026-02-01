import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Alfafaa account",
};

export default function LoginPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-1.5 sm:space-y-2 px-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Sign in to continue to Alfafaa
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
