import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageid =params.messageid
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

   try{
            const res = await UserModel.updateOne({
                _id:user._id
            },
        {$pull:{messages:{_id:messageid}}})


        if(res.modifiedCount ==0){
              return Response.json({
            success: false,
            message: "Message not found or already deleted"
        },
            {
                status: 404
            })
        }
          return Response.json({
            success: true,
            message: "Message Deleted"
        },
            {
                status: 200
            })
   }catch(Err){
    console.log("error in delting msg route",Err)
        return Response.json({
            success: false,
            message: "error deleting msg"
        },
            {
                status: 500
            })
   }
}