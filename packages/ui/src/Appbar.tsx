import Link from "next/link";
import { Avatar } from "./Avatar";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b-2 px-4">
        <div className="text-2xl text-[#6a51a6] hover:text-[#4f3c7d] font-medium flex flex-col justify-center">
          <Link href="/dashboard">
            Paybit
          </Link>
        </div>
        <div className="flex justify-center py-2">
            
             <div className=" pr-2">
               <Avatar user={user} onSignin={onSignin} onSignout={onSignout}/>
            </div>

        </div>
    </div>
}