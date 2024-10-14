"use client";
import React from "react";
import SyncLoader from "react-spinners/ClipLoader";

function Button({
  text,
  click = () => {},
  type = "button",
  icon,
  loading,
  outline,
}: {
  text: any;
  click?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  icon?: boolean;
  loading?: boolean;
  outline?: boolean;
}) {
  return (
    <div className="mb-4">
      <button
        onClick={click}
        // className="flex items-center justify-center gap-3 font-medium bg-primary hover:border hover:border-primary hover:bg-white hover:text-primary text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        className={`flex items-center justify-center gap-3 font-medium ${outline ? "border border-[#A2A1A833] text-dark" : "bg-primary  text-white"} py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full`}
        type={type}
        disabled={loading}
      >
        {loading && <SyncLoader color={"#FFFFFF"} />}

        {icon && !loading && (
          <div className="border rounded-full h-5 w-5 flex items-center justify-center p-2">
            <i className="fas fa-plus text-xs"></i>
          </div>
        )}
        {!loading && text}
      </button>
    </div>
  );
}

export default Button;
