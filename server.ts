/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();

// Increase JSON limit for large uploaded quiz documents
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Lazy initializer for Google Gen AI
let aiClient: any = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environments variable is missing. AI parsing will fallback to regex parsing.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoint to parse raw anatomy text via Gemini AI
app.post('/api/parse-questions-ai', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      res.status(400).json({ error: "Предоставлен пустой или неверный текст." });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({ 
        error: "Режим AI недоступен: отсутствует ключ API. Мы выполнили разбор регулярными выражениями на клиенте.",
        fallback: true 
      });
      return;
    }

    // Limit chunk to avoid token overflow in a single prompt
    const truncatedText = rawText.slice(0, 45000); 

    const systemInstruction = 
      "Ты — профессиональный медицинский профессор-анатом и эксперт по структурированию данных. " +
      "Твоя задача — распарсить присланный текст с вопросами по анатомии человека и вернуть строго упорядоченный JSON-массив объектов.\n\n" +
      "ВАЖНОЕ ПРАВИЛО ФОРМАТИРОВАНИЯ ВХОДЯЩИХ ДАННЫХ:\n" +
      "Входящий текст устроен так: идет вопрос (например, '1. Какие важные функции...'), а под ним на следующей строке расположен правильный ответ.\n" +
      "В исходном тексте НЕТ готовых вариантов ответа (A/Б/В/Г)! Ты должен сгенерировать их самостоятельно:\n" +
      "1. Если вопрос обычный открытый (например, 'Какие отделы различают...'):\n" +
      "   - Создай для него ровно 4 варианта ответа (один из них — верный, взятый из текста, а другие 3 — правдоподобные анатомические или медицинские дистракторы/альтернативы).\n" +
      "   - Перемешай варианты ответа так, чтобы правильный ответ не всегда стоял на первом месте, и укажи соответствующий correctIndex (0, 1, 2 или 3).\n" +
      "2. Если вопрос является бинарным типа ДА/НЕТ (например, начинается со слов 'Верно ли следующее утверждение', 'Верно ли, что...'):\n" +
      "   - Вариантов ответа должно быть РОВНО 2: ['Да', 'Нет'] в таком порядке.\n" +
      "   - correctIndex должен быть равен 0 (если в тексте ответ 'Да') или 1 (если 'Нет').\n" +
      "3. Пояснения (explanation): к каждому вопросу сгенерируй профессиональное и понятное медицинское пояснение (2-4 предложения) с правильным ответом, объяснением механизма или функции, а также с обязательным упоминанием латинских анатомических терминов (например, 'M. buccinator', 'articulatio humeri', 'hepar' и т.д.).";

    const prompt = `Пожалуйста, распарси следующий фрагмент текста тестов по анатомии в структурированные вопросы с вариантами ответов:\n\n${truncatedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // low temperature for precise parsing but high enough to generate good choices
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Список распознанных вопросов по анатомии с сгенерированными вариантами.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "Развернутый текст вопроса на русском языке."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Список вариантов ответа. Ровно 2 варианта (['Да', 'Нет']) для вопросов ДА/НЕТ (начинающихся с 'Верно ли...'), и ровно 4 анатомических варианта для обычных вопросов."
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "Индекс верного ответа (0-1 для вопросов ДА/НЕТ, или 0-3 для обычных вопросов)."
              },
              explanation: {
                type: Type.STRING,
                description: "Краткое анатомическое обоснование правильного ответа на русском с латинскими терминами."
              }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text.trim());
    res.json({ questions: parsedJson });
  } catch (err: any) {
    console.error("Gemini Parsing Error:", err);
    res.status(500).json({ 
      error: "Не удалось распарсить текст через ИИ: " + (err.message || String(err)),
      fallback: true
    });
  }
});

// App environment routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Anatomy Server] Running on http://localhost:${PORT}`);
  });
}

initServer().catch(err => {
  console.error("Server start failure:", err);
});
