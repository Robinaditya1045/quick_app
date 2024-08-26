"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { default_thumbnail1 } from "../../../public/assets";

interface LinkCardProps {
  id: number;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  onDelete: (id: number) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ id, title, url, thumbnail, description, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the link");
      }

      onDelete(id); // Notify parent component to remove the link from the list
    } catch (error) {
      console.error("Error deleting the link:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{description}</CardDescription> */}
      </CardHeader>
      <CardContent>
      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <Image
              src={thumbnail ? thumbnail : default_thumbnail1}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="mb-4"
            />
          </div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Go to Link
        </a>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LinkCard;
