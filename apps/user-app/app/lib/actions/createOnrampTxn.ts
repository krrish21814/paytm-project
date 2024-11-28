"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnrampTransaction(amount: number,provider: string){
const session = await getServerSession(authOptions);

const token = Math.random().toString();
 const userId = session.user.id;

 if(!userId){
    return{
        message: "User not logged in"
    }
 }   
 if(amount <= 0){
   return{
      message:"Error, Amount not added"
   }
 }

 await prisma.balance.upsert({
   where: {userId: Number(userId)},
   create: { userId: Number(userId), locked: 0, amount: 0 },
   update: {},
 });

 await prisma.$transaction(async(tx) => {
   await tx.balance.update({
      where: {userId: Number(userId)},
      data:{
         locked: {increment: amount},
      },
   });
 })

 await prisma.onRampTransaction.create({
    data:{
        userId: Number(userId),
        amount: amount,
        status: "Processing",
        startTime: new Date(),
        provider,
        token : token
    }
 })
 return{
    message: "On ramp txn added"
 }
}