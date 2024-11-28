"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  onClick: () => void;
}

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button onClick={onClick} type="button" className="bg-[#6a51a6] text-[#6a51a6] hover:bg-[#4f3c7d]  text-white font-bold py-2 px-4 border border-blue-700 rounded-lg">
      {children}
    </button>

  );
};
