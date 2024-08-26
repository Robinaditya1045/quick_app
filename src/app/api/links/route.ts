import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth'; // Adjust the path accordingly

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const userId = session.user.id;
  const { title, url } = await request.json();

  let thumbnail = '';
  let description = '';

  // If it's a YouTube link, fetch additional data
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    try {
      const videoId = getYouTubeVideoId(url);
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      const videoData = response.data.items[0].snippet;
      thumbnail = videoData.thumbnails.high.url;
      description = videoData.description;
    } catch (error) {
      console.error('Failed to fetch YouTube data:', error);
    }
  }

  const newLink = await prisma.link.create({
    data: {
      title,
      url,
      thumbnail,
      description,
      userId,  // Use the retrieved userId
    },
  });

  return NextResponse.json(newLink);
}

function getYouTubeVideoId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch links for the authenticated user
    const links = await prisma.link.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}