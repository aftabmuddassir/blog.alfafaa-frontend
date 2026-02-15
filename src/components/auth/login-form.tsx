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
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="border-0 shadow-lg sm:shadow-xl">
      <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6 space-y-4">
        {/* Google OAuth Button */}
        <GoogleButton />

        <div className="relative my-4 sm:my-5">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {/* <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div> */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <Button
            type="submit"
            className="w-full h-10 sm:h-11 text-sm sm:text-base mt-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t py-3 sm:py-4 px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
