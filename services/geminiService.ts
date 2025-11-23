import { GoogleGenAI } from "@google/genai";
import { User, Task } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateEmployeeReport = async (user: User, tasks: Task[]) => {
  const ai = getAiClient();
  if (!ai) return "AI features unavailable. Please check configuration.";

  const completedTasks = tasks.filter(t => t.status === 'DONE' || t.status === 'REVIEW').length;
  
  const prompt = `
    Analyze the following employee profile for a neurodiverse workforce platform.
    Employee: ${user.name}
    Role: ${user.role}
    Sensory Profile: Triggers - ${user.sensoryProfile.triggers.join(', ')}. Accommodations - ${user.sensoryProfile.accommodations.join(', ')}.
    Strengths: ${user.strengths.join(', ')}.
    Recent Activity: Completed ${completedTasks} tasks. Current Level: ${user.level}.

    Please generate a structured analysis in JSON format with the following keys:
    - swot: object with arrays for strengths, weaknesses, opportunities, threats.
    - burnoutRisk: string (Low/Medium/High) with a short reasoning.
    - recommendation: A specific, actionable recommendation for the manager to support this employee.
    
    The tone should be professional, supportive, and focused on neuro-inclusion.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating report:", error);
    return JSON.stringify({
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      burnoutRisk: "Unknown",
      recommendation: "Unable to generate analysis at this time."
    });
  }
};

export const getMicroGoals = async (user: User) => {
    const ai = getAiClient();
    if (!ai) return [];
  
    const prompt = `
      Based on the employee ${user.name}, who is a Level ${user.level} ${user.role}, suggest 3 concrete, literal micro-goals to help them progress.
      The user has these strengths: ${user.strengths.join(', ')}.
      Output as a JSON array of strings. Keep them short and actionable (e.g., "Sort 50 items correctly").
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error(error);
      return ["Complete 1 task today", "Take a scheduled break", "Update checklist"];
    }
  };