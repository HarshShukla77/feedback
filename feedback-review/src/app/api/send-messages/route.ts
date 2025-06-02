import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()

    const {username,content} = await request.json()

    try{
       const user = await UserModel.findOne({username})
       if(!user){
         return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status:404
                })
       }

    //    is User acceprting the messages

    if(!user.isAcceptingMessage){
             return Response.json({
                success: false,
                message: "user is not accepting the messages"
            },
                {
                    status:403
                })
    }

    const newMessage = {content,createdAt:new Date()}
     user.messages.push(newMessage as Message)

     await user.save()

     return Response.json({
                success: true,
                message: "message send succesfully"
            },
                {
                    status:401
                })


    }catch(err){
            console.log("error adding messages" , err)
             return Response.json({
                success: false,
                message: "internal server err"
            },
                {
                    status:500
                })
    }
}