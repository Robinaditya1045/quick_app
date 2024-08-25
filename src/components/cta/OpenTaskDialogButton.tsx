"use client"

import { useState } from 'react';
import { Button } from '@components/ui/button';
import TaskDialog from '@components/dialog/CreateTasksDialog';

const OpenTaskDialogButton = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Button onClick={openDialog}>Create Task</Button>
      <TaskDialog isOpen={isDialogOpen} onClose={closeDialog} />
    </>
  );
};

export default OpenTaskDialogButton;
