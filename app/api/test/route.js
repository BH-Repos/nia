import { GoogleGenerativeAI } from '@google/generative-ai';

const genAPI = "AIzaSyAgai5FGKGMrng7eVwXa8AZ6x6OSSE7kpg";

const genAI = new GoogleGenerativeAI(genAPI);

const model = genAI.getGenerativeModel({model: 'gemini-pro'});

async function* streamIterator(stream) {

  for await (const chunk of stream) {
    yield chunk.text();
  }
}

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    }
  });
}


export async function POST(request) {
  console.log("Request Body")
  const req = await request.json();
  console.log(req);

  try {
    const result = await model.generateContentStream(req);
    const stream = iteratorToStream(streamIterator(result.stream));

    console.log("Result");
    console.log(result);
    return new Response(stream, { status: 200 });
  } 

  catch (error) {
    console.log(error);
    return new Response('No response body', { status: 500 });
  }
}


