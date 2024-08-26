import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';

export async function POST(request: NextRequest) {
    let thumbnail = '';
    let description = '';
    try {
        const { body,userId } = await request.json();
        console.log("Received message from WhatsApp client:", { body });

        const bodyParts = body.split(" ");
        if (bodyParts.length < 3) {
            console.error("Invalid message format:", body);
            return NextResponse.json({ error: "Invalid message format" });
        }

        const title = bodyParts.slice(1, -1).join(" ");
        const url = bodyParts[bodyParts.length - 1];

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            try {
                const videoId = getYouTubeVideoId(url);
                if (!videoId) {
                    console.error("Invalid YouTube URL:", url);
                    return NextResponse.json({ error: 'Invalid YouTube URL' });
                }

                // Use only the `snippet` part
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                    params: {
                        part: 'snippet',
                        id: videoId,
                        key: process.env.YOUTUBE_API_KEY,
                    },
                });

                if (response.status !== 200) {
                    console.error('YouTube API error:', response.data);
                    return NextResponse.json({ error: 'Failed to fetch YouTube data' });
                }

                const videoData = response.data.items[0]?.snippet;
                if (!videoData) {
                    console.error('No video data found');
                    return NextResponse.json({ error: 'No video data found' });
                }
                thumbnail = videoData.thumbnails.high.url;
                description = videoData.description;
            } catch (error) {
                console.error('Failed to fetch YouTube data:', error.response?.data || error.message);
                return NextResponse.json({ error: 'Failed to fetch YouTube data' });
            }
        } else {
            console.error('Provided URL is not a YouTube link');
            return NextResponse.json({ error: 'Provided URL is not a YouTube link' });
        }

        console.log("Saving to database:", { title, url, thumbnail, description });

        const newLink = await prisma.link.create({
            data: {
                title,
                url,
                thumbnail,
                description,
                userId
            },
        });

        console.log("Successfully saved to database:", newLink);

        return NextResponse.json(newLink);
    } catch (error) {
        console.error('Error processing WhatsApp message:', error);
        return NextResponse.json({ error: 'Error processing message' });
    }
}

function getYouTubeVideoId(url: string) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
