import { z } from "zod";
export const usernameValidation =z
.string()
.min(2,"Username must be at least 2 charcters")
.max(20,"user name must be less than 20 characters")
.regex( /^[a-zA-Z0-9_]+$/ ,"Username must contain only letters and numbers")

export const signUpSccename=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters"})
})