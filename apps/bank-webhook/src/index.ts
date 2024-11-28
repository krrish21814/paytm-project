import express from 'express';
import db from "@repo/db/client";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json())

app.post("/hdfcWebhook", async (req,res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
  
    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                  locked: {decrement: Number(paymentInformation.amount)},
                  amount: {increment: Number(paymentInformation.amount)}
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);