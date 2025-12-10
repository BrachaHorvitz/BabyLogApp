import { GoogleGenAI } from "@google/genai";
import { Log } from "../types";

const SYSTEM_INSTRUCTION = `
You are a helpful, empathetic, and knowledgeable post-partum and parenting assistant named "BabyLog AI".
Your goal is to help parents interpret their baby's tracking data and answer questions about feeding, diapers, and sleep.
You are gentle, encouraging, and concise (parents are tired).
You have access to the user's recent logs. Use them to provide context-aware answers.
If the user asks about medical advice, give general guidance but always strictly advise them to consult a pediatrician.
`;

export const getGeminiResponse = async (userMessage: string, recentLogs: Log[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return "I'm sorry, I can't connect to the AI service right now (Missing API Key).";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Format logs for context
    const logContext = recentLogs.slice(0, 15).map(l => 
        `- ${new Date(l.created_at).toLocaleString()}: ${l.type} ${l.sub_type || ''} ${l.amount_ml ? `(${l.amount_ml}ml)` : ''} ${l.duration_seconds ? `(${Math.floor(l.duration_seconds / 60)}m)` : ''}`
    ).join('\n');

    const prompt = `
    Here are the last few logs for my baby:
    ${logContext}

    User Question: ${userMessage}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble thinking right now. Please try again.";
  }
};
