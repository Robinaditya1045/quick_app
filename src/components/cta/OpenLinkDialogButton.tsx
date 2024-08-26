"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateLinkDialog from "../dialog/CreateLinkDialog";

const OpenLinkDialogButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = (linkData: { title: string; url: string }) => {
    // Handle link creation here, e.g., sending to backend or updating state
    console.log("Link created:", linkData);
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Add New Link</Button>
      <CreateLinkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};

export default OpenLinkDialogButton;
