import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { UserCard } from "../../../components/UserCard";
import { UserInfoCard } from "../../../components/UserInfoCard";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return <div>User not logged in.</div>;
    }

    const userInfo = await prisma.user.findFirst({
        where: { id: Number(session.user.id) },
        select: {
            name: true,
            password: true,
            email:true,
            number:true,

        },
    });
    
    if (!userInfo) {
        return <div>User not found.</div>;
    }

    async function updateUserInfo(id: number, update:{name?: string; password?: string}) {
        "use server"; 
        const updateData : {name?: string; password?: string} = {};
        if(update.password){
            const hashedPassword = await bcrypt.hash(update.password, 10);
            updateData.password = hashedPassword;
        }
        if (update.name) {
            updateData.name = update.name;
          }
        await prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    <div>
</div>
     return <div className="w-screen h-screen -mt-20">
                <div className="text-4xl text-[#6a51a6] pt-24 mb-8 font-bold">
                     User
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                     <div className="bg-white p-5 rounded-lg shadow-lg mb-20 ">
                         <UserCard
                            name={userInfo.name || "Unknown"}
                            password={userInfo.password}
                            id={session.user.id}
                            onUpdate={updateUserInfo}/>
                     </div>
                     <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-sm mb-10 ">
                         <UserInfoCard name={userInfo.name || "Unknown"} email={userInfo.email || "Email not found"} number={Number(userInfo.number)}/> 
                      </div>
                 </div>
        </div>
    }
