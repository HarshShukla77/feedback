"use client"

import { Button } from "@/components/ui/button"
import MessageCard from "@/components/ui/MessageCard"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema.ts"
import { ApiResponse } from "@/types/ApiResponse"
import { RefreshCcw } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Router } from "next/router"
import Link from "next/link"


const page = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const [enteredUrl,setEnteredUrl] = useState("")


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
       setValue('acceptMessages',response.data.isAcceptingMessages)
    }catch(err){
        const axiosError = err as AxiosError<ApiResponse>
        toast.error("failed to fetch accept messages")
    }finally{
      setIsLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback( async (refresh:boolean =false)=>{
    setIsLoading(true)
    setIsSwitchLoading(true)
    try{
  const response = await axios.get('/api/get-messages', {
  withCredentials: true,
});
    setMessages(response.data.messages || [])
    console.log("checky",response.data.messages)
      if(refresh){
        toast.success("Showing Messages")
      }
      
  }catch(err){
   
        toast.error("failed to fetch messages ")
  }finally{
      setIsLoading(false) 
       setIsSwitchLoading(false)
     
    }
  },[setIsLoading,setMessages])

useEffect(()=>{

  if(!session || !session.user) return

  fetchMessages()
  fetchAcceptMessage()

},[session, setValue, fetchAcceptMessage, fetchMessages])



const handleSwitchChange  = async()=>{
  try{
   const res =await axios.post<ApiResponse>('/api/accept-messages',{
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


const copyToClipboard= ()=>{
  navigator.clipboard.writeText(profileUrl)
  toast.success("URL Copy to clipboard Successfully")
}


if(!session || !session.user){
  return <div className="mx-auto my-auto font-extrabold"  >Please login</div>

}
const handleButton=()=>{
  setShowModal(true)
}
  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6  bg-white rounded w-full max-w-6xl">
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
          <Button  className="cursor-pointer"  onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch className="cursor-pointer"
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


      <div className="flex justify-between " >
      <Button
        className="mt-4 cursor-pointer "
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

       <Button onClick={handleButton} className=" mt-[20px] cursor-pointer  "  > Send Message to someone  </Button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
                key={message._id as string|| index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>


      {
        showModal && (
        <div  className=" fixed  inset-0   flex items-center justify-center
          mx-auto my-auto backdrop-blur-sm bg-black/30  rounded-[10px] border-2 shadow-md z-50  " >
          <div className=" bg-white p-6 rounded-lg flex flex-col gap-5 w-full max-w-md">
          <h1  className="text-center font-bold"  >Enter Profile Url</h1>

          <input className="border rounded-[10px] p-4 " type="text" name="url" id="url" placeholder="Enter Profile Url  " value={enteredUrl} onChange={(e)=>setEnteredUrl(e.target.value)} />
          <div className="flex gap-4 " >
            <Button className="cursor-pointer" onClick={()=>setShowModal(false)} >Cancel</Button>


            <Button className="cursor-pointer" onClick={()=>{const trimmed = enteredUrl.trim();
            if (!trimmed) return toast.error("Please enter a valid username or URL");
            const user = trimmed.includes("/u/") ? trimmed.split("/u/")[1] : trimmed;
            window.location.href = `/u/${user}`;} }  >Go</Button>
          </div>
          </div>
        </div>



        )
      }
    </div>
  )
}

export default page
