import { useState } from "react"
import { useRouter } from "next/navigation"

interface AvatarProps {
    user?: {
        name?: string | null;
    },
    onSignin: any,
    onSignout: any
}

export const  Avatar = ({
    user,
    onSignin,
    onSignout
}: AvatarProps) => {

    const [info, setInfo] = useState(false);
    const userName = user?.name|| "Unknown"
    const router = useRouter();
    return <div>

             <button onClick={() => {
                if(info){
                setInfo(false)
                return
            }
            setInfo(true)
        }} className="retative flex justify-center items-center text-white font-semibold text-lg w-10 h-10 bg-[#6a51a6] hover:bg-[#4f3c7d] rounded-full">
            {userName?.charAt(0).toUpperCase()}
        </button>

        {info && 
        <div className="absolute -ml-20 mt-2 rounded-lg p-4 w-15 h-15 bg-white shadow-lg">
            <div >
                <div className="font-light pb-2 -mt-2">
                    Hello, User
                </div>
              <button onClick={() => {router.push("/userInfo")}} className="bg-[#927dcc] text-[#6a51a6] hover:bg-[#4f3c7d] mb-2 flex justify-center text-white font-bold py-1 px-7 rounded-2xl" >
                User 
             </button>
            <div >
                 <button onClick={user ? onSignout : onSignin} className="bg-[#927dcc] text-[#6a51a6] hover:bg-[#4f3c7d]  text-white font-bold py-1 px-5 rounded-2xl">
                    {user ? "Logout" : "Login"}
                 </button>
            </div>     
            </div>
        </div>
       }
    </div> 
} 