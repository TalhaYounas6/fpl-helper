import { AssemblyAI } from "assemblyai";
import "dotenv/config"

export const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
});