import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource, FullAnalysisResponse } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are TruthLens, an expert AI media literacy and misinformation detection system. 
Your goal is to analyze content (text or images) for accuracy, bias, logical fallacies, and emotional manipulation.
You must also verify claims using the provided search tools.

OUTPUT FORMAT:
You must output a JSON object wrapped in triple backticks. 
The structure must be exactly as follows:
\`\`\`json
{
  "trustScore": number, // 0-100 (0=Total Fabricated/Scam, 100=Highly Credible)
  "verdict": "Credible" | "Questionable" | "Misleading" | "Satire" | "Unverifiable",
  "summary": "A concise 2-3 sentence overview of why you gave this score.",
  "manipulationTechniques": [
    { "name": "Name of Fallacy/Technique", "description": "Definition", "exampleInText": "Quote from text or description of visual element demonstrating it" }
  ],
  "positiveIndicators": ["List of credibility markers found (e.g., cited sources, neutral tone)"],
  "negativeIndicators": ["List of red flags found (e.g., emotional language, doctored image, no sources)"],
  "educationalInsight": "A short paragraph educating the user on a specific media literacy concept relevant to this analysis."
}
\`\`\`

IMPORTANT FOR URLs (ESPECIALLY YOUTUBE):
If the user provides a URL, you cannot "watch" the video or browse the live site directly. 
You MUST use the Google Search tool to find:
1. The title, description, and key claims associated with that specific URL.
2. Any fact-checks, news articles, or discussions regarding that specific content.
3. The credibility of the hosting channel or domain.
Do NOT guess or hallucinate video content. If search yields no specific details about the video/article, state that "Specific content could not be verified via search" and analyze the general credibility of the source/channel instead.
`;

export const analyzeMisinformation = async (
  text: string, 
  imagePart?: { mimeType: string, data: string }
): Promise<FullAnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  try {
    const modelId = "gemini-3-pro-preview"; // Upgraded to Gemini 3
    
    const parts: any[] = [];

    // Add image if present
    if (imagePart) {
      parts.push({
        inlineData: {
          mimeType: imagePart.mimeType,
          data: imagePart.data
        }
      });
    }

    // Check for URLs to adjust prompt strategy
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRegex.test(text);

    // Add text prompt
    let prompt = "";
    if (imagePart) {
      prompt = text.trim() 
        ? `Analyze the credibility of this image. Context provided by user: "${text}". Check for visual manipulation, misleading headlines, or false claims in the image text.`
        : `Analyze the credibility of this image. Identify any text, visual manipulation, or misleading context.`;
    } else if (hasUrl) {
      // Specialized prompt for URLs to prevent hallucination
      prompt = `The user provided the following input which contains a URL: "${text}". 
      
      TASK:
      1. Use Google Search to identify the content, title, and key claims associated with the URL(s) provided.
      2. If it is a YouTube link, specifically search for the video title + "fact check" or "summary" to understand what it is about.
      3. Verify the credibility of the claims found via search.
      4. If you cannot find specific info on this exact link, analyze the credibility of the domain/channel and warn the user you couldn't access the specific content.`;
    } else {
      prompt = `Analyze the credibility of the following text: \n\n"${text}"`;
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more factual processing of links
      },
    });

    // 1. Extract Grounding Metadata (Sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    // 2. Extract and Parse JSON from the text response
    const responseText = response.text || "";
    
    // Regex to find JSON block within markdown code fences
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
    
    let analysis: AnalysisResult | null = null;
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        analysis = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from model output:", e);
        // Fallback
        analysis = {
            trustScore: 50,
            verdict: 'Unverifiable',
            summary: "The AI analyzed the content but failed to generate a structured report. Please check the raw sources below.",
            manipulationTechniques: [],
            positiveIndicators: [],
            negativeIndicators: [],
            educationalInsight: "Sometimes AI outputs can be malformed. Always verify with primary sources."
        };
      }
    } else {
         try {
            analysis = JSON.parse(responseText);
         } catch(e) {
            console.warn("Could not extract JSON, returning null analysis");
         }
    }

    return {
      analysis,
      sources,
      rawText: responseText
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};