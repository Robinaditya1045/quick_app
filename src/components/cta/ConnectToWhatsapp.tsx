"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

const ConnectToWhatsApp = () => {
  const { data: session } = useSession();
  const [qrCode, setQrCode] = useState("");

  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/connect-whatsapp', { id: session?.user?.id });

      const data = response.data;
      console.log("Response from server:", data);

      if (data.message.qr) {
        setQrCode(data.message.qr);
        console.log("QR Code set in state:", data.message.qr);
      } else {
        setQrCode("");
        console.log("Client is ready, no QR code.");
      }
    } catch (error) {
      console.error("Error connecting to WhatsApp:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[60%]">
      <CardHeader>
        <CardTitle>Connect To WhatsApp</CardTitle>
        <CardDescription>Scan the QR code to connect</CardDescription>
      </CardHeader>
      <CardContent>

        {qrCode ? (
          <div>
            {/* <p>{qrCode}</p> */}
            <img src={qrCode} alt="QR Code" width={300} height={300} />
          </div>
        ) : (
          <p>Hang On ...</p>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button className="bg-emerald-600" onClick={handleConnect} disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Connect To WhatsApp"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectToWhatsApp;
