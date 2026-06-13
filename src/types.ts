/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string; // Optional custom category or source
}

export interface QuizSession {
  id: string;
  blockId: string; // "block_1", "block_2", "block_3", "block_4", "general", or "errors"
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, number>; // questionId -> chosen index
  isCompleted: boolean;
  incorrectQuestionIds: string[]; // Tracks errors during this play for smart retries
}

export interface BlockDefinition {
  id: string;
  title: string;
  description: string;
  startIndex: number; // 0-based index start in the questions array
  endIndex: number; // 0-based index end
  totalQuestions: number;
}
