"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export const UserInfoCard = ({ name, email, number }: { name: string, email: string, number: number }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") return null
  if (status === "unauthenticated") {
      router.push("/signin")
      return null
  }

    return (
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#6a51a6] flex items-center justify-center text-white text-xl font-semibold">
            <div>
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#6a51a6]">
              {name.charAt(0).toUpperCase()+name.slice(1)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>

          <div>
            Email: {email}
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
         </svg>
          <div>
            Phone Number: {number}
          </div>
        </div>
      </div>
    );
  }
  