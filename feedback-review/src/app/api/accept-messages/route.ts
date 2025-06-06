import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user = session?.user

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "not Authenticated"
        },
            {
                status: 401
            })
    }

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptMessages }, { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status pt accept messages"
            },
                {
                    status: 500
                })
        }

        return Response.json({
            success: true,
            message: "message acceptancer statis updated"
        },
            {
                status: 200
            })
    } catch (err) {
        console.log("failed ot update uer status to accept messages")
        return Response.json({
            success: false,
            message: "failed ot update uer status to accept messages"
        },
            {
                status: 500
            })

    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user = session?.user

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "not Authenticated"
        },
            {
                status: 401
            })
    }
     const userId = user._id 

     try{
             const foundUser =  await UserModel.findById(userId)

     if (!foundUser) {
            return Response.json({
                success: false,
                message: "failed to found the user"
            },
                {
                    status:404
                })
        }
            return Response.json({
                success: true,
                isAcceptingMessages:foundUser.isAcceptingMessages
            },
                {
                    status:200
                })
     }catch(err)
     {
         console.log("error in getting message acceptance")
        return Response.json({
            success: false,
            message: "error in getting message acceptance"
        },
            {
                status: 500
            })
    
     }

        }