"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Input";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import AuthContainer from "@/app/components/AuthContainer";
import Modal from "@/app/components/Modal";
import { CircularProgress } from "@mui/material";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      handleOpenModal();
    }
    setLoading(false);
  };

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center text-primary">
          <CircularProgress color="inherit" />
        </div>
      }
    >
      <AuthContainer>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="p-8 rounded-lg text-center max-w-sm">
            {/* Success Icon */}
            <div className="text-[100px] mb-4">🎉</div>
            {/* Success Message */}
            <h2 className="text-2xl font-semibold mb-2">
              Password Updated Successfully
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated successfully
            </p>
            {/* Go Home Button */}
            <Link
              href="/auth/signin"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Go to Login
            </Link>
          </div>
        </Modal>
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
          <p className="text-gray-500 mb-6">Enter your new password</p>
          <form onSubmit={handleSubmit}>
            <CustomInput
              htmlFor="password"
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <CustomInput
              htmlFor="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button text="Reset Password" type="submit" loading={loading} />
          </form>
        </div>
      </AuthContainer>
    </Suspense>
  );
}
