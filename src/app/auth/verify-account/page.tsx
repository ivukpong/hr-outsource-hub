"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import Button from "@/app/components/Button";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import AuthContainer from "@/app/components/AuthContainer";

export default function VerifyAccount() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      router.push(`/auth/reset-password?email=${email}`);
      setLoading(false);
    } else {
      toast.error("Invalid OTP");
      setLoading(false);
    }
  };

  const resendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }), // Pass the email used in forgot-password
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.message) {
      toast.success(data.message);
    }
  };

  return (
    <AuthContainer>
      <Toaster />

      <div className="w-full max-w-md">
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
          Enter your the OTP sent to your email address {email}{" "}
        </p>
        <form onSubmit={handleSubmit}>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            containerStyle="w-full flex gap-[23px] mb-10"
            inputStyle="flex justify-center item-center !w-[55px] h-[55px] rounded-[5px] border-[#EBEBEB] border"
            renderInput={(props) => <input {...props} />}
          />
          <Button text="Verify" type="submit" loading={loading} />
          <div className="text-center">
            <p className="text-gray-700">
              {`Didn't get the code? `}
              <span
                onClick={resendOTP}
                className="text-primary font-bold cursor-pointer"
              >
                Resend Code
              </span>
            </p>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
