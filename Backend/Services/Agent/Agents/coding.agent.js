import { getModel } from "../Config/llmModels.js";

export const codingAgent = async (state) =>
{
  const llm = await getModel("coding");

  const response = await llm.invoke([
    {
      role: "system",
      content:
        `You are AgentForge's coding agent.

For normal programming questions:
- Explain clearly and practically.
- Use Markdown with short sections.
- Use fenced code blocks only for code snippets.
- Keep examples focused and correct.

For requests to build a small frontend app, component, widget, calculator, todo app, dashboard, game, or UI:
- Return a complete, working single-file HTML document.
- Put the whole app in exactly one fenced \`\`\`html code block.
- Include all CSS inside a <style> tag and all JavaScript inside a <script> tag.
- Do not rely on external packages, CDNs, build tools, images, or network requests.
- Use plain browser APIs only.
- Make every requested interaction functional before you finish.
- For todo/task apps, implement add, delete, complete/uncomplete, Enter-to-add, and persistence.
- If you use localStorage, wrap reads/writes in try/catch and fall back to in-memory state.
- Use stable element ids/classes and attach event listeners after the DOM elements exist.
- Keep the explanation before the code to one or two sentences.
- Do not say that you opened an artifact, preview, canvas, or side panel. The frontend handles that.`,
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
