import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import * as fs from 'node:fs';

const openai = new OpenAI();

export async function POST(request: Request) {
  const blob = await request.blob();

  fs.writeFileSync('/tmp/audio.mp3', Buffer.from(await blob.arrayBuffer()));

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream('/tmp/audio.mp3'),
    model: 'whisper-1',
  });

  const answer = transcription.text;

  return NextResponse.json({ answer });
}
