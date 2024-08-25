"use client"

import TaskCard from '@/components/cards/TaskCard';
import { useSession } from 'next-auth/react';
import { Skeleton } from "@/components/ui/skeleton"
import OpenTaskDialogButton from "@/components/cta/OpenTaskDialogButton"
import { useEffect, useState } from 'react';

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

      const [tasks, setTasks] = useState([]);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchTasks = async () => {
          try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
              throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
          } catch (err) {
            setError(err.message);
          }
        };
    
        fetchTasks();
      }, []);
    
      if (error) {
        return <div>Error: {error}</div>;
      }

      
  return (
    <div className='w-full min-h-screen px-20'>
      <div className='text-2xl pt-8 flex justify-center items-center'>
       {(username) ? `${greeting}, ${username}`  :<Skeleton className="h-8 w-[400px]" />}
      </div>
      <OpenTaskDialogButton />
      <p className='mt-20 backdrop:w-full text-xl'>Tasks</p>
      <div className='mt-10 grid grid-cols-4 gap-4'>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          completed={task.status === 'Completed'}
        />
      ))}
      </div>
    </div>
  );
};

export default Page;
