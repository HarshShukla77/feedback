"use client"
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './button'
const Navbar = () => {

    const {data:session} = useSession()
    const user:User = session?.user as User 
     
  return (
   
      <nav className='p-4 md:p-6 shadow-md'>
        <div  className='container mx-auto flex flex-col md:flex-row justify-between items-center'  >
            <a className='text-xl font-bold mb-4 md:mb-0' href="#">Mystry Message</a>
            {session ? (
                <>
               
                <span className='mr-4 ' >Welcome , {user?.username || user?.email}</span>
                 <div  className='flex gap-6' >
                <Button  className='w-full md:w-auto cursor-pointer' onClick={()=>signOut()} >Logout</Button>
               <Link href={'/dashboard'} > <Button  className='w-full md:w-auto cursor-pointer'  >DashBoard</Button>
               </Link>
              </div>
                </>
            ): (
                <>
                 <div className='flex gap-6' >
                 <Link href={'/sign-in'} >
                 <Button className='w-full md:w-auto cursor-pointer  ' >Login  </Button>
                 </Link>

                 <Link href={'/sign-up'} className='w-full md:w-auto cursor-pointer  '  >
                  <Button className='w-full md:w-auto cursor-pointer  ' >Sign in  </Button></Link>
                </div>
                </>
            )}
        </div>
      </nav>
   
  )
}

export default Navbar
