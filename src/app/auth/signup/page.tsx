"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/app/components/Input";
import Button from "@/app/components/Button";
import toast, { Toaster } from "react-hot-toast";
import AuthContainer from "@/app/components/AuthContainer";
import Image from "next/image";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    console.log(response);

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success(data.message);
      router.push(`/auth/enter-otp/?email=${email}`);
      setLoading(false);
    } else if (!data.user.isVerified) {
      toast.success(data.message);
      router.push(`/auth/enter-otp/?email=${email}`);
      setLoading(false);
    } else {
      toast.error(data.error);
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="w-full max-w-md">
        <Toaster />
        <div className="flex items-center mb-8">
          <Image
            src="/images/logo.png"
            alt="GTCO logo"
            className="mr-2"
            width={67}
            height={67}
          />
          <h1 className="text-3xl font-bold text-dark">GTCO</h1>
        </div>
        <h2 className="text-dark text-2xl font-semibold mb-2">
          Welcome
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="text-gray-500 mb-6">
          Enter your details to create your account and get started
        </p>
        <form onSubmit={handleSubmit}>
          <CustomInput
            htmlFor="name"
            label="Name"
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <CustomInput
            htmlFor="email"
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <CustomInput
            htmlFor="password"
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <CustomInput
            htmlFor="confirmpassword"
            label="Confirm Password"
            id="confirm_password"
            type="password"
            placeholder="Confirm your password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button text="Sign up" type="submit" loading={loading} />
          <div className="text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <a
                href="/auth/signin"
                className="text-primary font-bold cursor-pointer"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
