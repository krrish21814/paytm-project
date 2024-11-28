import { Card } from "@repo/ui/card";

export const OnRampTransaction = ({transactions}:{
    transactions: {
    time: Date,
    amount: number;
    status: string;
    provider: string;
}[]}) => {
    
    if(!transactions.length){
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8" >
                No Recent Transactions
            </div>
        </Card>
    }
    return <Card title="Bank Transactions">
        <div>
            {transactions.slice(-5).reverse().map((t,index) => <div className="flex justify-between" key={index}>
                <div className="p-2">
                    <div className="flex text-sm">
                        Recieved INR 
                        <div className={`pl-40 ${t.status === "Success"
                            ? "text-green-500"
                            : t.status === "Failure"
                            ? "text-red-500"
                            :"text-black -ml-2"
                        }`}>
                            {t.status}
                        </div>
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount/100}
                </div>
            </div>)}
        </div>
    </Card>

}