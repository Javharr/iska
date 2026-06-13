/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, BlockDefinition } from './types';
import questionsData from '../anatomy_questions.json';

// Export all questions loaded from the project's JSON file
export const DEFAULT_QUESTIONS: Question[] = questionsData as Question[];

/**
 * Parses user-uploaded file content (TXT/PDF copy-paste formats)
 * This handles BOTH standard options formats and the PDF format ("Question" followed by "Answer statement" / Yes-No)
 */
export function parseUploadedText(rawText: string): Question[] {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const parsedQuestions: Question[] = [];
  
  // Let's determine first which parser strategy is better: 
  // Strategy A: Multiple-choice blocks (Traditional parser)
  // Strategy B: Question & Answer pairs (PDF structure)
  
  let optionCount = 0;
  for (const line of lines) {
    if (/^[A-DА-Г]\)[\s]/i.test(line) || /^[A-DА-Г]\.[\s]/i.test(line) || /^[1-4]\)[\s]/.test(line)) {
      optionCount++;
    }
  }

  // If there are very few option lines relative to the total, but we have numbered questions, we use Strategy B
  if (optionCount < 5) {
    // Strategy B: PDF line parser (Question -> Answer statement)
    let currentQ: string = "";
    let currentA: string = "";
    let lastId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match a line starting with number (e.g. "1. Какие важные...")
      const qMatch = line.match(/^(\d+)[\.\)\:\s]+(.*)$/);
      if (qMatch) {
        if (currentQ) {
          packageStrategyBQuestion(currentQ, currentA, parsedQuestions, lastId++);
        }
        currentQ = qMatch[2] ? qMatch[2].trim() : line;
        currentA = "";
      } else {
        if (currentQ) {
          currentA += (currentA ? " " : "") + line;
        }
      }
    }
    // Package last question
    if (currentQ) {
      packageStrategyBQuestion(currentQ, currentA, parsedQuestions, lastId++);
    }

    if (parsedQuestions.length > 0) {
      return parsedQuestions;
    }
  }

  // Strategy A: Traditional Options Parsing Heustics
  let currentQuestion: Partial<Question> = {};
  let currentOptions: string[] = [];
  let tempExplanation = "";
  
  const questionNumRegex = /^(?:Вопрос\s+)?(\d+)[\.\)\:\s]+(.*)$/i; 
  const optionRegex = /^[A-DА-ГA-D]\)[\s]*(.*)$/i; 
  const optionLetterWithDot = /^[A-DА-Г]\.[\s]*(.*)$/i; 
  const optionNumWithParen = /^\d+\)[\s]*(.*)$/; 
  const optionNumWithDot = /^\d+\.[\s]*(.*)$/; 
  const answerRegex = /^(?:Правильный\s+)?(?:ответ|Ответ)[\s]*[\:\-]?[\s]*([A-DА-Г1-4а-гa-d])[\s]*$/i;
  const explanationRegex = /^(?:Пояснение|Комментарий|Обоснование)[\s]*[\:\-]?[\s]*(.*)$/i;

  const pushCurrentQuestion = () => {
    if (currentQuestion.question) {
      const isYesNo = currentQuestion.question.toLowerCase().includes("верно ли");
      let finalOptions = [...currentOptions];
      let correctIndex = currentQuestion.correctIndex ?? 0;
      
      if (isYesNo) {
        finalOptions = ["Да", "Нет"];
        if (typeof currentQuestion.correctIndex === "undefined") {
          correctIndex = tempExplanation.toLowerCase().startsWith("нет") ? 1 : 0;
        }
      } else if (finalOptions.length < 2) {
        finalOptions = [
          finalOptions[0] || "Правильный анатомический вариант",
          "Альтернативное медицинское описание",
          "Клиника не задействована в данном процессе",
          "Неверно по анатомическим ориентирам"
        ];
      }

      parsedQuestions.push({
        id: `imported-${Date.now()}-${parsedQuestions.length}`,
        question: currentQuestion.question,
        options: finalOptions,
        correctIndex,
        explanation: tempExplanation || "Пояснение для этого вопроса добавлено автоматически.",
        category: isYesNo ? "ДА / НЕТ" : "Импортированные"
      });
    }
    currentQuestion = {};
    currentOptions = [];
    tempExplanation = "";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const qMatch = line.match(questionNumRegex);
    if (qMatch) {
      pushCurrentQuestion();
      currentQuestion.question = qMatch[2] ? qMatch[2].trim() : line;
      continue;
    }

    const optMatch = line.match(optionRegex) || line.match(optionLetterWithDot) || line.match(optionNumWithParen) || line.match(optionNumWithDot);
    if (optMatch && currentQuestion.question) {
      currentOptions.push(optMatch[1].trim());
      continue;
    }

    const ansMatch = line.match(answerRegex);
    if (ansMatch && currentQuestion.question) {
      const matchVal = ansMatch[1].toUpperCase();
      let index = 0;
      if (matchVal === 'А' || matchVal === 'A' || matchVal === '1') index = 0;
      else if (matchVal === 'Б' || matchVal === 'B' || matchVal === '2') index = 1;
      else if (matchVal === 'В' || matchVal === 'C' || matchVal === '3') index = 2;
      else if (matchVal === 'Г' || matchVal === 'D' || matchVal === '4') index = 3;
      currentQuestion.correctIndex = index;
      continue;
    }

    const expMatch = line.match(explanationRegex);
    if (expMatch) {
      tempExplanation = expMatch[1].trim();
      continue;
    }

    if (currentQuestion.question) {
      if (tempExplanation) {
        tempExplanation += " " + line;
      } else if (currentOptions.length > 0 && !line.includes('?')) {
        currentOptions[currentOptions.length - 1] += " " + line;
      } else {
        currentQuestion.question += " " + line;
      }
    }
  }

  pushCurrentQuestion();
  return parsedQuestions;
}

/**
 * Helper to package parsed Question / Answer from Strategy B (raw text from medical records / PDF text)
 */
function packageStrategyBQuestion(qText: string, aText: string, parsedQuestions: Question[], idx: number) {
  const normalizedQ = qText.trim();
  const normalizedA = aText.trim();

  const isYesNo = normalizedQ.toLowerCase().includes("верно ли");
  let options: string[] = [];
  let correctIndex = 0;
  let explanation = normalizedA || "Пояснение составлено при разборе медицинского файла.";

  if (isYesNo) {
    options = ["Да", "Нет"];
    const firstWord = normalizedA.toLowerCase().split(/[,\.\s]/)[0];
    if (firstWord.startsWith("нет")) {
      correctIndex = 1;
    } else {
      correctIndex = 0;
    }
  } else {
    options = [
      normalizedA || "Вариант ответа А (соответствует тексту)",
      "Анатомически неверный ответ (дистрактор)",
      "Орган расположен в другом отделе тела",
      "Альтернативное клиническое суждение"
    ];
    correctIndex = Math.floor(Math.random() * 4);
    const temp = options[0];
    options[0] = options[correctIndex];
    options[correctIndex] = temp;
  }

  parsedQuestions.push({
    id: `strategy-b-${Date.now()}-${idx}`,
    question: normalizedQ,
    options,
    correctIndex,
    explanation,
    category: isYesNo ? "ДА / НЕТ" : "Обычные тесты"
  });
}

/**
 * Splits questions array into block definitions (chunks based on categories or safety fallbacks)
 */
export function partitionQuestions(questions: Question[], preferredBlockSize: number = 300): BlockDefinition[] {
  const total = questions.length;
  
  if (total === 0) {
    return [
      { id: "block_1", title: "Раздел 1", description: "Вопросы с 1 по 0", startIndex: 0, endIndex: 0, totalQuestions: 0 }
    ];
  }

  // Find all unique categories in order of appearance
  const categoriesInOrder: string[] = [];
  questions.forEach((q) => {
    const cat = q.category || "Без темы";
    if (!categoriesInOrder.includes(cat)) {
      categoriesInOrder.push(cat);
    }
  });

  if (categoriesInOrder.length > 1) {
    const blocks: BlockDefinition[] = [];
    let counter = 1;

    categoriesInOrder.forEach((cat) => {
      const indices = questions
        .map((q, idx) => (q.category || "Без темы") === cat ? idx : -1)
        .filter((idx) => idx !== -1);

      if (indices.length > 0) {
        const startIndex = indices[0];
        const endIndex = indices[indices.length - 1];
        blocks.push({
          id: `block_${counter}`,
          title: cat,
          description: `Раздел содержит ${indices.length} вопросов`,
          startIndex: startIndex,
          endIndex: endIndex,
          totalQuestions: indices.length
        });
        counter++;
      }
    });

    return blocks;
  }

  // General formula for partitions of N questions (fallback if only 1 topic exists)
  const blocks: BlockDefinition[] = [];
  const size = preferredBlockSize;
  
  let tempStart = 0;
  let counter = 1;
  while (tempStart < total) {
    const tempEnd = Math.min(total - 1, tempStart + size - 1);
    const count = (tempEnd - tempStart) + 1;
    blocks.push({
      id: `block_${counter}`,
      title: `Блок тестов ${counter}`,
      description: `Вопросы с ${tempStart + 1} по ${tempEnd + 1} (Всего: ${count})`,
      startIndex: tempStart,
      endIndex: tempEnd,
      totalQuestions: count
    });
    tempStart += size;
    counter++;
  }

  return blocks;
}
