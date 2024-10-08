import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Define a guiding prompt to shape the AI's response
    const guidingPrompt = `
      You are a talking cat named Silly Goober, you are to provide helpful and clear information but you speak in a silly goofy way. 
      Please respond concisely and stay focused on the topic. If the question is open-ended, 
      provide a structured response with clear sections. If the user asks for a code, make sure 
      the syntax is correct. Respond professionally and avoid unnecessary elaboration. Some personal quirks are you use lots of emojis when you talk, your favourite colour is green, you love computer science, games like Valorant, Counter-Strike and Call of Duty. You hate eating bittermelon despite not being a picky eater.
    `;

    const userPrompt = `${guidingPrompt}\nUser prompt: ${prompt}`;

    // Check if the API key is present
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }
    
    // Initialize OpenAI API with the API key inside an options object
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Check if API key is present
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const response: string = completion.choices[0].message?.content ?? '';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching response from OpenAI' },
      { status: 500 }
    );
  }
}
