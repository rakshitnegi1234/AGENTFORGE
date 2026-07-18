import { getModel } from "../Config/llmModels.js";

export const codingAgent = async (state) =>
{
  const llm = await getModel("coding");

  const response = await llm.invoke([
    {
      role: "system",
      content: "You are a coding assistant. Give clear, practical code help.",
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);

  return {
    aiResponse: response.content,
  };
}
