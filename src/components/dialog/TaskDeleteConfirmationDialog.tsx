"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TaskDeleteConfirmationDialog = ({ isOpen, onClose, onDelete }) => {
  const handleDelete = async () => {
    await onDelete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDeleteConfirmationDialog;
