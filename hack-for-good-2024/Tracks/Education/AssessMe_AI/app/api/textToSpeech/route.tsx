import OpenAI from 'openai';
const openai = new OpenAI();

export async function POST(request : Request) {
  const body = await request.json();
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: body.text,
  });
  const audioData = await mp3.arrayBuffer();

  return new Response(audioData, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
