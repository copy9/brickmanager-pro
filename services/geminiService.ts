
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateListing(itemDetails: { name: string; condition: string; category: string }) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie um anúncio de venda persuasivo e profissional para o seguinte item usado:
      Nome: ${itemDetails.name}
      Condição: ${itemDetails.condition}
      Categoria: ${itemDetails.category}
      
      O anúncio deve incluir:
      1. Um título chamativo.
      2. Uma descrição detalhada ressaltando benefícios.
      3. Sugestão de hashtags.
      4. Um tom amigável mas profissional.`,
    });
    return response.text;
  },

  async suggestPrice(itemDetails: { name: string; condition: string; originalPrice?: number }) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aja como um especialista em mercado de usados (Brick). Sugira um valor de venda justo para:
      Item: ${itemDetails.name}
      Estado: ${itemDetails.condition}
      ${itemDetails.originalPrice ? `Preço original estimado: R$ ${itemDetails.originalPrice}` : ''}
      
      Responda em JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER }
          },
          required: ["suggestedPrice", "reasoning", "minPrice", "maxPrice"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }
};
