"use client"

import { Appbar } from "@repo/ui/appbar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AppbarClient(){
const router = useRouter();
const session = useSession();
    return(
        <div>
            <Appbar onSignin={signIn} onSignout={async()=>{
                await signOut({ redirect: false })
                router.push("/signin")
            }} user={session.data?.user}></Appbar>
        </div>
    );
}