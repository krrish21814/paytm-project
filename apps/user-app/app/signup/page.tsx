"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";
import { useSession } from "next-auth/react";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  if(session.data?.user){
    router.push("/dashboard")
  }
  const handleSubmit = async () => {
    setLoading(true);
    setError(""); 

    try {
      signUpSchema.parse({ name, phone, email, password });

      const response = await axios.post("/api/signup", {
        name,
        phone,
        email,
        password,
      });

      if (response.status === 200) {
        router.push("/signin");
      } else {
        setError(response.data?.error || "Something went wrong.");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.error || "Something went wrong.");
      } else if (err.errors) {
        setError(err.errors[0]?.message || "An error occurred during sign-up.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row transform transition-all duration-500 hover:scale-105 hover:shadow-xl">

        <div className="w-full md:w-1/2 bg-gradient-to-r from-[#4f3c7d] to-[#6a51a6] text-white flex items-center justify-center p-6 md:p-10">
          <div className="text-lg md:text-xl font-semibold text-center leading-relaxed">
            "An investment in knowledge pays the best interest." – Benjamin Franklin
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <div className="text-3xl font-bold mb-6 text-gray-800">
            Create an Account
          </div>
          {error &&
           <div className="text-red-600 mb-4">
            {error}
          </div>}

          <div className="space-y-5">
           <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f3c7d] focus:outline-none transition-all duration-300"/>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f3c7d] focus:outline-none transition-all duration-300"/>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f3c7d] focus:outline-none transition-all duration-300"/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4f3c7d] focus:outline-none transition-all duration-300"/>
            </div>

            <div className="text-center mt-4 flex justify-center items-center space-x-2">
              <div>
                Already have an account?
              </div>
              <Link href="/signin">
                <div className="text-[#4f3c7d] font-medium cursor-pointer hover:underline">
                  Login
                </div>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-[#4f3c7d] hover:bg-[#6a51a6] text-white py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
