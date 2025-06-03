import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema.ts";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){


    await dbConnect()

        //example  - localhost:300-/api/cuu/username:that1guy?phone=adriod    merko bas username chahiye soi usethaty
    try{
            const {searchParams} = new URL(request.url)
            const queryParam ={
                username:searchParams.get('username')
            }

            //validate with zod

           const result =  UsernameQuerySchema.safeParse(queryParam)
           console.log(result)
           if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success:false,
                    message:"invalid querty parameters"
                },{
                    status:400
                }
            )
           }

           const {username} = result.data

      const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

           if(existingVerifiedUser){
               return Response.json({
                success:false,
                message:'Username is already taken'
               },{
                status:400
               }
            )
           }

             return Response.json({
                success:true,
                message:'Username is unique'
               },{
                status:400
               }
            )

    }catch(err){
        console.log("Error cheaking usernma",err)

        return Response.json({
            success:false,
            message:"errr checking username"
        },
    {
        status:500
    })
    }
}