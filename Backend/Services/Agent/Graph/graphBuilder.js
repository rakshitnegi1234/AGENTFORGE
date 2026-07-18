import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../Agents/chat.agents.js";
import { codingAgent } from "../Agents/coding.agent.js";
import { searchAgent } from "../Agents/search.agent.js";
import { visionAgent } from "../Agents/vision.agent.js";


const  workflow  = new StateGraph(agentState);

  // NODES

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("vision", visionAgent);

 // EDGES

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges("router", (state) => {
  switch (state.agent) {
    case "chat":
      return "chat";

    case "search":
      return "search";

    case "coding":
      return "coding";

    case "vision":
      return "vision";

    default:
      return "chat";
  }
});
workflow.addEdge("search", "chat");
workflow.addEdge("chat","__end__");
workflow.addEdge("coding","__end__");
workflow.addEdge("vision","__end__");



const graph =  workflow.compile();
export default graph;
