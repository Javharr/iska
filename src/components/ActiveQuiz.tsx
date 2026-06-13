/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, LogOut, CheckCircle, AlertCircle, HelpCircle, GraduationCap } from 'lucide-react';
import { Question, QuizSession } from '../types';

interface ActiveQuizProps {
  session: QuizSession;
  questions: Question[];
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
  onExit: () => void;
}

export default function ActiveQuiz({
  session,
  questions,
  onSelectOption,
  onNext,
  onExit
}: ActiveQuizProps) {
  const currentQId = session.questionIds[session.currentIndex];
  // Find current question details
  const question = questions.find(q => q.id === currentQId);

  if (!question) {
    return (
      <div className="text-center p-8 bg-[#0a0a0a] border border-white/10 rounded-none max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-serif font-semibold text-white">Вопрос не найден</h3>
        <p className="text-gray-400 mt-2 text-sm font-light">Произошла ошибка при загрузке текущего дескриптора.</p>
        <button 
          id="exit-error-quiz" 
          onClick={onExit} 
          className="mt-6 px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-mono font-bold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Вернуться
        </button>
      </div>
    );
  }

  const isAnswered = session.answers[question.id] !== undefined;
  const chosenIndex = session.answers[question.id];
  const isCorrect = isAnswered && chosenIndex === question.correctIndex;

  // Calculate live success rate
  const answeredIds = Object.keys(session.answers);
  const totalAnswered = answeredIds.length;
  let correctCount = 0;
  answeredIds.forEach(id => {
    const qDetails = questions.find(q => q.id === id);
    if (qDetails && session.answers[id] === qDetails.correctIndex) {
      correctCount++;
    }
  });
  
  const liveSuccessRate = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100;
  
  // Progress calculations
  const progressPercent = ((session.currentIndex + 1) / session.questionIds.length) * 100;

  return (
    <div id="active-quiz-container" className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Top Header Controls & Info */}
      <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-none p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Прохождение тестирования</div>
            <div id="quiz-block-label" className="text-xs uppercase tracking-wider font-mono text-white mt-0.5">
              {session.blockId === "errors" ? (
                <span className="text-red-400 font-bold">Работа над ошибками</span>
              ) : session.blockId === "general" ? (
                "Общий блок вопросов"
              ) : (
                `Блок ${session.blockId.replace("block_", "")}`
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Active success rate */}
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Точность зачета</span>
            <span id="live-success-percentage" className="text-sm font-mono font-bold text-white mt-0.5">
              {correctCount} / {totalAnswered} ({liveSuccessRate}%)
            </span>
          </div>

          <button
            id="exit-test-btn"
            onClick={onExit}
            className="px-3.5 py-2 border border-white/10 hover:bg-white hover:text-black hover:border-white text-gray-400 transition-all font-mono text-[10px] tracking-widest uppercase cursor-pointer"
            title="Выйти в меню"
          >
            ВЫХОД
          </button>
        </div>
      </div>

      {/* Main Question & Board container */}
      <div id="question-card" className="bg-[#080808] border border-[#1c1c1c] rounded-none p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#777]">
            <span>ВОПРОС {session.currentIndex + 1} ИЗ {session.questionIds.length}</span>
            <span>{Math.round(progressPercent)}% ВЫПОЛНЕНО</span>
          </div>
          
          <div id="progress-track" className="w-full h-[1px] bg-white/10 rounded-none relative">
            <div
              id="progress-indicator"
              className="h-full bg-white absolute left-0 top-0 transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question text */}
        <div className="space-y-4 pt-1">
          {question.category && (
            <span id="question-category-badge" className="inline-block px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
              {question.category}
            </span>
          )}
          <h2 id="question-title-text" className="text-2.5xl sm:text-3xl font-serif leading-relaxed text-white font-medium">
            {question.question}
          </h2>
        </div>

        {/* Options grid */}
        <div id="options-grid" className="grid grid-cols-1 gap-3.5 pt-2">
          {question.options.map((option, idx) => {
            // Options indicators
            let btnStyle = "border-white/10 bg-white/5 hover:border-white hover:bg-white/10 text-gray-200";
            let indicatorStyle = "border-white/20 text-gray-400 group-hover:bg-white group-hover:text-black";

            if (isAnswered) {
              if (idx === question.correctIndex) {
                // Correct one is custom green
                btnStyle = "border-green-500/50 bg-green-500/10 text-white font-serif";
                indicatorStyle = "bg-green-500 border-green-500 text-black font-bold";
              } else if (idx === chosenIndex) {
                // Chosen incorrect one is custom red
                btnStyle = "border-red-500/50 bg-red-500/15 text-white";
                indicatorStyle = "bg-red-500 border-red-500 text-white font-bold";
              } else {
                // Unselected and incorrect during feedback
                btnStyle = "border-white/5 bg-transparent text-gray-600 opacity-40 pointer-events-none";
                indicatorStyle = "border-white/5 text-gray-750 bg-transparent";
              }
            }

            return (
              <button
                id={`option-btn-${idx}`}
                key={idx}
                disabled={isAnswered}
                onClick={() => onSelectOption(idx)}
                className={`group flex items-center p-5 border text-sm sm:text-base transition-all text-left ${btnStyle} ${!isAnswered ? "cursor-pointer" : ""}`}
              >
                <span className={`w-8 h-8 shrink-0 flex items-center justify-center border text-xs font-mono mr-4 transition-all ${indicatorStyle}`}>
                  {String.fromCharCode(1040 + idx)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Explanation & Next controls */}
      {isAnswered && (
        <div
          id="explanation-panel"
          className="bg-[#111] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start shadow-2xl relative"
        >
          {/* Status Indicator circle */}
          <div className="shrink-0 flex items-center justify-center">
            {isCorrect ? (
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                <CheckCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Educational text block */}
          <div className="flex-1 space-y-2.5">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 flex items-center gap-1.5 font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              Разбор клинической анатомии:
            </h4>
            <p id="explanation-text" className="text-gray-350 text-sm leading-relaxed font-light">
              {question.explanation}
            </p>
          </div>

          {/* Proceed control */}
          <div className="w-full md:w-auto shrink-0 self-end pt-4 md:pt-0">
            <button
              id="next-question-btn"
              onClick={onNext}
              className="w-full md:w-auto px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-gray-200 transition-all cursor-pointer"
            >
              {session.currentIndex + 1 === session.questionIds.length ? (
                "Результаты"
              ) : (
                "Дальше"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
