import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ParkingStats, ParkingSpot, SpotStatus } from '../types';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_MANAGER = `
You are an expert Parking Management Consultant AI. 
Your goal is to analyze real-time parking data to reduce traffic congestion, optimize revenue, and improve space utilization.
Provide actionable insights based on the provided JSON statistics.
Keep responses concise, professional, and data-driven.
`;

const SYSTEM_INSTRUCTION_DRIVER = `
You are a helpful Smart Parking Assistant for drivers.
Your goal is to help them find a parking spot quickly to save time and fuel.
You have access to the current parking layout.
If a user asks for a spot, suggest specific section/ID based on availability.
Be friendly and brief.
`;

export const getManagerInsights = async (stats: ParkingStats): Promise<string> => {
  try {
    const prompt = `
      Analyze the following parking statistics and suggest improvements for:
      1. Reducing congestion
      2. Dynamic pricing opportunities
      3. Space utilization

      Current Data:
      ${JSON.stringify(stats, null, 2)}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_MANAGER,
        temperature: 0.7,
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error fetching manager insights:", error);
    return "AI Service Unavailable. Please check your API key.";
  }
};

export const getDriverAssistance = async (
  query: string, 
  spots: ParkingSpot[]
): Promise<string> => {
  try {
    // Filter for available spots to give context
    const availableSpots = spots.filter(s => s.status === SpotStatus.AVAILABLE);
    const summary = availableSpots.map(s => `${s.section}-${s.id} (${s.type})`).join(', ');
    
    const prompt = `
      User Query: "${query}"
      
      Context - Currently Available Spots:
      ${summary ? summary : "No spots currently available."}
      
      Total Available: ${availableSpots.length}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_DRIVER,
        temperature: 0.7,
      }
    });

    return response.text || "I'm having trouble connecting to the network right now.";
  } catch (error) {
    console.error("Error fetching driver assistance:", error);
    return "System offline. Please look for the green lights.";
  }
};
