import { getServerSession } from "next-auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransaction } from "../../../components/OnRampTransaction";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import Link from "next/link";


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
  const session = await getServerSession(authOptions);
  const userInfo = await prisma.user.findFirst({
    where: {
      id: Number(session?.user?.id)
    }
  });
const userName = userInfo?.name || "Unknown"
  
    return <div className="w-screen -mt-60">
             <div className="text-4xl text-[#6a51a6] pt-28 mb-8 font-bold">
              Home
             </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
              <div className="bg-white p-5 rounded-lg shadow-lg mb-40 ">

              <div className="p-4">
              <div className="text-2xl font-bold text-[#6a51a6]">
                Welcome {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </div>
              <div className="text-slate-600 mt-2 font-medium text-lg">
                  Your all-in-one digital wallet for secure and hassle-free transactions.
              </div>
            </div>
          <div>
        

            <div className="mt-6 p-3">
              <div className="flex flex-col space-y-6">
                <div>
                  <div className="mb-2 text-md text-slate-600">
                    Quickly add funds to your Paybit wallet for hassle-free transactions.
                  </div>
                  <Link href="/transfer" passHref>
                    <button className="block w-full bg-[#6a51a6] hover:bg-[#4f3c7d] text-white text-center py-2 px-4 rounded-lg font-bold">
                      Add Money
                    </button>
                  </Link>
                </div>

                
                <div>
                  <div className="mb-2 text-md text-slate-600">
                    Send money to friends and family securely and instantly.
                  </div>
                  <Link href="/p2p" passHref>
                    <button className="block w-full bg-[#4f3c7d] hover:bg-[#6a51a6] text-white text-center py-2 px-4 rounded-lg font-bold">
                      Transfer Funds
                    </button>
                  </Link>
                
                </div>
              </div>
            </div>
          </div>
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