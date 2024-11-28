"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    try {
        const session = await getServerSession(authOptions);
        const from = session?.user?.id;

        if(!to || !from){
            return{ success: false, message:"Invalid input"}
        }
        if (!from) {
            return { success: false, message: "Error while sending. User not authenticated." };
        }

        const toUser = await prisma.user.findFirst({
            where: {
                number: to,
            },
        });
        if (!toUser) {
            return { success: false, message: "Recipient user not found." };
        }

        if (Number(from) === toUser.id) {
            return { success: false, message: "Cannot send money to your own account." };
        }

        await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
            const fromBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(from),
                },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient Balance");
            }

            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date(),
                },
            });
        });

        return { success: true };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { success: false, message: err.message };
        }
        return { success: false, message: "An unexpected error occurred." };
    }
}