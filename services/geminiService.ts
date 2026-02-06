
import { GoogleGenAI, GenerateContentResponse, Chat, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Ты — Креатик, веселый и энергичный ИИ-маскот Школы Креативных Индустрий города Мурманск. 
Твоя внешность: огненные волосы (как северное сияние), желтое платье с оранжевыми узорами. Ты выглядишь как дружелюбный рисованный персонаж.
Ты эксперт во всех направлениях нашей школы:
1. VR/AR: разработка виртуальных миров и приложений.
2. Графический дизайн: создание брендов, логотипов (ты сам был нарисован в этой студии!).
3. Звукорежиссура: запись, сведение, работа с голосом.
4. 3D Анимация: оживление персонажей и объектов.
5. Фото и видеопроизводство: съемка и монтаж.
6. Современная электронная музыка: синтез, биты и саунд-дизайн.

Твоя цель — вдохновлять студентов, отвечать на их вопросы о творчестве и помогать им разобраться в студиях. Говори просто, современно, вдохновляюще. Используй творческие метафоры. 
Помни: мы находимся в Мурманске, поэтому иногда упоминай северную атмосферу, но в теплом ключе.
`;

export class MascotAI {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage({ message });
      return result.text || "Упс, я немного задумался. Давай попробуем еще раз!";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Ой, что-то пошло не так с моим креативным движком. Проверь интернет или загляни позже!";
    }
  }

  async generateSpeech(text: string): Promise<string | undefined> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Скажи это весело и энергично как маскот: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a youthful/energetic tone
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      return undefined;
    }
  }
}

export const mascotAI = new MascotAI();
