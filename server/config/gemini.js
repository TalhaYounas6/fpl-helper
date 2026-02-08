import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import "dotenv/config";

 const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 export const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { temperature: 0.1 },
  safetySettings: [
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_ONLY_HIGH"
    }
  ] 
});