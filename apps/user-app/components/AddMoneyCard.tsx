"use client"
import { Card } from "@repo/ui/card"
import { Select } from "@repo/ui/Select"
import { TextInput } from "@repo/ui/TextInput"
import { useState } from "react"
import { createOnrampTransaction } from "../app/lib/actions/createOnrampTxn"

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl:"https://netbanking.hdfcbank.com"
},{
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com"
}];

export const AddMoney = ()=>{
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl)
    const [amount, setAmount] = useState(0);
    const [provider, setprovider] = useState(SUPPORTED_BANKS[0]?.name || " ")
    const [amountError, setAmountError] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleAddMoney = async () => {
      if (amount <= 0) {
        setAmountError(true);
        return;
      }
      setAmountError(false)
      setLoading(true)
      try {
        await createOnrampTransaction(amount * 100, provider);
        window.location.href = redirectUrl || "";
      } catch (error) {
        console.error("Error occurred during transaction:", error);
      }
      setLoading(false);
    };
    return<div>
          <Card title="Add Money"></Card>
          <div> 
          <TextInput label="Amount" type="number" placeholder="Enter amount" onChange={(value)=>{
            setAmount(value)
            setAmountError(false)
          }}></TextInput>
         </div>
         <Select onSelect={(value)=>{
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
            setprovider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
         }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
         }))}></Select>
       
         <div  className="flex justify-center pt-4 relative">
            <button onClick={handleAddMoney}   className={`relative bg-[#6a51a6] text-white hover:bg-[#4f3c7d] font-bold py-2 px-4 border border-blue-700 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Processing..." : "Add Money"} 
            </button>   
            
         </div>
         <div className="flex" >
          {amountError && (
            <div className="text-red-600 -mt-10 pl-2">
            Invalid Amount
            </div>
          )}
         </div>
        </div>
} 
