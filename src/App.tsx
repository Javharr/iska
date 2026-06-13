/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Layers, 
  Shuffle, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Dna, 
  Upload, 
  Plus, 
  Play, 
  AlertTriangle, 
  RefreshCw,
  TrendingUp,
  BrainCircuit,
  Volume2
} from 'lucide-react';
import { Question, QuizSession, BlockDefinition } from './types';
import { DEFAULT_QUESTIONS, partitionQuestions } from './data';
import Importer from './components/Importer';
import ActiveQuiz from './components/ActiveQuiz';
import ResultsDashboard from './components/ResultsDashboard';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('anatomy_quiz_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved questions", e);
      }
    }
    return DEFAULT_QUESTIONS;
  });

  const [session, setSession] = useState<QuizSession | null>(() => {
    const saved = localStorage.getItem('anatomy_quiz_active_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse active session", e);
      }
    }
    return null;
  });

  const [view, setView] = useState<'menu' | 'quiz' | 'results' | 'import'>(() => {
    if (session) {
      return 'quiz';
    }
    return 'menu';
  });

  const [blockSize, setBlockSize] = useState<number>(() => {
    const saved = localStorage.getItem('anatomy_quiz_block_size');
    return saved ? parseInt(saved) : 300;
  });

  const [shuffleMode, setShuffleMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('anatomy_quiz_shuffle_mode');
    return saved === 'true';
  });

  const [errorQueue, setErrorQueue] = useState<string[]>(() => {
    const saved = localStorage.getItem('anatomy_quiz_error_queue');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('anatomy_quiz_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('anatomy_quiz_block_size', blockSize.toString());
  }, [blockSize]);

  useEffect(() => {
    localStorage.setItem('anatomy_quiz_shuffle_mode', shuffleMode.toString());
  }, [shuffleMode]);

  useEffect(() => {
    localStorage.setItem('anatomy_quiz_error_queue', JSON.stringify(errorQueue));
  }, [errorQueue]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('anatomy_quiz_active_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('anatomy_quiz_active_session');
    }
  }, [session]);

  const handleImportComplete = (imported: Question[]) => {
    setQuestions(imported);
    setView('menu');
  };

  const resetToDefaultQuestions = () => {
    if (window.confirm("Вы уверены, что хотите сбросить вопросы к стандартной базе (30 демонстрационных вопросов)?")) {
      setQuestions(DEFAULT_QUESTIONS);
      setErrorQueue([]);
      setSession(null);
      setView('menu');
    }
  };

  // Fisher-Yates shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startQuiz = (blockId: string, qIds: string[]) => {
    let finalIds = [...qIds];
    if (shuffleMode) {
      finalIds = shuffleArray(finalIds);
    }

    const newSession: QuizSession = {
      id: `session-${Date.now()}`,
      blockId,
      questionIds: finalIds,
      currentIndex: 0,
      answers: {},
      isCompleted: false,
      incorrectQuestionIds: []
    };

    setSession(newSession);
    setView('quiz');
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!session) return;
    const currentQId = session.questionIds[session.currentIndex];
    const qDetails = questions.find(q => q.id === currentQId);
    if (!qDetails) return;

    const isCorrect = optionIndex === qDetails.correctIndex;
    
    // Track incorrect questions for target practice later
    let updatedIncorrect = [...session.incorrectQuestionIds];
    if (!isCorrect && !updatedIncorrect.includes(currentQId)) {
      updatedIncorrect.push(currentQId);
    }

    const updatedAnswers = {
      ...session.answers,
      [currentQId]: optionIndex
    };

    setSession({
      ...session,
      answers: updatedAnswers,
      incorrectQuestionIds: updatedIncorrect
    });
  };

  const handleNext = () => {
    if (!session) return;

    if (session.currentIndex + 1 < session.questionIds.length) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1
      });
    } else {
      // Completed! Commit newly discovered errors to global persistent queue
      const newlyMissed = session.incorrectQuestionIds;
      const mergedErrors = Array.from(new Set([...errorQueue, ...newlyMissed]));
      setErrorQueue(mergedErrors);

      setSession({
        ...session,
        isCompleted: true
      });
      setView('results');
    }
  };

  const handleExitQuiz = () => {
    if (window.confirm("Вы уверены, что хотите завершить текущий тест? Прогресс этого тестирования будет сброшен.")) {
      setSession(null);
      setView('menu');
    }
  };

  const handleRetryBlock = () => {
    if (!session) return;
    // Find original question ids before shuffle
    const blockId = session.blockId;
    let originalIds: string[] = [];

    if (blockId === "general") {
      originalIds = questions.map(q => q.id);
    } else if (blockId === "errors") {
      originalIds = [...errorQueue];
    } else {
      const blocks = partitionQuestions(questions, blockSize);
      const activeBlock = blocks.find(b => b.id === blockId);
      if (activeBlock) {
        originalIds = questions.slice(activeBlock.startIndex, activeBlock.endIndex + 1).map(q => q.id);
      }
    }

    startQuiz(blockId, originalIds);
  };

  const handleRetryErrors = () => {
    if (!session) return;
    const currentIncorrect = session.incorrectQuestionIds;
    if (currentIncorrect.length === 0) return;

    startQuiz("errors", currentIncorrect);
  };

  const handlePracticeGlobalErrors = () => {
    if (errorQueue.length === 0) return;
    startQuiz("errors", errorQueue);
  };

  const handleClearGlobalErrors = () => {
    if (window.confirm("Сбросить текущий список ошибочных вопросов? Ваша статистика будет очищена.")) {
      setErrorQueue([]);
    }
  };

  // Generate blocks based on configured size and loaded questions
  const generatedBlocks = partitionQuestions(questions, blockSize);

  return (
    <div className="min-h-screen bg-[#050505] text-[#d1d5db] pb-16 font-sans selection:bg-white selection:text-black">
      {/* Sophisticated Dark Header */}
      <header className="h-16 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Minimalist rotated emblem logo */}
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-none shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <div className="w-3.5 h-3.5 border border-black rotate-45"></div>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-serif tracking-widest uppercase text-white font-medium">
                Anatomia<span className="font-light opacity-50 underline underline-offset-4 decoration-1 ml-0.5">Pro</span>
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono hidden sm:inline-block border-l border-white/10 pl-3 ml-3">
                Обучающий тренажер
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono">
            {view === 'menu' && (
              <button
                id="header-import-btn"
                onClick={() => setView('import')}
                className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black text-white transition-colors text-xs tracking-widest uppercase cursor-pointer"
              >
                <span>Импорт базы</span>
              </button>
            )}

            {questions !== DEFAULT_QUESTIONS && view === 'menu' && (
              <button
                onClick={resetToDefaultQuestions}
                className="px-3 py-2 border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors text-xs tracking-widest uppercase cursor-pointer"
                title="Сбросить к дефолтной базе"
              >
                <span>Сброс</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Primary Container View Route Switcher */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        
        {view === 'import' && (
          <Importer 
            onImportComplete={handleImportComplete} 
            onCancel={() => setView('menu')}
            currentCount={questions.length}
          />
        )}

        {view === 'quiz' && session && (
          <ActiveQuiz
            session={session}
            questions={questions}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
            onExit={handleExitQuiz}
          />
        )}

        {view === 'results' && session && (
          <ResultsDashboard
            session={session}
            questions={questions}
            blocks={generatedBlocks}
            onRetryBlock={handleRetryBlock}
            onRetryErrors={handleRetryErrors}
            onBackToMenu={() => {
              setSession(null);
              setView('menu');
            }}
          />
        )}

        {view === 'menu' && (
          <div className="space-y-10 animate-fade-in">
            {/* Elegant Serif-styled Welcome banner */}
            <div id="welcome-banner" className="bg-[#0a0a0a] border border-white/10 rounded-none p-8 sm:p-10 relative overflow-hidden">
              <div className="max-w-3xl space-y-6 relative z-10">
                <h1 className="text-3xl sm:text-4.5xl font-serif text-white tracking-wide leading-tight">
                  Интеллектуальная подготовка <br/>
                  <span className="text-gray-400 font-light italic">по анатомии человека</span>
                </h1>
                
                <p className="text-gray-450 text-sm leading-relaxed max-w-2xl font-light">
                  Программа позволяет дробить массивные списки вопросов на разделы по {blockSize} штук для максимально результативного обучения. Сразу после ответа выводится латинская терминология и обоснование для лучшего закрепления.
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono tracking-wider font-bold text-gray-400 bg-white/5 p-4 rounded-none border border-white/10 w-fit">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    БАЗА: <span className="text-white">{questions.length} вопросов</span>
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${shuffleMode ? "bg-white" : "bg-gray-600"}`}></span>
                    СЛУЧАЙНЫЙ ПОРЯДОК: <span className={shuffleMode ? "text-white" : "text-gray-500"}>{shuffleMode ? "АКТИВЕН" : "ВЫКЛЮЧЕН"}</span>
                  </span>
                </div>
              </div>

              {/* Sophisticated decor element background */}
              <div className="absolute right-12 bottom-0 top-0 w-1/4 opacity-[0.02] pointer-events-none hidden lg:block">
                <Dna className="w-full h-full text-white" />
              </div>
            </div>

            {/* Quick configuration and stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Settings parameters card */}
              <div id="config-hub-card" className="bg-[#080808] border border-white/5 rounded-none p-6 flex flex-col justify-between gap-6 hover:border-white/10 transition-all duration-350">
                <div className="space-y-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono flex items-center gap-2">
                    <BrainCircuit className="w-3.5 h-3.5 text-gray-400" />
                    Режимы & настройки
                  </h2>

                  <div className="space-y-5 pt-1">
                    {/* Shuffle configuration toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-gray-200 block">Перемешивание</span>
                        <span className="text-[11px] text-gray-500 block">Рандомный вывод вопросов</span>
                      </div>
                      <button
                        id="toggle-shuffle-btn"
                        onClick={() => setShuffleMode(!shuffleMode)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none ${
                          shuffleMode ? "bg-white border-white" : "bg-black border-white/20"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full transition duration-200 ease-in-out mt-[2px] ${
                            shuffleMode ? "translate-x-5 bg-black" : "translate-x-0.5 bg-gray-500"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Partition sizing setting */}
                    {questions.length > 35 && (
                      <div className="space-y-2 pt-3 border-t border-white/5">
                        <label className="text-xs text-gray-400 block tracking-wide">Размер учебного блока:</label>
                        <div className="flex gap-1.5">
                          {[100, 300, 500].map(size => (
                            <button
                              key={size}
                              onClick={() => setBlockSize(size)}
                              className={`flex-1 text-xs font-mono font-bold py-1 px-2 border transition duration-150 ${
                                blockSize === size 
                                  ? "bg-white border-white text-black" 
                                  : "bg-transparent border-white/10 text-gray-400 hover:border-white/35"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Global Error target practice card */}
              <div id="errors-hub-card" className="bg-[#080808] border border-white/5 rounded-none p-6 flex flex-col justify-between gap-5 hover:border-white/10 transition-all duration-350">
                <div className="space-y-2">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    Накопитель ошибок
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Сюда попадают неправильно отвеченные вопросы тестов для последующего точечного повторения.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111] p-3 border border-white/5 flex flex-col">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Ошибки</span>
                      <span id="global-errors-badge" className={`text-base font-mono font-bold mt-1 ${
                        errorQueue.length > 0 ? "text-red-400" : "text-green-400"
                      }`}>
                        {errorQueue.length} вопр.
                      </span>
                    </div>
                    <div className="bg-[#111] p-3 border border-white/5 flex flex-col justify-center items-center">
                      {errorQueue.length > 0 && (
                        <button
                          onClick={handleClearGlobalErrors}
                          className="text-[10px] uppercase font-mono tracking-wider text-gray-500 hover:text-red-400 transition-colors"
                          title="Сбросить очередь ошибок"
                        >
                          Сбросить
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    id="practice-errors-btn"
                    disabled={errorQueue.length === 0}
                    onClick={handlePracticeGlobalErrors}
                    className="w-full py-2.5 border border-red-500/20 hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#d1d5db]/30 text-red-400 text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer"
                  >
                    Тренировка ошибок
                  </button>
                </div>
              </div>

              {/* Global Combined Test Start Block */}
              <div id="general-block-card" className="bg-[#080808] border border-white/5 rounded-none p-6 flex flex-col justify-between gap-4 hover:border-white/10 transition-all duration-350">
                <div className="space-y-2">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    Общий зачет
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Запуск генерального зачета по абсолютно всем имеющимся вопросам базы данных без ограничений по блокам.
                  </p>
                </div>

                <button
                  id="start-general-btn"
                  onClick={() => startQuiz("general", questions.map(q => q.id))}
                  className="w-full mt-4 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white text-xs tracking-widest uppercase transition-all duration-300 font-mono cursor-pointer"
                >
                  Пройти все ({questions.length})
                </button>
              </div>

            </div>

            {/* List of segmented study blocks */}
            <div className="space-y-6 pt-4">
              <div className="flex items-end justify-between border-b border-white/10 pb-3">
                <h2 className="text-xl font-serif text-white tracking-widest uppercase font-semibold flex items-center gap-3">
                  <Layers className="w-4 h-4 text-gray-400" />
                  Учебные блоки
                </h2>
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                  Дробление: по {blockSize} вопросов
                </span>
              </div>

              <div id="blocks-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedBlocks.map((block, index) => {
                  const blockQSlice = questions.slice(block.startIndex, block.endIndex + 1);
                  const blockQIds = blockQSlice.map(q => q.id);

                  // Calculate active block errors
                  const blockErrorsCount = errorQueue.filter(id => blockQIds.includes(id)).length;

                  return (
                    <div
                      id={`block-card-${block.id}`}
                      key={block.id}
                      className="bg-[#080808] border border-white/5 rounded-none p-6 transition-all duration-300 flex flex-col justify-between gap-6 hover:border-white/20 group relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono tracking-widest text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-none font-bold">
                            БЛОК {String(index + 1).padStart(2, '0')}
                          </span>
                          
                          {blockErrorsCount > 0 && (
                            <span className="text-[9px] font-bold font-mono text-red-400 bg-red-500/10 px-2 py-0.5 border border-red-500/20" title="Ошибки в этом блоке">
                              {blockErrorsCount} ОПЛОШНОСТЕЙ
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-semibold text-white group-hover:text-white text-base leading-normal">
                          {block.title}
                        </h3>

                        <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                          {block.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[11px] font-mono">
                        <span className="text-gray-500 tracking-wide">{block.totalQuestions} вопросов</span>
                        
                        <button
                          id={`start-block-btn-${block.id}`}
                          onClick={() => startQuiz(block.id, blockQIds)}
                          className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black text-white text-xs uppercase tracking-widest transition-colors duration-250 cursor-pointer"
                        >
                          Начать
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
