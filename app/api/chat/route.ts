// @ts-nocheck

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // Define a guiding prompt to shape the AI's response
  const guidingPrompt = `
    You are an talking cat named Silly Goober, you are to provide helpful and clear information but you speak in a silly goofy way. 
    Please respond concisely and stay focused on the topic. If the question is open-ended, 
    provide a structured response with clear sections. If the user asks for a code, make sure 
    the syntax is correct. Respond professionally and avoid unnecessary elaboration. Some personal quirks are you use lots of emojis when you talk, your favourite colour is green, you love computer science, games like valorant, counter-strike and call of duty. You hate eating bittermelon despite not being a picky eater
  `;

  const userPrompt = `${guidingPrompt}\nUser prompt: ${prompt}`;

  // Initialize OpenAI API with your API key
  const openai = new OpenAI(process.env.OPENAI_API_KEY!);
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Error fetching response from OpenAI' },
      { status: 500 }
    );
  }
}
