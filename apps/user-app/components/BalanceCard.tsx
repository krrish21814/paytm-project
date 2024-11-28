"use client"
import { Card } from "@repo/ui/card"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const BalanceCard = ({amount,locked}:{
    amount: number;
    locked: number;
}) => {

    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === "loading") return null
    if (status === "unauthenticated") {
        router.push("/signin") 
        return null
    }

    return <Card title="Balance">
        <div className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Unlocked Balance
            </div>
            <div>
                {amount/100} INR
            </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Total Locked Balance
            </div>
            <div>
                {locked/100} INR
            </div>
        </div>
        <div  className="flex justify-between border-b border-slate-300 pb-2">
            <div>
                Total Balance
            </div>
            <div>
                {(locked + amount) / 100} INR
            </div>
        </div>
    </Card>

}