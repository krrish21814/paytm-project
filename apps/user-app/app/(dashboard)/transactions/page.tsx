import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2pTransfers } from "../../../components/P2pTransfers";
import { OnRampTransaction } from "../../../components/OnRampTransaction";


async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where:{
      userId: Number(session?.user?.id)
    }
  });
  return txns.map(t => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider
  }))
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
    const transfers = await p2pTransfers();
    const transactions = await getOnRampTransactions();

    return <div className="w-screen -mt-60 pt-20">
    <div className="text-4xl text-[#6a51a6] pt-14 mb-8 font-bold">
     Transactions
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">

     <div className="bg-white p-5 rounded-lg shadow-lg mb-40 h-[370px] ">
       <OnRampTransaction transactions={transactions}/>
     </div>

    <div className="bg-white p-5 rounded-lg shadow-lg mb-40 h-[370px]">  
     <P2pTransfers transactions={transfers}></P2pTransfers>
   </div>

 </div>
</div>
}

   
