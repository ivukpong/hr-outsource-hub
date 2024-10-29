"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthContainer from "@/app/components/AuthContainer";
import Modal from "@/app/components/Modal";
import { CircularProgress } from "@mui/material";

function FormFunction() {
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }), // Pass the email used in forgot-password
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      handleOpenModal();
      setLoading(false);
    } else {
      toast.error(data.error);
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
    if (!response.ok) {
      toast.error(data.message);
    }
  };

  const email = searchParams.get("email");
  // Use searchParams as needed
  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-8 rounded-lg text-center max-w-sm">
          <div className="text-[100px] mb-4">🎉</div>
          <h2 className="text-2xl font-semibold mb-2">
            Account Created Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-primary text-white py-2 px-4 rounded-lg w-full font-bold"
          >
            Go to Sign In
          </button>
        </div>
      </Modal>
      <div className="w-full max-w-md">
        <Link
          href="/auth/signin"
          className="text-gray-500  dark:text-white text-sm mb-4 inline-block"
        >
          <i className="fas fa-chevron-left"></i> Back to Sign Up
        </Link>
        <h2 className="text-dark dark:text-white text-2xl font-semibold mb-2">
          Verify Account
        </h2>
      </div>
      <p className="text-gray-500  dark:text-white mb-6">
        Enter your the OTP sent to your email address {email}
      </p>
      <form onSubmit={handleSubmit}>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          containerStyle="w-full flex gap-[23px] mb-10"
          inputStyle="flex justify-center item-center !w-[55px] h-[55px] rounded-[5px] border-[#EBEBEB] border text-dark"
          renderInput={(props) => <input {...props} />}
        />
        <Button text="Verify" type="submit" loading={loading} />
        <div className="text-center">
          <p className="text-gray-700 dark:text-white">
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
  );
}

export default function VerifyOTP() {
  return (
    <AuthContainer>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center text-primary">
            <CircularProgress color="inherit" />
          </div>
        }
      >
        <FormFunction />
      </Suspense>
    </AuthContainer>
  );
}
