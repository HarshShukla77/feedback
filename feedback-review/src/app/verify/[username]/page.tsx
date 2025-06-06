'use client'
import { verifySchema } from '@/schemas/verifySchema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useRouter } from "next/navigation"
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const page = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()


    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.verifyCode
            })

            if (!response) {
                toast.error("Error while verifying code")
                return
            }
            toast.success("Succefully verified code ")
            router.replace('/sign-in')
        } catch (err) {
            console.log("Error in signup of user", err);
            const axiosError = err as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast.error("Error while verifying code")

        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 ' >
            <div className='w-full  max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md' >
                <div className='text-center' >
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6' >Verify Your Account</h1>

                    <p className='mb-4' >  Enter the verification code sent to your email  </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="verifyCode"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Eneter your Verification code " {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='cursor-pointer' type="submit">Submit</Button>
                    </form>
                </Form>
            </div>

        </div>
    )
}

export default page
