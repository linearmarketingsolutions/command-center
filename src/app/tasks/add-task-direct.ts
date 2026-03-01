// Direct task addition for Marvin
import { useData } from "@/components/data-context";

export function addMarvinTasks() {
  const { addTask } = useData();
  
  const today = new Date().toISOString().split("T")[0];
  
  // ARIA Tasks
  addTask({
    title: "ARIA: Test with real project (P2P website or ACX)",
    status: "next",
    priority: "high",
    dueDate: today,
    business: "lms",
    description: "Run full ARIA workflow: concept → implementation → delivery"
  });
  
  addTask({
    title: "ARIA: Add GitHub push capability to interface",
    status: "next", 
    priority: "high",
    dueDate: today,
    business: "lms",
    description: "ARIA should be able to create repos and push code"
  });
  
  addTask({
    title: "ARIA: Add Vercel deploy capability",
    status: "next",
    priority: "high", 
    dueDate: today,
    business: "lms",
    description: "ARIA should deploy prototypes directly"
  });
  
  // MUSE Tasks
  addTask({
    title: "MUSE: Build v1.0 core (Gemini + FLUX integration)",
    status: "next",
    priority: "high",
    dueDate: today,
    business: "lms", 
    description: "Image generation, presentation creation, basic design"
  });
  
  addTask({
    title: "MUSE: Add to Command Center Agents list",
    status: "next",
    priority: "high",
    dueDate: today,
    business: "lms",
    description: "Full interface like ARIA has"
  });
  
  addTask({
    title: "MUSE: Give Marvin prompts for prompt library",
    status: "waiting",
    priority: "medium",
    dueDate: today,
    business: "personal",
    description: "Waiting for Blake to provide high-quality prompts",
    waitingNote: "Blake will provide prompts one at a time when ready"
  });
  
  addTask({
    title: "MUSE: Research Ideogram 3 API for text-in-images",
    status: "next",
    priority: "medium",
    dueDate: today,
    business: "lms",
    description: "Find pricing, capabilities, integration method"
  });
  
  addTask({
    title: "MUSE: Research Recraft V3 for vector graphics",
    status: "next",
    priority: "medium",
    dueDate: today,
    business: "lms",
    description: "SVG generation, logo creation capabilities"
  });
  
  console.log("Tasks added to Due Today");
}
