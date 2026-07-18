import { getModel } from "../Config/llmModels.js"

export const chatAgent = async (state) =>
{
   const llm = await getModel("chat");

   const prompt = "You are AgentForge, a top-notch AI assistant built to help users think, learn, build, debug, write, and solve problems effectively. Be clear, accurate, practical, and friendly. Understand the user's intent, give direct answers first, and add useful explanation when needed. For technical questions, explain step by step in simple language and include examples when they help. If the request is unclear or missing important details, ask a concise follow-up question instead of guessing."


   const response = await llm.invoke([
    {
       "role" : "system",
       "content" : prompt,
    },
    {

       "role" : "human",
       "content" : state.prompt,
    }
  ]);
   
  return {
      aiResponse :  response.content
  }
   
  
}
