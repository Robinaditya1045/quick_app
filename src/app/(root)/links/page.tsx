"use client";

import LinkCard from '@/components/cards/LinkCard';
import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton";
import OpenLinkDialogButton from '@/components/cta/OpenLinkDialogButton'; 
import { useEffect, useState } from 'react';
import { default_thumbnail1 } from '../../../../public/assets';


const getGreeting = (date: Date) => {
  const hours = date.getHours();
  if (hours < 12) {
    return 'Good morning';
  } else if (hours < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

const Page = () => {
  const now = new Date(); // Get current date and time
  const greeting = getGreeting(now); // Determine the appropriate greeting

  const session = useSession();
  const username = session.data?.user?.name as string

  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/links');
        if (!response.ok) {
          throw new Error('Failed to fetch links');
        }
        const data = await response.json();
        setLinks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLinks();
  }, []);

  const handleDeleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='w-full min-h-screen px-20'>
      <div className='text-2xl pt-8 flex justify-center items-center'>
        {(username) ? `${greeting}, ${username}` : <Skeleton className="h-8 w-[400px]" />}
      </div>
      <OpenLinkDialogButton />
      <p className='mt-20 backdrop:w-full text-xl'>Links</p>
      <div className='mt-10 grid grid-cols-4 gap-4'>
        {links.map(link => (
          <LinkCard
            key={link.id}
            id={link.id}
            title={link.title}
            url={link.url}
            thumbnail={link.thumbnail ? link.thumbnail : default_thumbnail1}
            description={link.description}
            onDelete={handleDeleteLink}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
