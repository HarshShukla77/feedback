"use client"

import { Button } from "@/components/ui/button"
import MessageCard from "@/components/ui/MessageCard"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema.ts"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

const page = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)


  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message)=>message._id !== messageId))
  }

  const {data:session} = useSession()

  const form= useForm({
    resolver:zodResolver(AcceptMessageSchema)
  })

  const {register,watch,setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsLoading(true)
    try{
       const response = await axios.get('/api/accept-messages')
       setValue('acceptMessages',response.data.isAcceptingMessage)
    }catch(err){
        const axiosError = err as AxiosError<ApiResponse>
        toast.error("failed to fetch messages")
    }finally{
      setIsLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback( async (refresh:boolean =false)=>{
    setIsLoading(true)
    setIsSwitchLoading(true)
    try{
    const response =  await axios.get<ApiResponse>('/api/get-messages')
    setMessages(response.data.messages || [])
      if(refresh){
        toast.error("error in fetching data")
      }
  }catch(err){
      const axiosError = err as AxiosError<ApiResponse>
        toast.error("failed to fetch messages")
  }finally{
      setIsLoading(false) 
       setIsSwitchLoading(false)
     
    }
  },[setIsLoading,setMessages])

useEffect(()=>{

  if(!session || !session.user) return

  fetchMessages()
  fetchAcceptMessage()

},[session,setValue,fetchMessages])

// handle switch

const handleSwitchChange  = async()=>{
  try{
   const res =await axios.post<ApiResponse>('/api/accept-message',{
      acceptMessages:!acceptMessages
    })
    setValue('acceptMessages',!acceptMessages)
   if(!res){
    toast.error("error in switching")
   }
   toast.success("switched succesfully")
  }catch(e){
    const axiosError = e as AxiosError<ApiResponse>
        toast.error("error in switching")
  }
}
const {username} = session?.user as User 

const baseUrl = `${window.location.protocol}//${window.location.host}`

const profileUrl = `${baseUrl}/u/${username}`


const copyToClipboard= ()=>{
  navigator.clipboard.writeText(profileUrl)
  toast.success("URL Copy to clipboard Successfully")
}


if(!session || !session.user){
  return <div>Please login</div>
}

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {/* {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )} */}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={ index }
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page
