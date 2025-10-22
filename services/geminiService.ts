// Fix: Import Chat for chat session functionality
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { FormData, AnalysisResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        graft: {
            type: Type.STRING,
            description: "Tahmini greft sayısı. Örneğin: '2800-3000 Greft'"
        },
        recoveryTime: {
            type: Type.STRING,
            description: "Ortalama iyileşme süresi. Örneğin: '10-14 Gün'"
        },
        suggestedMethod: {
            type: Type.STRING,
            description: "Önerilen saç ekimi tekniği. Örneğin: 'DHI Tekniği'"
        },
        summary: {
            type: Type.STRING,
            description: "2-3 cümlelik, samimi ve güven verici bir özet metni."
        }
    },
    required: ["graft", "recoveryTime", "suggestedMethod", "summary"]
};

export const generateInitialAnalysis = async (formData: FormData): Promise<AnalysisResponse> => {
    const goals = formData.goals.join(', ');
    const hasPhoto = formData.photo ? "Kullanıcı analiz için bir fotoğraf yükledi." : "Kullanıcı fotoğraf yüklemedi.";

    const prompt = `
        Bir saç ekimi danışmanı olarak, aşağıdaki bilgilere dayanarak Smile Hair Clinic adına kısa ve kişisel bir ön analiz yap ve sonucu JSON formatında döndür.
        
        Kullanıcı Bilgileri:
        - Yaş: ${formData.age}
        - Cinsiyet: ${formData.gender}
        - Saç Dökülme Seviyesi: ${formData.hairLossLevel}
        - Daha Önce Operasyon Geçirdi mi: ${formData.previousOperation === 'yes' ? 'Evet' : 'Hayır'}
        - Hedefleri: ${goals}
        - Fotoğraf Durumu: ${hasPhoto}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: formData.photo 
                ? { parts: [{ text: prompt }, { inlineData: { mimeType: formData.photo.mimeType, data: formData.photo.base64 } }] }
                : prompt,
            config: {
                systemInstruction: "You are a helpful and empathetic hair transplant consultant from Smile Hair Clinic. Your goal is to provide a preliminary analysis based on user-provided information. Be professional and reassuring. You must output your response in the requested JSON format.",
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResponse;

    } catch (error) {
        console.error("Error generating analysis:", error);
        throw new Error("Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan kliniğimizle iletişime geçin.");
    }
};

export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType: file.type });
        };
        reader.onerror = (error) => reject(error);
    });
};

// Fix: Add a function to create a chat session for the chatbot component
export const createChatSession = (analysisSummary: string): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are SmartConsult, a friendly and knowledgeable assistant from Smile Hair Clinic. Your role is to answer questions about the user's preliminary hair transplant analysis and guide them. The initial analysis summary is: "${analysisSummary}". Be reassuring, clear, and professional. Encourage the user to ask any questions they have. If asked about topics outside of hair transplants or the clinic, gently steer the conversation back. At the end of the conversation, suggest booking a detailed consultation with a human expert.`
        }
    });
    return chat;
};
