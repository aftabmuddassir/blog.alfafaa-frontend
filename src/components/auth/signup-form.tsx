"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "./google-button";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.firstName || undefined,
        last_name: data.lastName || undefined,
      });
      toast.success("Account created successfully!");
      router.push("/onboarding");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="border-0 shadow-lg sm:shadow-xl">
      <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6 space-y-4">
        {/* Google OAuth Button */}
        <GoogleButton label="Sign up with Google" redirectTo="/onboarding" />

        <div className="relative my-4 sm:my-5">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          {/* Name fields - Stack on mobile, side by side on larger */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="firstName" className="text-sm sm:text-base">
                First name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                autoComplete="given-name"
                {...register("firstName")}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="lastName" className="text-sm sm:text-base">
                Last name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                {...register("lastName")}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="username" className="text-sm sm:text-base">
              Username
            </Label>
            <Input
              id="username"
              placeholder="johndoe"
              autoComplete="username"
              {...register("username")}
              className={`h-10 sm:h-11 text-sm sm:text-base ${
                errors.username ? "border-destructive" : ""
              }`}
            />
            {errors.username && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              {...register("email")}
              className={`h-10 sm:h-11 text-sm sm:text-base ${
                errors.email ? "border-destructive" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                {...register("password")}
                className={`h-10 sm:h-11 text-sm sm:text-base pr-16 ${
                  errors.password ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`h-10 sm:h-11 text-sm sm:text-base ${
                errors.confirmPassword ? "border-destructive" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-11 text-sm sm:text-base mt-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-[10px] sm:text-xs text-center text-muted-foreground leading-relaxed">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardContent>

      <CardFooter className="flex justify-center border-t py-3 sm:py-4 px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
