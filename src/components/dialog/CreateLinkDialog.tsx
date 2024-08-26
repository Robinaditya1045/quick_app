"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (linkData: { title: string; url: string }) => void;
}

const CreateLinkDialog: React.FC<LinkCreateDialogProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) {
        throw new Error("Failed to create link");
      }

      const createdLink = await response.json();
      onCreate(createdLink);
      setTitle("");
      setUrl("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Link Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Link URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLinkDialog;
