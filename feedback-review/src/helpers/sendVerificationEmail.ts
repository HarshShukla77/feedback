import {resend } from "../lib/resend";

import VerificationEmail  from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string, username:string, verifyCode:string,):Promise<ApiResponse>{
    try{

      await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: ' Mystry message || Verification Code',
      react: VerificationEmail({username,otp:verifyCode}),
    });
        return {
            success:true,message:'Verification email sent successfully'
}
    }catch(err){
        console.log("Error sending verification email",err);
        return{
            success:false,
            message:"Error sending verification email"
        }
}
}