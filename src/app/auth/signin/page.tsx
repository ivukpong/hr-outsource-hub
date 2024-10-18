"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Input";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import AuthContainer from "@/app/components/AuthContainer";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message);
      router.push("/dashboard");
    } else {
      toast.error(data.error);
    }
    setLoading(false);
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
          Welcome Back
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="text-gray-500 mb-6">
          Please enter your login details to proceed
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
          <CustomInput
            htmlFor="password"
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-primary" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <Link
              className="inline-block align-baseline font-bold text-sm text-primary hover:text-orange-200"
              href="/auth/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Button text="Login" type="submit" loading={loading} />
          <div className="text-center">
            <p className="text-gray-700">
              D{`on't have an account? `}
              <Link
                href="/auth/signup"
                className="text-primary font-bold cursor-pointer"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
