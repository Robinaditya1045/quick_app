import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { from, to, body, isGroupMsg, type } = await request.json(); // Parse the JSON body
    console.log("Received message from WhatsApp client:", {
      from,
      to,
      body,
      isGroupMsg,
      type,
    });

    return NextResponse.json({ message: "Message received and logged." });
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    return NextResponse.json({ error: 'Error processing message' });
  }
}
