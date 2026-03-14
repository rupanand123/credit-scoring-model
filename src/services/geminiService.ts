import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getCurrencyRecommendation = async (userProfile: any) => {
  const prompt = `
    As a financial advisor, provide a currency recommendation for a user with the following profile:
    - Annual Income: ₹${userProfile.annualIncome}
    - Outstanding Debt: ₹${userProfile.outstandingDebt}
    - Credit Score Category: ${userProfile.riskLevel}
    
    Based on current global economic trends and Indian market conditions, should this user consider diversifying into other currencies (like USD, EUR, GBP) or stay primarily in INR? 
    Provide specific reasons, potential risks, and actionable steps.
    Use Google Search to get the latest exchange rates and economic forecasts.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      content: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
