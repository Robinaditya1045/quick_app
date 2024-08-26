import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Image from 'next/image';
import ConnectToWhatsApp from '@/components/cta/ConnectToWhatsapp';

const page = () => {
  return (
    <div className='w-full flex flex-col p-12'>
     <ConnectToWhatsApp />
    </div>
  )
}

export default page