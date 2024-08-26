import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { body, userId } = await request.json();
        console.log("Received task creation request:", { body, userId });

        if (!body.startsWith('/task ')) {
            console.error('Invalid task command:', body);
            return NextResponse.json({ error: 'Invalid task command' });
        }

        const taskDetails = body.replace('/task ', '').trim();
        if (!taskDetails) {
            console.error('Task details are missing:', body);
            return NextResponse.json({ error: 'Task details are missing' });
        }

        const title = taskDetails;
        const description = taskDetails; // Customize this if needed

        const newTask = await prisma.tasks.create({
            data: {
                title,
                description,
                userId, // Ensure this is passed correctly
            },
        });

        console.log("Successfully saved task to database:", newTask);
        return NextResponse.json(newTask);

    } catch (error) {
        console.error('Error processing task creation request:', error);
        return NextResponse.json({ error: 'Error creating task' });
    }
}
