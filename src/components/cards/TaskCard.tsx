"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@components/ui/button";
import TaskEditDialog from "@components/dialog/TaskEditDialog";
import TaskDeleteConfirmationDialog from "../dialog/TaskDeleteConfirmationDialog";

interface TaskTypes {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  targetTime: string;
}


const TaskCard = ({ id, title, description, completed }: TaskTypes) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdate = (updatedTask) => {
    // Handle the updated task here, e.g., updating the task list in state
    console.log("Task updated:", updatedTask);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Handle task deletion, e.g., remove task from state
      console.log("Task deleted:", id);
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  };
  

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{completed ? "Completed" : "Pending"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <CardFooter>
          <p>{completed ? "This task is complete." : "This task is still pending."}</p>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
        </CardFooter>
      </Card>

      <TaskEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={{ id, title, description }}
        onUpdate={handleUpdate}
      />

        <TaskDeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
      /> 
    </>
  );
};

export default TaskCard;
