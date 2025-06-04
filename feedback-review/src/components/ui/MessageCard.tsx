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
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">X  </Button>
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
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>


        </Card>
    )
}

export default MessageCard
