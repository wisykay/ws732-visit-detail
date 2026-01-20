
import { GoogleGenAI } from "@google/genai";
import { VisitData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateVisitSummary(visit: VisitData): Promise<string> {
  const prompt = `
    Analyze this store visit report and provide a professional, concise executive summary (3-4 sentences).
    Visit Details:
    - Customer: ${visit.customer}
    - Overall Score: ${visit.score}/100
    - Survey: ${visit.surveys[0].title}
    - Metrics: Valid: ${visit.surveys[0].validCount}, Invalid: ${visit.surveys[0].invalidCount}
    - Issues Found: ${visit.surveys[0].metrics.map(m => `${m.label}: ${m.value}`).join(', ')}
    
    The summary should focus on compliance and key improvement areas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate summary at this time.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Error generating AI insights. Please check your connectivity and try again.";
  }
}
