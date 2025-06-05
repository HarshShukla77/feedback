'use client'
import { signUpSchema } from "@/schemas/signUpSchema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import Spin from "@/app/spinner/Spin"

const page = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheakingUsername, setIsCheckingUsermame] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter();
    //  zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsermame(true)


                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username} `)
                    console.log("axios check krna ", response.data.message)

                    setUsernameMessage(response.data.message)

                }
                catch (err) {

                    const axiosError = err as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                    console.log(err)
                } finally {
                    setIsCheckingUsermame(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])



    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            const res = response.data.success
            if (!res) {
                toast.error("Failed to create user")
            }
            toast.success("Successfully created User")
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (err) {
            console.log("Error in signup of user", err);
            const axiosError = err as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast.error("SignUp fail")
            setIsSubmitting(false)

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 "  >
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md "  >
                <div className="text-center" >
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
                        Join Mystery Message
                    </h1>
                    <p className="mb-4" > Sign up to start your anonymous adventure  </p>
                </div>

                <Form {...form} >

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >

                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="write your username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}

                                        />

                                    </FormControl>
                                    {isCheakingUsername && <Spin></Spin>}

                                    <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}  >
                                        test {usernameMessage}
                                    </p>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="write your email" {...field}


                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your Password" {...field}


                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}  >{
                            isSubmitting ?
                                <>
                                    <Spin></Spin>
                                </>


                                : ('Sign up')
                        }</Button>
                    </form>
                </Form>
                <div className="text-center mt-4" >
                    <p>
                        Already a member ?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800"  >
                            Sign in</Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default page
