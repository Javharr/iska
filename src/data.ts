/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, BlockDefinition } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  // БЛОК 1: Опорно-двигательный аппарат и общая анатомия (Osteology & Myology)
  {
    id: "q1",
    question: "Какие важные функции закреплены за ротовой полостью (cavitas oris)?",
    options: [
      "Прием, пережевывание, первичное переваривание пищи, участие в акте речи и дыхания",
      "Исключительно механическое измельчение пищи сухожильными элементами зубов",
      "Всасывание жирных кислот и выработка соляной кислоты для дезинфекции",
      "Проведение воздуха в трахею и выработка гормонов щитовидной железы"
    ],
    correctIndex: 0,
    explanation: "Ротовая полость выполняет функции приема и измельчения пищи, ее начального гидролиза (слюна), а также участвует в речеобразовании (артикуляции) и дыхании.",
    category: "Пищеварительная система"
  },
  {
    id: "q2",
    question: "Какие отделы различают в полости рта человека?",
    options: [
      "Преддверие рта (vestibulum oris) и собственно полость рта (cavitas oris propria)",
      "Ротоглотку, носоглотку и гортанную часть глотки",
      "Шейный отдел и небный свод",
      "Переднюю губную борозду и задний зев"
    ],
    correctIndex: 0,
    explanation: "Полость рта анатомически делится на преддверие рта (щель между губами/щеками снаружи и зубами/деснами изнутри) и собственно полость рта.",
    category: "Пищеварительная система"
  },
  {
    id: "q3",
    question: "Чем ограничено преддверие рта (vestibulum oris) снаружи и изнутри?",
    options: [
      "Снаружи — губами и щеками, изнутри — зубами и деснами",
      "Снаружи — зубами, изнутри — языком и небом",
      "Снаружи — щечной мышцей, изнутри — миндалинами",
      "Снаружи — небными суставами, изнутри — зевом"
    ],
    correctIndex: 0,
    explanation: "Границами vestibulum oris являются губы (labia oris) и щеки (buccae) с внешней стороны, и десны (gingivae) с зубами (dentes) с внутренней стороны.",
    category: "Пищеварительная система"
  },
  {
    id: "q4",
    question: "Какая скелетная мышца залегает в толще губ человека?",
    options: [
      "M. orbicularis oris (круговая мышца рта)",
      "M. buccinator (щечная мышца)",
      "M. mentalis (подбородочная мышца)",
      "M. risorius (мышца смеха)"
    ],
    correctIndex: 0,
    explanation: "Круговая мышца рта (m. orbicularis oris) залегает в толще губ вокруг ротовой щели и осуществляет сужение ротового отверстия.",
    category: "Миология"
  },
  {
    id: "q5",
    question: "Чем образована костная основа твердого нёба (palatum durum)?",
    options: [
      "Небными отростками верхних челюстей и горизонтальными пластинками небных костей",
      "Телом клиновидной кости и сошником",
      "Ветвями нижней челюсти и скуловой дугой",
      "Слезными и решетчатыми отростками"
    ],
    correctIndex: 0,
    explanation: "Твердое нёбо в своей основе имеет костные структуры: небный отросток верхней челюсти (processus palatinus maxillae) и горизонтальную пластинку небной кости (lamina horisontalis ossis palatini).",
    category: "Остеология"
  },
  {
    id: "q6",
    question: "Какая мышца находится в толще щеки, отвечая за прижимание ее к зубам?",
    options: [
      "M. buccinator (щечная мышца)",
      "M. masseter (жевательная мышца)",
      "M. temporalis (височная мышца)",
      "M. digastricus (двубрюшная мышца)"
    ],
    correctIndex: 0,
    explanation: "Щечная мышца (m. buccinator) образует мышечную основу щеки, прижимает щеку к зубам, участвует в акте сосания и выдувания воздуха.",
    category: "Миология"
  },
  {
    id: "q7",
    question: "Что относится к парным хрящам гортани (larynx)?",
    options: [
      "Черпаловидные (cartilago arytenoidea), рожковидные (cartilago corniculata), клиновидные (cartilago cuneiformis)",
      "Щитовидный, перстневидный хрящи и надгортанник",
      "Подъязычный хрящ и трахеальные кольца",
      "Клиновидная кость и сошник"
    ],
    correctIndex: 0,
    explanation: "Парными хрящами гортани являются черпаловидный хрящ, рожковидный хрящ и клиновидный хрящ.",
    category: "Дыхательная система"
  },
  {
    id: "q8",
    question: "Что относится к непарным хрящам гортани (larynx)?",
    options: [
      "Щитовидный (cartilago thyroidea), перстневидный (cartilago cricoidea) и надгортанник (cartilago epiglottis)",
      "Черпаловидный, рожковидный и клиновидный хрящи",
      "Черпалонадгортанный и черпаловидно-перстневидный",
      "Подъязычный сустав и голосовая связка"
    ],
    correctIndex: 0,
    explanation: "Непарными хрящами гортани являются большие щитовидный и перстневидный хрящи, а также листовидный эластичный хрящ — надгортанник.",
    category: "Дыхательная система"
  },
  {
    id: "q9",
    question: "Где закладываются и созревают Т-лимфоциты иммунной системы?",
    options: [
      "В тимусе (вилочковой железе)",
      "В селезенке (lien)",
      "В пейеровых бляшках тонкой кишки",
      "В небных миндалинах"
    ],
    correctIndex: 0,
    explanation: "Тимус (thymus) — это центральный орган иммунопоэза, в котором происходит антигеннезависимое размножение и дифференцировка Т-лимфоцитов.",
    category: "Иммунология"
  },
  {
    id: "q10",
    question: "Верно ли следующее утверждение: «Сзади к желудку прилежит поджелудочная железа (pancreas)»?",
    options: ["Да", "Нет"],
    correctIndex: 0,
    explanation: "Да, это верно. Задняя стенка желудка (paries posterior ventriculi) соприкасается с передней поверхностью поджелудочной железы (pancreas) через сальниковую сумку.",
    category: "Пищеварительная система"
  },

  // БЛОК 2: Спланхнология и сердечно-сосудистая система (Internal Organs)
  {
    id: "q11",
    question: "Какая артерия в организме человека является исключением и несет венозную (бедную кислородом) кровь?",
    options: [
      "Легочный ствол (truncus pulmonalis) и легочные артерии",
      "Восходящая аорта (aorta ascendens)",
      "Почечная артерия (a. renalis)",
      "Внутренняя сонная артерия (a. carotis interna)"
    ],
    correctIndex: 0,
    explanation: "Легочный ствол несет венозную кровь из правого желудочка в легкие (малый круг), что является исключением (артерии обычно несут артериальную кровь).",
    category: "Ангиология"
  },
  {
    id: "q12",
    question: "Где вырабатывается желчь, необходимая для эмульгирования и всасывания жиров?",
    options: [
      "В гепатоцитах печени (hepar)",
      "В желчном пузыре (vesica biliaris)",
      "В островках поджелудочной железы",
      "В двенадцатиперстной кишке"
    ],
    correctIndex: 0,
    explanation: "Желчь вырабатывается непосредственно клетками печени (гепатоцитами). В желчном пузыре она лишь концентрируется и накапливается.",
    category: "Печень и желчевыделение"
  },
  {
    id: "q13",
    question: "Какой участок пищеварительной трубки человека является наиболее длинным?",
    options: [
      "Тонкая кишка (intestinum tenue)",
      "Толстая кишка (intestinum crassum)",
      "Пищевод (esophagus)",
      "Желудок (gaster)"
    ],
    correctIndex: 0,
    explanation: "Тонкая кишка (intestinum tenue) имеет длину около 5-6 метров у живого человека и является самым длинным отделом пищеварительного тракта.",
    category: "Пищеварительная система"
  },
  {
    id: "q14",
    question: "Какая по счету пара черепных нервов иннервирует мимические мышцы лица?",
    options: [
      "VII пара — лицевой нерв (n. facialis)",
      "V пара — тройничный нерв (n. trigeminus)",
      "X пара — блуждающий нерв (n. vagus)",
      "XII пара — подъязычный нерв"
    ],
    correctIndex: 0,
    explanation: "Лицевой нерв (nervus facialis), представляющий VII пару черепных нервов, иннервирует все мимические мышцы лица и подкожную мышцу шеи.",
    category: "Неврология"
  },
  {
    id: "q15",
    question: "Верно ли следующее утверждение: «Пилорический сфинктер желудка образован продольными мышцами в области дна желудка»?",
    options: ["Да", "Нет"],
    correctIndex: 1,
    explanation: "Нет, пилорический сфинктер (m. sphincter pylori) образован сильным круговым (циркулярным) слоем гладких мышц в области привратника желудка.",
    category: "Пищеварительная система"
  },
  {
    id: "q16",
    question: "Верно ли следующее утверждение: «Левое легкое шире и короче правого легкого вследствие давления сердца»?",
    options: ["Да", "Нет"],
    correctIndex: 1,
    explanation: "Нет, правое легкое шире и короче из-за высокого купола диафрагмы над печенью, а левое легкое длиннее и уже, так как к нему прилежит сердце.",
    category: "Дыхательная система"
  },
  {
    id: "q17",
    question: "Верно ли следующее утверждение: «У здорового взрослого человека левое легкое делится бороздами на три доли»?",
    options: ["Да", "Нет"],
    correctIndex: 1,
    explanation: "Нет, левое легкое (pulmo sinister) имеет только одну косую щель и делится на две доли (lobus superior et inferior), в отличие от трехдольного правого легкого.",
    category: "Дыхательная система"
  },
  {
    id: "q18",
    question: "Какая оболочка покрывает легкие снаружи и выстилает грудную полость изнутри?",
    options: [
      "Плевра (pleura)",
      "Брюшина (peritoneum)",
      "Перикард (pericardium)",
      "Эпикард"
    ],
    correctIndex: 0,
    explanation: "Легкие покрыты висцеральной плеврой, а грудная клетка изнутри — париетальной плеврой, образуя плевральную полость (cavitas pleuralis).",
    category: "Дыхательная система"
  },
  {
    id: "q19",
    question: "Какая железа внутренней секреции вырабатывает гормоны тироксин и трийодтиронин?",
    options: [
      "Щитовидная железа (glandula thyroidea)",
      "Надпочечники (glandulae suprarenales)",
      "Поджелудочная железа",
      "Паращитовидная железа"
    ],
    correctIndex: 0,
    explanation: "Щитовидная железа (glandula thyroidea) вырабатывает йодсодержащие гормоны (Т3 и Т4) для контроля интенсивности метаболизма клеток тела.",
    category: "Эндокринология"
  },
  {
    id: "q20",
    question: "Верно ли следующее утверждение: «Устье правого и левого мочеточников открываются на задней стенке мочевого пузыря»?",
    options: ["Да", "Нет"],
    correctIndex: 0,
    explanation: "Да, мочеточники (ureteres) косо прободают заднюю стенку мочевого пузыря в области его мочепузырного треугольника (trigonum vesicae).",
    category: "Мочевая система"
  },

  // БЛОК 3: Нервная, выделительная и половая системы (Neurology & Urology)
  {
    id: "q21",
    question: "Где образуется первичная моча в почках в процессе ультрафильтрации?",
    options: [
      "В почечном тельце (клубочке нефрона)",
      "В собирательных трубках мозгового слоя",
      "В почечной лоханке (pelvis renalis)",
      "В извитых канальцах петли Генле"
    ],
    correctIndex: 0,
    explanation: "Первичная моча образуется в почечном тельце (corpusculum renis), состоящем из сосудистого клубочка (glomerulus) и капсулы Шумлянского-Боумена.",
    category: "Мочевая система"
  },
  {
    id: "q22",
    question: "Как называется гормон, стимулирующий сокращение гладкой мускулатуры матки в родах, секретируемый гипоталамусом?",
    options: [
      "Окситоцин",
      "Пролактин",
      "Вазопрессин",
      "Лютеинизирующий гормон"
    ],
    correctIndex: 0,
    explanation: "Окситоцин синтезируется в гипоталамусе, накапливается в нейрогипофизе и стимулирует сокращения миометрия матки.",
    category: "Эндокринология"
  },
  {
    id: "q23",
    question: "Какое кровеносное русло приносит венозную кровь от непарных органов брюшной полости в печень?",
    options: [
      "Воротная вена печени (vena portae hepatis)",
      "Нижняя полая вена (vena cava inferior)",
      "Верхняя брыжеечная вена",
      "Почечная вена (v. renalis)"
    ],
    correctIndex: 0,
    explanation: "Воротная вена собирает кровь от желудка, кишечника, селезенки и поджелудочной железы, доставляя её в синусоиды печени для детоксикации.",
    category: "Ангиология"
  },
  {
    id: "q24",
    question: "Какая кость предплечья располагается с латеральной стороны (со стороны большого пальца руки)?",
    options: [
      "Лучевая кость (radius)",
      "Локтевая кость (ulna)",
      "Плечевая кость (humerus)",
      "Надмыщелковая кость"
    ],
    correctIndex: 0,
    explanation: "Лучевая кость (radius) занимает латеральное положение на предплечье в анатомической стойке, а локтевая кость (ulna) находится медиально.",
    category: "Остеология"
  },
  {
    id: "q25",
    question: "Верно ли следующее утверждение: «Лимфоэпителиальное кольцо Вальдейера-Пирогова состоит из 4 непарных и 2 парных миндалин»?",
    options: ["Да", "Нет"],
    correctIndex: 1,
    explanation: "Нет, оно состоит из 2 непарных (глоточная и язычная) и 2 парных миндалин (нёбные и трубные). Всего 6 миндалин.",
    category: "Иммунология"
  },
  {
    id: "q26",
    question: "Верно ли следующее утверждение: «Матка в латинской транскрипции пишется как uterus или metra/hystera»?",
    options: ["Да", "Нет"],
    correctIndex: 0,
    explanation: "Да, это абсолютно верно. Матка имеет латинское название uterus, а греческие термины metra или hystera используются в клинической номенклатуре.",
    category: "Половая система"
  },
  {
    id: "q27",
    question: "Какая суставная сочленовная поверхность лопатки сочленяется с головкой плечевой кости?",
    options: [
      "Суставная впадина лопатки (cavitas glenoidalis)",
      "Акромион лопатки (acromion)",
      "Клювовидный отросток (processus coracoideus)",
      "Подостная ямка"
    ],
    correctIndex: 0,
    explanation: "Суставная впадина лопатки (cavitas glenoidalis) формирует плечевой сустав (articulatio humeri) со сферической головкой плечевой кости.",
    category: "Артрология"
  },
  {
    id: "q28",
    question: "Какое мышечное волокно образует средний слой стенки сердца (миокард)?",
    options: [
      "Поперечнополосатая сердечная мышечная ткань (кардиомиоциты)",
      "Гладкая неисчерченная соматическая ткань",
      "Поперечнополосатая скелетная ткань",
      "Рыхлая соединительная ткань"
    ],
    correctIndex: 0,
    explanation: "Миокард (myocardium) образован особой сердечной поперечнополосатой мышечной тканью (кардиомиоцитами), имеющей проводящие волокна и вставочные диски.",
    category: "Кардиология"
  },
  {
    id: "q29",
    question: "Верно ли следующее утверждение: «Tonsilla pharyngea (adenoide) и tonsilla lingualis являются непарными миндалинами»?",
    options: ["Да", "Нет"],
    correctIndex: 0,
    explanation: "Да, глоточная (tonsilla pharyngea) и язычная (tonsilla lingualis) миндалины не имеют симметричной пары, располагаясь по срединной линии слизистой оболочки.",
    category: "Иммунология"
  },
  {
    id: "q30",
    question: "Верно ли следующее утверждение: «Яичко (testis) по своей структуре и функциям относится к железам смешанной секреции»?",
    options: ["Да", "Нет"],
    correctIndex: 0,
    explanation: "Да, яички выполняют внешнесекреторную функцию (выработка сперматозоидов) и внутрисекреторную функцию (выработка тестостерона клетками Лейдига).",
    category: "Половая система"
  }
];

/**
 * Smart Parsing algorithm for raw text files containing anatomical tests
 * This handles BOTH standard options formats and the PDF format ("Question" followed by "Answer statement" / Yes-No)
 */
export function parseUploadedText(rawText: string): Question[] {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const parsedQuestions: Question[] = [];
  
  // Let's determine first which parser strategy is better: 
  // Strategy A: Multiple-choice blocks (Traditional parser)
  // Strategy B: Question & Answer pairs (PDF structure)
  
  // Let's sweep the lines to see if we have options of format A) Б) В) Г) or A. B. C. D.
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
        // If we already collected a question, package it before starting a new one
        if (currentQ) {
          packageStrategyBQuestion(currentQ, currentA, parsedQuestions, lastId++);
        }
        currentQ = qMatch[2] ? qMatch[2].trim() : line;
        currentA = "";
      } else {
        if (currentQ) {
          // Accumulate statement answer lines
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
        // fallback distractors
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
    // 4 options: correct answer, plus 3 generic anatomical/medical distractors
    options = [
      normalizedA || "Вариант ответа А (соответствует тексту)",
      "Анатомически неверный ответ (дистрактор)",
      "Орган расположен в другом отделе тела",
      "Альтернативное клиническое суждение"
    ];
    // Randomize correctIndex between 0 and 3
    correctIndex = Math.floor(Math.random() * 4);
    // Swap correct answer to the correct index position
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
 * Splits questions array into block definitions (chunks of 300 or dynamic splits)
 */
export function partitionQuestions(questions: Question[], preferredBlockSize: number = 300): BlockDefinition[] {
  const total = questions.length;
  
  if (total === 0) {
    return [
      { id: "block_1", title: "Раздел 1", description: "Вопросы с 1 по 0", startIndex: 0, endIndex: 0, totalQuestions: 0 },
      { id: "block_2", title: "Раздел 2", description: "Вопросы с 1 по 0", startIndex: 0, endIndex: 0, totalQuestions: 0 },
      { id: "block_3", title: "Раздел 3", description: "Вопросы с 1 по 0", startIndex: 0, endIndex: 0, totalQuestions: 0 },
    ];
  }

  // If we have exactly our default questions (30)
  if (questions.length === DEFAULT_QUESTIONS.length && questions[0]?.id === DEFAULT_QUESTIONS[0]?.id) {
    return [
      { id: "block_1", title: "Препараты, рот и глотка", description: "Пищеварительная и дыхательная системы, тимус", startIndex: 0, endIndex: 9, totalQuestions: 10 },
      { id: "block_2", title: "Внутренние органы и кровь", description: "Кардиология, дыхание, гепатология, нефрология", startIndex: 10, endIndex: 19, totalQuestions: 10 },
      { id: "block_3", title: "Нервы, матка и яички", description: "Неврология, мочеполовой аппарат, ангиология", startIndex: 20, endIndex: 29, totalQuestions: 10 }
    ];
  }

  // General formula for partitions of N questions (default is 300)
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
