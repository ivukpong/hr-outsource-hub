"use client";

import AuthContainer from "@/app/components/AuthContainer";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      toast.success(
        "Password reset instructions have been sent to your email."
      );
      router.push(`/auth/verify-account?email=${email}`);
      setLoading(false);
    } else {
      toast.error("Error sending password reset instructions.");
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="w-full max-w-md">
        <Toaster />
        <Link
          href="/auth/signin"
          className="text-gray-500 text-sm mb-4 inline-block"
        >
          <i className="fas fa-chevron-left"></i> Back to Log in
        </Link>
        <h2 className="text-dark text-2xl font-semibold mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-500 mb-6">
          No worries! Enter your email below to recover your password
        </p>
        <form onSubmit={handleSubmit}>
          <CustomInput
            htmlFor="email"
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <Button
            text="Send Reset Instructions"
            type="submit"
            loading={loading}
          />
        </form>
      </div>
    </AuthContainer>
  );
}
