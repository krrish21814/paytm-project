"use client"
import { Card } from "@repo/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const P2pTransfers = async ({ transactions }: {
    transactions: {
        time: Date;
        amount: number;
        from: number;
        to: number;
        fromName: string;
        toName: string;
    }[];
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return null;
    if (status === "unauthenticated") {
        router.push("/signin");
        return null;
    }
    if (!session?.user) {
        return;
    }

    const currentUserId = Number((session.user as { id: number }).id);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent Transactions
            </div>
            <button onClick={handleRefresh} className="mt-4 bg-[#6a51a6] hover:bg-[#4f3c7d] text-white font-bold text-white py-2 px-4 rounded">
                Refresh
            </button>
        </Card>
    }

    return <Card title="P2P Transactions">
        <div>
            {transactions.slice(-5).reverse().map(t => {
                return (
                    <div className="flex justify-between p-1" key={`${t.from}-${t.to}-${t.time}`}>
                        <div>
                            <div className="text-sm font-medium">
                                {t.fromName.charAt(0).toUpperCase() + t.fromName.slice(1)} to {" "}
                                {t.toName.charAt(0).toUpperCase() + t.toName.slice(1)}
                            </div>
                            <div className="text-slate-600 text-xs">
                                {t.time.toDateString()}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            {t.from === currentUserId ? (
                                <div className="text-red-500">
                                    - Rs {t.amount / 100}
                                </div>
                            ) : (
                                <div className="text-green-500">
                                    + Rs {t.amount / 100}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            <button onClick={handleRefresh} className="mt-4 bg-[#6a51a6] hover:bg-[#4f3c7d] text-white font-bold text-white py-2 px-4 rounded">
                Refresh
            </button>
        </div>
    </Card>
}
