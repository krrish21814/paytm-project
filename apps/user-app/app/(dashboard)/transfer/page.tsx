import { getServerSession } from "next-auth";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransaction } from "../../../components/OnRampTransaction";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getBalance(){
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return { amount: 0, locked: 0 };
  }
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id)
    }
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0
  }
}

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

export default async function(){
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();
  
    return <div className="w-screen -mt-60">
             <div className="text-4xl text-[#6a51a6] pt-24 mb-8 font-bold">
              Transfer
             </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
              <div className="bg-white p-5 rounded-lg shadow-lg mb-40 ">
                <AddMoney/>
              </div>
             <div className="bg-white p-5 rounded-lg shadow-lg ">
              <BalanceCard amount={balance.amount} locked={balance.locked}/>
             <div>
              <OnRampTransaction transactions={transactions}/>
             </div>
            </div>
          </div>
    </div>
}