"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useSession } from 'next-auth/react';

const TaskDialog = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const targetTimeDate = new Date(targetTime);
      targetTimeDate.setMinutes(0, 0, 0); // Ensure minutes, seconds, and milliseconds are set to 0
  
      const taskData = {
        title,
        description,
        targetTime: targetTimeDate.toISOString(),
        userId: session?.user?.id,
      };
  
      console.log('Task Data:', taskData); // Log the task data to see what’s being sent
  
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      const responseData = await response.text();
      console.log('Response:', responseData);  // Log the response
      
      if (!response.ok) {
        throw new Error(`Failed to create task: ${responseData}`);
      }
  
      onClose(); // Close dialog on success
    } catch (error) {
      console.log('Failed to create task:', error.message);
      alert('Failed to create task. Please try again.');
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-6'>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="datetime-local"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="submit" variant="outline">Create Task</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
