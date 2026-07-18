import { getModel } from "../Config/llmModels.js"

export const router = async (state) =>
{

   const llm =  await getModel("router");
   
   const prompt = `You are an agent router.

Available agents:
- chat
- search
- coding
- vision

Rules:

chat:
General conversation, explanations, learning, questions.

search:
Current events, latest information, news, recent developments, internet lookup.

coding:
Generate code, debug code, build projects, architecture, API design.

vision:
Generate Image



Return ONLY one word:
chat
search
coding
vision

User Query: ${state.prompt}`;

const response =  await llm.invoke(prompt);


return  {
  agent :response .content.trim().toLowerCase()
}
   
}
