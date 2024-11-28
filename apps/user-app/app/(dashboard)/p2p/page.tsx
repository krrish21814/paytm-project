
import { getServerSession } from "next-auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2pTransfers } from "../../../components/P2pTransfers";


async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return { amount: 0, locked: 0 };
      }
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session.user.id)
        }
    });
    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0
    }
}

async function p2pTransfers() {
    const session = await getServerSession(authOptions);
    const transfers = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId:Number( session.user.id) },
                { toUserId: Number(session.user.id) }
            ]
        }
    });
 
    const transactionsWithNames = await Promise.all(
        transfers.map(async (t) => {
            const fromUser = await prisma.user.findUnique({
                where: { id: t.fromUserId },
                select: { name: true },
            });
            const toUser = await prisma.user.findUnique({
                where: { id: t.toUserId },
                select: { name: true },
            });

            return {
                time: t.timestamp,
                amount: t.amount,
                from: t.fromUserId,
                to: t.toUserId,
                fromName: fromUser?.name || "Unknown Sender",
                toName: toUser?.name || "Unknown Receiver",
            };
        })
    );
    return transactionsWithNames;
}

export default async function(){
    const balance = await getBalance();
    const transfers = await p2pTransfers();
    
    return <div className="w-screen -mt-60 pt-20">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
     P2P Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
     <div className="bg-white p-5 rounded-lg shadow-lg mb-40 ">
       <SendCard />
     </div>
    <div className="bg-white p-5 rounded-lg shadow-lg ">
     <BalanceCard amount={balance.amount} locked={balance.locked}></BalanceCard>
    <div>
     <P2pTransfers transactions={transfers}></P2pTransfers>
    </div>
   </div>
 </div>
</div>
}

   
