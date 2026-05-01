import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function suggestTaskPriority(title: string, description: string): Promise<{ priority: 'low' | 'medium' | 'high'; reasoning: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a productivity expert. Analyze the following task and suggest a priority level (low, medium, or high). Return a JSON object with 'priority' and 'reasoning' (max 20 words).
      
      Task Title: ${title}
      Task Description: ${description}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      priority: result.priority || 'medium',
      reasoning: result.reasoning || 'Standard priority suggested.'
    };
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return { priority: 'medium', reasoning: 'Could not fetch AI suggestion.' };
  }
}
