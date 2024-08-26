import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json(); // Parse the JSON body correctly
    const response = await axios.post('http://localhost:3001/start', { id }); // Send POST request to Express server

    return NextResponse.json({ message: response.data });
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error);
    return NextResponse.json({ error: 'Failed to connect to WhatsApp' });
  }
}
