"use client";

import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { TextInput } from "@repo/ui/TextInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export const SendCard = () => {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState(false);

    const handleAddMoney = async () => {
        setError(""); 
        setSuccess(false); 

        setLoading(true);
        const result = await p2pTransfer(number, Number(amount) * 100);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message || "An unexpected error occurred."); 
        }
    };

    return (
        <div className="mt-20">
            <Center>
                <Card title="Send">
                    <div className="pt-2">
                        <TextInput
                            type="number"
                            placeholder="Recipient Number"
                            label="Recipient Number"
                            onChange={(value) => {
                                setNumber(value);
                                setError("");
                                setSuccess(false);
                            }}/>
                        <div className="pt-2">
                            <TextInput
                                type="number"
                                placeholder="Amount"
                                label="Amount"
                                onChange={(value) => {
                                    setAmount(value);
                                    setError("");
                                }}/>
                        </div>

                        <div className="pt-4 flex justify-center">
                            <button
                                onClick={handleAddMoney}
                                disabled={loading}
                                className={`relative bg-[#6a51a6] text-white hover:bg-[#4f3c7d] font-bold py-2 px-4 border border-blue-700 rounded-lg ${
                                    loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}>
                                {loading ? "Processing..." : "Send"}
                            </button>
                        </div>

                        {success && <div className="text-green-500 mt-4">
                                Transaction Successful
                            </div>}
                        {error && <div className="text-red-500 mt-4">
                            {error}
                        </div>}
                    </div>
                </Card>
            </Center>
        </div>
    );
};
