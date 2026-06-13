/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, ArrowLeft } from 'lucide-react';
import { Question } from '../types';
import { parseUploadedText } from '../data';

interface ImporterProps {
  onImportComplete: (questions: Question[]) => void;
  onCancel?: () => void;
  currentCount: number;
}

export default function Importer({ onImportComplete, onCancel, currentCount }: ImporterProps) {
  const [rawText, setRawText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Question[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setRawText(text);
        try {
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              setParsedPreview(parsed);
              setErrorMsg(null);
            } else {
              setErrorMsg("JSON должен быть массивом вопросов.");
            }
          } else {
            const parsed = parseUploadedText(text);
            setParsedPreview(parsed);
            setErrorMsg(null);
          }
        } catch (err) {
          setErrorMsg("Ошибка предварительного чтения файла.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleHeuristicsParse = () => {
    if (!rawText.trim()) {
      setErrorMsg("Сначала загрузите файл или вставьте текст вопросов.");
      return;
    }

    try {
      let questions: Question[] = [];
      if (rawText.trim().startsWith('[')) {
        questions = JSON.parse(rawText);
      } else {
        questions = parseUploadedText(rawText);
      }

      if (questions.length === 0) {
        setErrorMsg("Не удалось найти вопросы. Проверьте формат текста.");
        return;
      }

      setSuccessMsg(`Успешно распознано вопросов: ${questions.length}`);
      onImportComplete(questions);
    } catch (err: any) {
      setErrorMsg(`Ошибка разбора: ${err.message || String(err)}`);
    }
  };

  const handleAiParse = async () => {
    if (!rawText.trim()) {
      setErrorMsg("Вставьте текст вопросов для ИИ-анализа.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/parse-questions-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Произошла неизвестная ошибка при парсинге.");
      }

      if (data.questions && Array.isArray(data.questions)) {
        setSuccessMsg(`ИИ-Парсер успешно структурировал вопросов: ${data.questions.length}`);
        onImportComplete(data.questions);
      } else {
        throw new Error("Неверный формат ответа сервера.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`ИИ-Парсинг временно недоступен. Воспользуйтесь 'Обычным импортом' (быстрый разбор регулярными выражениями на клиенте). Детали: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="importer-block" className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-none p-6 sm:p-10 shadow-2xl animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white tracking-wide font-medium flex items-center gap-3">
            <Upload className="w-5 h-5 text-gray-400" />
            Импорт собственной базы тестов
          </h2>
          <p className="text-gray-505 text-sm mt-1.5 font-light">
            Загрузите текстовый файл (.txt) или JSON, содержащий ваши вопросы по анатомии.
          </p>
        </div>
        {onCancel && (
          <button
            id="back-from-import"
            onClick={onCancel}
            className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black transition-all text-xs font-mono tracking-widest uppercase cursor-pointer"
          >
            Назад к тесту
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input and Operations */}
        <div className="space-y-6">
          {/* Draggable File Area */}
          <div
            id="drop-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`border border-dashed p-8 text-center cursor-pointer transition-all rounded-none ${
              dragActive 
                ? "border-white bg-white/10 text-white" 
                : "border-white/20 bg-[#080808]/50 text-gray-400 hover:border-white/50 hover:text-white"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileText className="w-8 h-8 mx-auto text-gray-500 mb-3" />
            <span className="block font-serif text-sm text-gray-200 mb-1">Перетащите файл сюда или кликните</span>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider">Поддерживаются форматы.txt и .json</span>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest uppercase text-gray-400 mb-2">Или вставьте текст напрямую:</label>
            <textarea
              id="raw-text-textarea"
              rows={8}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder={`Пример разметки:
1. Как называется плечевой сустав на латыни?
А) Articulatio humeri
Б) Articulatio coxae
В) Articulatio genus
Г) Articulatio cubiti
Правильный ответ: А
Пояснение: Сустав образован головкой плечевой кости и лопаткой.`}
              className="w-full bg-[#050505] text-gray-300 border border-white/10 rounded-none p-4 text-xs font-mono focus:border-white focus:outline-none transition leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 font-mono">
            <button
              id="heuristics-parse-btn"
              onClick={handleHeuristicsParse}
              disabled={isLoading || !rawText.trim()}
              className="flex-1 py-3 border border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all text-xs tracking-widest uppercase text-white cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              Обычный импорт
            </button>

            <button
               id="ai-parse-btn"
               onClick={handleAiParse}
               disabled={isLoading || !rawText.trim()}
               className="flex-1 py-3 bg-white text-black hover:bg-gray-200 font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:hover:bg-white"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Умный ИИ-Импорт
            </button>
          </div>

          {/* User Alerts */}
          {errorMsg && (
            <div id="import-error-alert" className="bg-red-500/10 border border-red-500/20 p-4 shrink-0 flex gap-3 text-red-200 text-xs font-light">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block font-mono text-[10px] mb-0.5 text-red-400">Ошибка операции</span>
                {errorMsg}
              </div>
            </div>
          )}

          {successMsg && (
            <div id="import-success-alert" className="bg-green-500/10 border border-green-500/20 p-4 shrink-0 flex gap-3 text-green-200 text-xs font-light">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block font-mono text-[10px] mb-0.5 text-green-400">Импорт выполнен</span>
                {successMsg}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Instructions & Status */}
        <div className="bg-[#080808] border border-white/5 p-6 space-y-6">
          <div>
            <h3 className="font-serif font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Принципы разметки вопросов
            </h3>
            <ul className="space-y-4 text-xs text-gray-400 list-disc pl-4 leading-relaxed font-light">
              <li>Порядковый номер должен начинаться с цифры в начале строки (например, <strong className="text-white">1.</strong>).</li>
              <li>Варианты ответов должны начинаться с буквенного индекса (<strong className="text-white">А)</strong>, <strong className="text-white">Б)</strong> или <strong className="text-white">А.</strong>, <strong className="text-white">Б.</strong>) и содержать ровно 4 варианта.</li>
              <li>Маркер верного ответа должен содержать выражение <strong className="text-white">«Правильный ответ:»</strong> или <strong className="text-white">«Ответ:»</strong> с буквой верного варианта.</li>
              <li>Разбор/пояснение вносится через <strong className="text-white">«Пояснение:»</strong> — этот разбор выведется сразу после выбора ответа.</li>
              <li>При сложной структуре сбитого текста <strong className="text-gray-300">«Умный ИИ-Импорт»</strong> автоматически восстановит латинские дескрипторы и корректные ключи!</li>
            </ul>
          </div>

          <div className="border-t border-white/5 pt-6 font-mono text-xs">
            <h3 className="text-gray-500 uppercase tracking-widest text-[10px] mb-3">Состояние внутренней базы</h3>
            <div className="bg-[#111] p-4 flex items-center justify-between border border-white/5">
              <span className="text-gray-400 font-light">Активных медицинских вопросов:</span>
              <span className="font-mono font-bold text-white text-base">
                {currentCount}
              </span>
            </div>
          </div>

          {parsedPreview.length > 0 && (
            <div className="border-t border-white/5 pt-6 space-y-3 font-mono text-xs">
              <h3 className="text-gray-500 uppercase tracking-[0.1em] text-[10px] font-bold">Предпросмотр первого вопроса:</h3>
              <div className="bg-[#050505] border border-white/5 p-4 space-y-2 max-h-40 overflow-y-auto leading-relaxed">
                <span className="text-gray-500 block font-light">// Структурирование выполнено</span>
                <p className="text-white font-serif font-semibold">Q: {parsedPreview[0].question}</p>
                <div className="pl-3 text-gray-400 space-y-1 font-light">
                  {parsedPreview[0].options.map((opt, oIdx) => (
                    <p key={oIdx} className={oIdx === parsedPreview[0].correctIndex ? "text-green-400 font-medium" : ""}>
                      {String.fromCharCode(1040 + oIdx)}) {opt}
                    </p>
                  ))}
                </div>
                <p className="text-white/40 italic font-light mt-2">Explanation: {parsedPreview[0].explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
