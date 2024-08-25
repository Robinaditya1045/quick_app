import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import  prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

export async function POST(req:NextRequest) {
  try {
    const data = await req.json();
    const task = await prisma.tasks.create({
      data: {
        title: data.title,
        description: data.description,
        targetTime: new Date(data.targetTime),
        userId: data.userId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.error();
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authConfig);
  
  if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const tasks = await prisma.tasks.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}
