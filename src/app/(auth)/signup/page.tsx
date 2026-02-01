import { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Alfafaa account",
};

export default function SignupPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-1.5 sm:space-y-2 px-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Join the Alfafaa community today
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
