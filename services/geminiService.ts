
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Registration } from "../types";

/**
 * Layanan AI untuk memberikan saran pendakian kelas profesional.
 */
export const getMountaineeringAdvice = async (registration: Registration): Promise<string> => {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Anda adalah koordinator ekspedisi elit dari Jejak Langkah Adventure. 
      Berikan pesan sambutan dan satu tips teknis yang sangat relevan untuk pendakian ke Gunung ${registration.mountain}.
      Pertimbangkan profil layanan ${registration.packageCategory} dan paket ${registration.tripPackage}.
      Gunakan gaya bahasa profesional, inspiratif, dan padat (maksimal 60 kata).`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.8,
      }
    });

    // The GenerateContentResponse features a .text property (not a method).
    return response.text || `Siapkan mental baja Anda. Puncak ${registration.mountain} menanti penakluk sejati.`;
  } catch (error) {
    console.error("Gemini AI Pro Error:", error);
    return `Selamat bergabung di ekspedisi Jejak Langkah Adventure! Kami akan memastikan perjalanan Anda ke ${registration.mountain} menjadi momen tak terlupakan.`;
  }
};
