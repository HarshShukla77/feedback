"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MessageSchema } from '@/schemas/messageSchema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useSession } from "next-auth/react"
import { ApiResponse } from '@/types/ApiResponse'

import { useCompletion } from '@ai-sdk/react'
const page = () => {
  
const [messages, setMessages] = useState<string[]>(["What's your favorite movie?","Do you have any pets?","What's your dream job?"])
const [tempMessage, settempMessage] = useState<string>("")
const [noSpacemsg,setNospacemsg] = useState('')


  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: ''
    }
  })
  const specialChar = '||';

  const params = useParams()
  const username = params.username


const handleSuggestMessage=async()=>{
   const response = await axios.post('/api/suggest-messages')
   if(!response){
    toast.error("Error in getting suggesting messages")
   return 
   }
   toast.success("Successfully fetched suggested messages")
   settempMessage(response.data.result)
     const temp = parseStringMessages(tempMessage)
  setMessages(temp)
  console.log("new--" , messages)
   console.log("sugges msg agye",tempMessage)
}


const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        username: username,
        ...data

      })
      form.reset();
      
      if (!response) {
        return 
        toast.error("Error sending Message")
      }
      toast.success("Message sent Successfully")

    } catch (Err) {
          console.log("Internal error",Err)
          toast.error("Backend Error occured")
    }
  }
  return (
    <div className="min-h-screen w-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8 text-center">Public Profile Link</h1>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
        >
          <label htmlFor="message" className="font-semibold">
            Send Anonymous Message to @{username}
          </label>
          <textarea
            {...form.register("content")}
            name="content"
            id="message"
            className="border rounded-md h-28 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your anonymous message here"
          />
          <Button type="submit" className="w-[300px]  mx-auto cursor-pointer py-3">Send Message</Button>
        </form>

        {/* Suggest Messages */}
        <div className="w-full mt-12 flex flex-col items-center">
          <Button onClick={handleSuggestMessage} className="mb-4 cursor-pointer">
          Generate Messages by AI
          </Button>

          <div className="w-full">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Click on any message below to select it:
            </h2>
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => form.setValue('content', msg)}
                  className="w-full cursor-pointer text-left"
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default page
