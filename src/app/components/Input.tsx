"use client";

import React, { useState } from "react";

function CustomInput({
  htmlFor,
  label,
  id,
  type,
  placeholder,
  value,
  onChange = () => {},
  required = false,
  icon,
}: {
  htmlFor?: string;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="flex items-center shadow border rounded w-full py-2 px-3 gap-2 text-dark">
        {icon && <i className="fas fa-search left-3 top-2.5 text-dark"></i>}
        <input
          className=" appearance-none leading-tight focus:outline-none focus:shadow-outline w-full"
          id={id}
          type={show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
          min={0}
        />
        {type === "password" && !show ? (
          <i
            onClick={() => setShow(!show)}
            className="cursor-pointer fas fa-eye text-dark "
          ></i>
        ) : type === "password" && show ? (
          <i
            onClick={() => setShow(!show)}
            className="cursor-pointer fas fa-eye-slash text-dark"
          ></i>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default CustomInput;
