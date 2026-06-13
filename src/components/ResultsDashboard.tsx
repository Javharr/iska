/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, RotateCcw, Award, CheckCircle, XCircle, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';
import { Question, QuizSession, BlockDefinition } from '../types';

interface ResultsDashboardProps {
  session: QuizSession;
  questions: Question[];
  blocks: BlockDefinition[];
  onRetryBlock: () => void;
  onRetryErrors: () => void;
  onBackToMenu: () => void;
}

export default function ResultsDashboard({
  session,
  questions,
  blocks,
  onRetryBlock,
  onRetryErrors,
  onBackToMenu
}: ResultsDashboardProps) {
  
  // Aggregate stats
  const total = session.questionIds.length;
  let correctCount = 0;
  const incorrectQuestions: Question[] = [];

  session.questionIds.forEach(id => {
    const q = questions.find(item => item.id === id);
    if (q) {
      if (session.answers[id] === q.correctIndex) {
        correctCount++;
      } else {
        incorrectQuestions.push(q);
      }
    }
  });

  const accuracyPercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Group stats by anatomical block
  const blockPerformance = blocks.map(block => {
    const blockQuestions = questions.slice(block.startIndex, block.endIndex + 1);
    const blockQIds = blockQuestions.map(q => q.id);
    
    const activeBlockQIds = session.questionIds.filter(id => blockQIds.includes(id));
    
    let blockTotal = activeBlockQIds.length;
    let blockCorrect = 0;
    
    activeBlockQIds.forEach(id => {
      const q = questions.find(item => item.id === id);
      if (q && session.answers[id] === q.correctIndex) {
        blockCorrect++;
      }
    });

    const rate = blockTotal > 0 ? Math.round((blockCorrect / blockTotal) * 100) : null;

    return {
      ...block,
      played: blockTotal,
      correct: blockCorrect,
      rate
    };
  });

  const hasErrors = incorrectQuestions.length > 0;

  // Setup visual medal based on success rate
  let scoreTitle = "Требуется подготовка";
  let scoreDesc = "Попробуйте изучить пояснения к вопросам и пройти тест еще раз для лучшего закрепления материала.";
  let badgeAccent = "border-red-500/20 text-red-400 bg-[#111]";

  if (accuracyPercent >= 90) {
    scoreTitle = "Превосходный результат!";
    scoreDesc = "Великолепное знание анатомической терминологии и клинических аспектов. Вы готовы к любому испытанию!";
    badgeAccent = "border-green-500/20 text-green-400 bg-[#111]";
  } else if (accuracyPercent >= 70) {
    scoreTitle = "Хороший уровень знаний";
    scoreDesc = "Вы отлично ориентируетесь во многих системах органов, но есть место для регулярного повторения.";
    badgeAccent = "border-white/20 text-white bg-[#111]";
  } else if (accuracyPercent >= 50) {
    scoreTitle = "Удовлетворительно";
    scoreDesc = "Рекомендуется пройти точечную работу над ошибками для устранения обнаруженных пробелов.";
    badgeAccent = "border-gray-500/20 text-gray-300 bg-[#111]";
  }

  return (
    <div id="results-dashboard-container" className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Premium Hero Medal Card */}
      <div id="score-hero-card" className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 overflow-hidden relative">
        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-none border flex flex-col items-center justify-center shrink-0 ${badgeAccent} shadow-lg relative font-mono`}>
          <span className="text-[9px] uppercase tracking-widest opacity-55 text-center">Успешность</span>
          <span className="text-2xl font-bold mt-1">{accuracyPercent}%</span>
        </div>

        <div className="text-center md:text-left space-y-2.5 flex-1">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-mono">ИТОГ ТЕСТИРОВАНИЯ</span>
            <h1 id="result-greeting-title" className="text-2xl font-serif font-semibold text-white leading-tight">{scoreTitle}</h1>
          </div>
          <p id="result-description-text" className="text-gray-400 text-sm leading-relaxed max-w-lg font-light">
            {scoreDesc}
          </p>
        </div>
      </div>

      {/* Main Stats Panel Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total stats cards */}
        <div className="bg-[#111] border border-white/5 p-5 text-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Решено вопросов</span>
          <span id="final-total" className="text-2xl font-bold text-white font-mono block mt-1">{total}</span>
        </div>
        <div className="bg-[#111] border border-white/5 p-5 text-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Верных ответов</span>
          <span id="final-correct" className="text-2xl font-bold text-green-400 font-mono block mt-1">+{correctCount}</span>
        </div>
        <div className="bg-[#111] border border-white/5 p-5 text-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Допущено ошибок</span>
          <span id="final-incorrect" className="text-2xl font-bold text-red-400 font-mono block mt-1">-{total - correctCount}</span>
        </div>
      </div>

      {/* Block Accuracy Detail Breakdown */}
      <div id="sections-breakdown-card" className="bg-[#080808] border border-white/5 rounded-none p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="font-serif font-semibold text-white text-lg tracking-wide flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          Раздельный результат по подразделам анатомии
        </h3>

        <div className="divide-y divide-white/5 text-sm">
          {blockPerformance.map((bp) => {
            if (bp.played === 0) return null;

            return (
              <div id={`block-row-${bp.id}`} key={bp.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-serif font-semibold text-gray-200 block">{bp.title}</span>
                  <span className="text-xs text-gray-500 block font-light">{bp.description}</span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right sm:min-w-[80px]">
                    <span className="text-[10px] text-gray-500 block font-mono">{bp.correct} / {bp.played} верных</span>
                    <span className={`font-mono font-bold text-sm block mt-0.5 ${
                      bp.rate !== null && bp.rate >= 80 ? "text-green-400" : bp.rate !== null && bp.rate >= 50 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {bp.rate !== null ? `${bp.rate}%` : '—'}
                    </span>
                  </div>

                  {/* Elegant minimal line indicator */}
                  <div className="w-24 h-0.5 bg-white/10 rounded-none overflow-hidden relative">
                    <div
                      className={`h-full absolute left-0 top-0 transition-all duration-300 ${
                        bp.rate !== null && bp.rate >= 80 ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" : bp.rate !== null && bp.rate >= 50 ? "bg-amber-400" : "bg-red-400"
                      }`}
                      style={{ width: `${bp.rate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {session.blockId === "errors" && (
            <div className="py-5 text-center text-gray-500 italic text-xs font-light">
              Вы проходили точечный разбор прошлых некорректных вопросов.
            </div>
          )}
        </div>
      </div>

      {/* Target Retake Block For Errors */}
      {hasErrors && (
        <div id="errors-remedy-card" className="bg-[#1a0a0a]/40 border border-red-500/20 rounded-none p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
          <div className="flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-bold text-red-400 text-[11px] tracking-widest uppercase font-mono">Рекомендована работа над ошибками</h4>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md font-light">
                Вы ошиблись в <strong>{incorrectQuestions.length}</strong> {incorrectQuestions.length === 1 ? 'вопросе' : incorrectQuestions.length < 5 ? 'вопросах' : 'вопросах'}. Проработайте и закрепите знания именно по этим пунктам.
              </p>
            </div>
          </div>

          <button
            id="retry-errors-btn"
            onClick={onRetryErrors}
            className="w-full sm:w-auto px-5 py-3 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs font-mono tracking-widest uppercase transition-all duration-250 cursor-pointer"
          >
            Пройти ошибки ({incorrectQuestions.length})
          </button>
        </div>
      )}

      {/* Navigation action pad */}
      <div className="flex flex-col sm:flex-row gap-4 font-mono">
        <button
          id="retry-block-btn"
          onClick={onRetryBlock}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-4 border border-white/20 hover:border-white text-white transition-all text-xs uppercase tracking-widest cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          Пройти блок заново
        </button>

        <button
          id="back-menu-btn"
          onClick={onBackToMenu}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-4 bg-white text-black font-bold hover:bg-gray-200 transition-all text-xs uppercase tracking-widest cursor-pointer"
        >
          Вернуться в главное меню
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Error Details Listing as structured training card */}
      {hasErrors && (
        <div id="errors-learning-sheet" className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-serif font-semibold text-white text-base">
              Шпаргалка по ошибочным вопросам
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-light">
              Изучите латинскую номенклатуру и клиническое руководство для надежной памяти.
            </p>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto pr-3 divide-y divide-white/5">
            {incorrectQuestions.map((q, qIdx) => (
              <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                <p className="font-serif font-semibold text-white text-base">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="bg-[#111] border border-white/5 p-4 rounded-none text-xs leading-relaxed space-y-1.5 font-light">
                  <span className="text-green-400 font-mono font-semibold block uppercase tracking-wider text-[10px]">
                    Правильный ответ: {q.options[q.correctIndex]}
                  </span>
                  <p className="text-gray-450">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
