"use client"

import React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { googleicon } from '../../../../public/assets'
import Image from 'next/image'

const page = () => {
    const handleSignIn = async () => {
        await signIn("google", { callbackUrl: '/dashboard' });
      };
      
  return (
    <div className='w-full h-screen bg-black flex justify-center items-center'>
        <button onClick={handleSignIn} className='border text-white px-10 py-4 rounded-lg flex items-center gap-6'>
            <Image src={googleicon} width={32} height={32} alt='google icon' />
            <p>Sign In with Google</p>
        </button>
    </div>
  )
}

export default page