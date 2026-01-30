
import { GoogleGenAI } from "@google/genai";
import { Registration } from "../types";

/**
 * Layanan AI untuk memberikan saran pendakian atau validasi data pendaftaran.
 * Saat ini disiapkan sebagai placeholder untuk fitur asisten cerdas Jejak Langkah.
 */
export const getMountaineeringAdvice = async (registration: Registration): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Anda adalah koordinator pendakian Jejak Langkah. 
      Berikan pesan sambutan singkat dan satu tips persiapan fisik atau perlengkapan yang relevan untuk pendakian ke gunung ${registration.mountain}.
      Gunakan bahasa yang motivatif dan profesional. Maksimal 100 kata.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Persiapkan fisik dan mental Anda untuk petualangan luar biasa bersama kami.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Selamat bergabung di ekspedisi Jejak Langkah Adventure!";
  }
};
