"use client"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./button"
import { Message } from "@/model/User"
import { toast } from "react-toastify"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { any } from "zod"
import { MdOutlineDelete } from "react-icons/md";
type MessagCardProps ={
    message:Message;
    onMessageDelete:(messageId:string)=>void
}


const MessageCard = ({message,onMessageDelete} :MessagCardProps) => {
    
    const handleDeleteConfirm = async ()=>{
       const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
       if(!response){
        toast.error("Failed to delete message")
       }
       toast.success("Message deleted succesfully")
       onMessageDelete(message._id as any )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog >
                    <AlertDialogTrigger className="mt-5 " asChild>
                    <MdOutlineDelete/> 
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
              
            </CardHeader>


        </Card>
    )
}

export default MessageCard
