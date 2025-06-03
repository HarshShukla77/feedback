// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: "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"
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";

//     const response = await openai.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     const stream = OpenAIStream(response);
//     console.log("yeh rha ai",response)
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       // OpenAI API error handling
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     } else {
//       // General error handling
//       console.error('An unexpected error occurred:', error);
//       throw error;
//     }
//   }
// }

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: " Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment" }],
        max_tokens: 400,
        stream: true
      })
    });

    if (!response.body) {
      return new Response("No body in response", { status: 500 });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let chunks: Uint8Array[] = [];
     let allContents: string[] = []
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunkStr = decoder.decode(value);

        const lines = chunkStr.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const dataStr = line.replace(/^data:\s*/, '').trim();

          if (dataStr === '[DONE]') {
            done = true;
            break;
          }
       
          try {
            if (dataStr.startsWith('{') && dataStr.endsWith('}')) {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content;
            
            
            if (content) {
              allContents.push(content)
              console.log("Content:", content);
            }
          }
          } catch (err) {
            console.error("JSON parse error:", err);
          }
        }
      

        chunks.push(value); // Store the chunk for final response
      }
    }
      console.log(allContents)

    // Combine all chunks to return full response
    const fullBody = new Uint8Array(chunks.reduce((acc, curr) => acc + curr.length, 0));
    let position = 0;
    for (const chunk of chunks) {
      fullBody.set(chunk, position);
      position += chunk.length;
    }

    return new Response(fullBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error("Error fetching API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
