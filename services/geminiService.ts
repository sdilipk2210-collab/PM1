
import { GoogleGenAI, Type } from "@google/genai";
import { Project, Task, Company } from "../types";

export class GeminiService {
  async getProjectAnalysis(company: Company, projects: Project[], tasks: Task[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = `
      Company: ${company.name}
      Projects: ${JSON.stringify(projects)}
      Tasks: ${JSON.stringify(tasks)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following company data, provide a brief executive summary and 3 key recommendations for growth and risk mitigation: ${context}`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text;
  }

  async generateSOPDraft(title: string, description: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional, structured Standard Operating Procedure (SOP) for "${title}". Description: "${description}". Break it down into Purpose, Scope, and Step-by-Step Instructions. Use clear, bulleted points.`,
      config: {
        temperature: 0.5,
      }
    });

    return response.text;
  }

  async generateTasksForProject(projectName: string, projectDescription: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a senior project manager. Suggest 5 critical tasks for a project named "${projectName}" described as "${projectDescription}". Return only the list of tasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING },
            },
            required: ['title', 'description', 'priority']
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
