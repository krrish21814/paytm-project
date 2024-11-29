"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useSession();

  if(session.data?.user){
    router.push("/dashboard")
  }
  const handleSignIn = async () => {
    setError(""); 
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      phone,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#2f1f48] to-[#6a51a6] flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="text-4xl font-semibold text-[#4f3c7d] mb-6 text-center">
          Sign In
        </div>

        <div>
          <div className="mb-6">
            <label className="block text-[#4f3c7d] font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a51a6] transition-all duration-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#4f3c7d] font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a51a6] transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && 
          <div className="text-red-500 mb-4 text-sm">
            {error}
          </div>}

          <button
            onClick={handleSignIn}
            className={`w-full bg-[#4f3c7d] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:bg-[#6a51a6] ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"}`}
            disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <div className="text-[#4f3c7d]">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#6a51a6] font-semibold hover:underline transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
