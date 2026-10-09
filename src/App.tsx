/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Scissors,
  Scale,
  Award,
  Network,
  Library,
  BookOpen,
  Sparkles,
  Info,
  ShieldCheck,
  Cpu,
  Type,
  Sun,
  Moon,
  Compass,
  Palette,
} from 'lucide-react';
import { PhilosophicalDialogue } from './components/PhilosophicalDialogue';
import { DissectionStudio } from './components/DissectionStudio';
import { LogicDialecticLab } from './components/LogicDialecticLab';
import { AcademicGenerator } from './components/AcademicGenerator';
import { ConceptMapViewer } from './components/ConceptMapViewer';
import { PersonalLibrary } from './components/PersonalLibrary';
import {
  DialogueMessage,
  PhilosophicalPremise,
  LibraryItem,
  ConceptMapData,
  AudienceProfile,
  FontSizeMode,
  ThemeMode,
} from './types/philosophical';

const STORAGE_KEYS = {
  MESSAGES: 'logos_dialogue_messages_v2',
  PREMISES: 'logos_system_premises_v2',
  LIBRARY: 'logos_personal_library_v2',
  CONCEPT_MAP: 'logos_concept_map_v2',
  FONT_SIZE: 'logos_font_size_v2',
  THEME: 'logos_theme_v2',
};

// Initial Seed Data for immediate immersion
const INITIAL_PREMISES: PhilosophicalPremise[] = [
  {
    id: 'p1',
    statement: 'Princípio de Não-Contradição: Proposições contraditórias não podem ser ambas verdadeiras sob o mesmo aspecto simultaneamente.',
    category: 'Lógica Formal',
    formalFormula: '$\\neg(P \\land \\neg P)$',
    epistemicStatus: 'Sistema Formalmente Robusto',
    dateCreated: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'p2',
    statement: 'Pedagogia da Compreensão: O raciocínio humano falha mais frequentemente por medo, apego e cansaço do que por falta de inteligência intrínseca.',
    category: 'Ética / Axiologia',
    epistemicStatus: 'Sistema Formalmente Robusto',
    dateCreated: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'p3',
    statement: 'Realismo Estrutural: As leis fundamentais capturam relações matemáticas invariantes e leis que governam o cosmos.',
    category: 'Filosofia da Ciência',
    formalFormula: '$\\mathcal{R} \\models \\Sigma$',
    epistemicStatus: 'Conjetura Heurística',
    dateCreated: new Date().toISOString(),
    isPinned: true,
  },
];

const INITIAL_CONCEPT_MAP: ConceptMapData = {
  theme: 'Arquitetura Fundacional do Pensamento Lúcido',
  nodes: [
    {
      id: 'node_logic',
      label: 'Lógica e Razão',
      category: 'Axioma',
      definition: 'Estrutura dedutiva baseada em Identidade, Não-Contradição e Terceiro Excluído.',
      formula: '$\\neg(p \\land \\neg p)$',
      epistemicStatus: 'Fundacional',
    },
    {
      id: 'node_pedagogy',
      label: 'Educação do Pensamento',
      category: 'Conceito Central',
      definition: 'A arte socrática de formar o raciocínio desde a infância até a madureza com clareza e empatia.',
      epistemicStatus: 'Fundacional',
    },
    {
      id: 'node_dissection',
      label: 'Dissecação Racional',
      category: 'Desdobramento',
      definition: 'Separação cirúrgica entre impressões subjetivas, fatos demonstráveis e armadilhas cognitivas.',
      epistemicStatus: 'Fundacional',
    },
    {
      id: 'node_frailty',
      label: 'Hesitação Humana',
      category: 'Tensão Crítica',
      definition: 'Apegos emocionais, medo do erro e viés de confirmação que travam o discernimento sereno.',
      epistemicStatus: 'Problemático',
    },
    {
      id: 'node_serenity',
      label: 'Sabedoria Estável',
      category: 'Conclusão',
      definition: 'A síntese entre o rigor investigativo e a serenidade moral para uma vida lúcida.',
      epistemicStatus: 'Robusto',
    },
  ],
  edges: [
    { source: 'node_logic', target: 'node_pedagogy', relation: 'fundamenta' },
    { source: 'node_pedagogy', target: 'node_dissection', relation: 'implica' },
    { source: 'node_dissection', target: 'node_frailty', relation: 'limita' },
    { source: 'node_frailty', target: 'node_serenity', relation: 'sintetiza' },
    { source: 'node_logic', target: 'node_serenity', relation: 'necessita' },
  ],
};

const INITIAL_LIBRARY: LibraryItem[] = [
  {
    id: 'lib_init_1',
    title: 'Tese sobre a Inviolabilidade do Princípio de Não-Contradição',
    type: 'Tese Acadêmica',
    abstract: 'Demonstração formal de que qualquer tentativa de refutar o princípio de não-contradição já o pressupõe tacitamente em sua formulação.',
    content: `## Formulação Canônica da Tese

O **Princípio de Não-Contradição (PNC)** constitui a condição transcendental irrevogável de possibilidade de qualquer discurso significante.

$$ \\neg (P \\land \\neg P) $$

### 1. A Base Axiomática
Considere qualquer asserção $A$. Reivindicar que $A$ é verdadeiro e simultaneamente $\\neg A$ é verdadeiro destrói o valor de verdade da própria reivindicação:

$$ (A \\land \\neg A) \\vdash \\bot $$

Pelo princípio de explosão (*ex falso quodlibet*), de uma contradição segue-se qualquer proposição arbitrária $Q$:

$$ \\bot \\vdash Q $$

### 2. A Inviabilidade do Dialeteísmo Irrestrito
Mesmo lógicas paraconsistentes exigem restrições operatórias para evitar o colapso trivial do sistema. Consequentemente:
- A verdade necessita de exclusão determinável de seu oposto;
- O sujeito que profere uma frase distingue o som emitido de seu silêncio, atestando performativamente o PNC.

### Conclusão
O Instituto Logos conclui que o PNC não é uma preferência arbitrária, mas a sintaxe mínima do cosmos inteligível.`,
    tags: ['Logica', 'Axiomatica', 'Aristoteles'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    epistemicStatus: 'Sistema Formalmente Robusto',
  },
  {
    id: 'lib_init_2',
    title: 'Fábula da Menina e do Espelho do Rio',
    type: 'Fábula ou Diálogo Filosófico',
    abstract: 'Um diálogo pedagógico socrático sobre como as opiniões apressadas distorcem a verdade do mundo.',
    content: `## O Espelho da Água Agitada

Era uma manhã límpida quando a pequena Clara correu até a margem do riacho, aflita porque achava que as pedras no fundo haviam mudado de lugar.

— Veja, Sofia! — exclamou a menina, apontando para a correnteza. — Ontem as pedras eram lisas e retas, mas hoje elas estão tortas e dançam como monstros!

Sofia, que estava sentada na relva lendo um livro antigo, sorriu com doçura e pediu:

— Aproxime-se, Clara. Pare de pular sobre as folhas secas e respire devagar. Veja o que acontece quando seus pezinhos param de agitar a água.

A menina obedeceu. Pouco a pouco, as pequenas ondas que seus passos causavam na margem foram se acalmando. A superfície do riacho voltou a ser um vidro perfeito e imóvel. As pedras, antes retorcidas pelo movimento das ondas, revelaram-se tão calmas, sólidas e claras quanto no dia anterior.

— As pedras nunca mudaram, Clara — explicou a filósofa educadora, acariciando os cabelos da jovem. — Foi a sua pressa e o seu medo que agitaram o espelho da água. Assim também é o nosso pensamento: quando nos desesperamos, o mundo parece confuso e assustador. Mas se tivermos a coragem de aquietar a mente, a verdade aparece serena e límpida exatamente onde sempre esteve.

Clara guardou aquela imagem no coração para sempre. Desde aquele dia, sempre que sentia raiva ou aflição antes de uma prova ou de uma conversa difícil, lembrava-se do riacho e esperava a água se acalmar.`,
    tags: ['Pedagogia', 'Infância', 'Serenidade', 'Clareza'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    epistemicStatus: 'Sistema Formalmente Robusto',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dialogue' | 'dissection' | 'lab' | 'academic' | 'map' | 'library'>('dialogue');
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [premises, setPremises] = useState<PhilosophicalPremise[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [conceptMap, setConceptMap] = useState<ConceptMapData>(INITIAL_CONCEPT_MAP);
  const [isSending, setIsSending] = useState(false);
  const [dissectionInitialThought, setDissectionInitialThought] = useState<string>('');
  const [labInitialText, setLabInitialText] = useState<string>('');
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Accessibility & Preferences for all age groups
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>('normal');
  const [themeMode, setThemeMode] = useState<ThemeMode>('slate');
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile>('Auto (Dedução Dinâmica)');

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (storedMessages) setMessages(JSON.parse(storedMessages));

      const storedPremises = localStorage.getItem(STORAGE_KEYS.PREMISES);
      if (storedPremises) {
        setPremises(JSON.parse(storedPremises));
      } else {
        setPremises(INITIAL_PREMISES);
      }

      const storedLibrary = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      if (storedLibrary) {
        setLibraryItems(JSON.parse(storedLibrary));
      } else {
        setLibraryItems(INITIAL_LIBRARY);
      }

      const storedMap = localStorage.getItem(STORAGE_KEYS.CONCEPT_MAP);
      if (storedMap) setConceptMap(JSON.parse(storedMap));

      const storedFont = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
      if (storedFont) setFontSizeMode(storedFont as FontSizeMode);

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme) setThemeMode(storedTheme as ThemeMode);
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREMISES, JSON.stringify(premises));
    } catch {}
  }, [premises]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libraryItems));
    } catch {}
  }, [libraryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONCEPT_MAP, JSON.stringify(conceptMap));
    } catch {}
  }, [conceptMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSizeMode);
    } catch {}
  }, [fontSizeMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    } catch {}
  }, [themeMode]);

  // Dialogue actions
  const handleSendMessage = async (userText: string, classificationHint?: string, audienceHint?: string) => {
    const userMsg: DialogueMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
      queryClassification: classificationHint,
      deducedProfile: audienceHint,
    };

    const priorHistory = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/sophia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: priorHistory,
          activePremises: premises,
          classificationHint,
          audienceHint: audienceHint || (selectedAudience === 'Auto (Dedução Dinâmica)' ? undefined : selectedAudience),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erro na resposta do Instituto Logos.');
      }

      const sophiaMsg: DialogueMessage = {
        id: `sophia_${Date.now()}`,
        role: 'sophia',
        content: data.reply,
        timestamp: new Date().toISOString(),
        queryClassification: data.classification,
        deducedProfile: data.deducedProfile,
      };

      setMessages((prev) => [...prev, sophiaMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: DialogueMessage = {
        id: `sophia_err_${Date.now()}`,
        role: 'sophia',
        content: `**Aviso do Instituto Logos:** Falha ao processar a proposição. Detalhe: ${err?.message || 'Erro de comunicação.'}. Por favor, verifique a conexão e tente novamente.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Deseja reiniciar a sessão de diálogo com Sophia? A memória de axiomas será mantida.')) {
      setMessages([]);
    }
  };

  const handleAddPremise = (p: Omit<PhilosophicalPremise, 'id' | 'dateCreated'>) => {
    const newPremise: PhilosophicalPremise = {
      ...p,
      id: `p_${Date.now()}`,
      dateCreated: new Date().toISOString(),
    };
    setPremises((prev) => [newPremise, ...prev]);

    // Link to concept map as an axiom node
    const newNode = {
      id: `node_${Date.now()}`,
      label: p.statement.slice(0, 32) + '...',
      category: (p.category === 'Lógica Formal' ? 'Axioma' : 'Conceito Central') as any,
      definition: p.statement,
      formula: p.formalFormula,
      epistemicStatus: p.epistemicStatus,
    };
    setConceptMap((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
  };

  const handleRemovePremise = (id: string) => {
    setPremises((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveToLibrary = (item: LibraryItem) => {
    setLibraryItems((prev) => [item, ...prev]);
  };

  const handleDeleteLibraryItem = (id: string) => {
    setLibraryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Cross-module routing shortcuts
  const handleRouteToDissection = (text: string) => {
    setDissectionInitialThought(text);
    setActiveTab('dissection');
  };

  const handleRouteToStressTest = (text: string) => {
    setLabInitialText(text);
    setActiveTab('lab');
  };

  const handleRouteToFallacyAudit = (text: string) => {
    setLabInitialText(text);
    setActiveTab('lab');
  };

  const handleRouteToCounterarguments = (text: string) => {
    setLabInitialText(text);
    setActiveTab('lab');
  };

  const handleGenerateNewConceptMap = async (theme: string) => {
    setIsMapLoading(true);
    try {
      const res = await fetch('/api/sophia/concept-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      const data = await res.json();
      if (data.nodes && data.edges) {
        setConceptMap(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapLoading(false);
    }
  };

  // Dynamic Theme & Font classes
  const fontClass =
    fontSizeMode === 'extralarge'
      ? 'font-size-extralarge'
      : fontSizeMode === 'large'
      ? 'font-size-large'
      : 'font-size-normal';

  const themeClass =
    themeMode === 'parchment'
      ? 'theme-parchment bg-[#fbf8f1] text-[#1c1917]'
      : themeMode === 'twilight'
      ? 'theme-twilight bg-[#120f1c] text-[#f5f3ff]'
      : 'theme-slate bg-[#090d16] text-[#f1f5f9]';

  const headerBgClass =
    themeMode === 'parchment'
      ? 'bg-[#f4efe4] border-[#e2d9c8]'
      : themeMode === 'twilight'
      ? 'bg-[#181424] border-[#29223c]'
      : 'bg-[#0f1422] border-stone-800/90';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none reading-ease ${fontClass} ${themeClass}`}>
      {/* Top Academic & Educational Header */}
      <header className={`h-15 border-b px-5 flex items-center justify-between z-30 shrink-0 ${headerBgClass}`}>
        {/* Brand & Chief Philosopher */}
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-700/40 border border-amber-500/40 flex items-center justify-center text-amber-300 font-classical font-extrabold text-base shadow-sm">
            Λ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-classical font-bold tracking-wider text-amber-400">
                LOGOS INSTITUTE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/50">
                Sophia • Filósofa Educadora
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              Sabedoria e Razão Clara &bull; Para todas as idades (de mamando a caducando)
            </p>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-stone-950/70 p-1 rounded-xl border border-stone-850">
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'dialogue'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Diálogo</span>
            <span className="md:hidden">Diálogo</span>
          </button>

          <button
            onClick={() => setActiveTab('dissection')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'dissection'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dissecadora</span>
            <span className="md:hidden">Dissecar</span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'lab'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Laboratório</span>
            <span className="md:hidden">Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'academic'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Oficina de Escrita</span>
            <span className="md:hidden">Escrita</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'map'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Árvore do Saber</span>
            <span className="md:hidden">Árvore</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'library'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Biblioteca ({libraryItems.length})</span>
            <span className="md:hidden">Codex</span>
          </button>
        </nav>

        {/* Right Accessibility & Comfort Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Size Accessibility Toggle */}
          <div className="flex items-center bg-stone-950/80 p-0.5 rounded-lg border border-stone-850" title="Ajuste do tamanho de leitura">
            <button
              onClick={() => setFontSizeMode('normal')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                fontSizeMode === 'normal' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Fonte Normal"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-1.5 py-0.5 rounded text-xs font-mono transition ${
                fontSizeMode === 'large' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Fonte Confortável"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeMode('extralarge')}
              className={`px-1.5 py-0.5 rounded text-sm font-mono transition ${
                fontSizeMode === 'extralarge' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Fonte Generosa (Acessibilidade para Crianças e Sêniores)"
            >
              A+
            </button>
          </div>

          {/* Theme Mode Toggle */}
          <div className="hidden sm:flex items-center bg-stone-950/80 p-0.5 rounded-lg border border-stone-850">
            <button
              onClick={() => setThemeMode('slate')}
              className={`p-1 rounded transition ${themeMode === 'slate' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-stone-200'}`}
              title="Palácio da Razão (Ardósia Escura Moderna)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('parchment')}
              className={`p-1 rounded transition ${themeMode === 'parchment' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-stone-200'}`}
              title="Pergaminho Sereno (Claro Editorial Acolhedor)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('twilight')}
              className={`p-1 rounded transition ${themeMode === 'twilight' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-stone-200'}`}
              title="Crepúsculo Áureo (Sépia Calmo)"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-3 overflow-hidden">
        {activeTab === 'dialogue' && (
          <PhilosophicalDialogue
            messages={messages}
            premises={premises}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            onAddPremise={handleAddPremise}
            onRemovePremise={handleRemovePremise}
            onSendToDissection={handleRouteToDissection}
            onSendToStressTest={handleRouteToStressTest}
            onSendToFallacyAudit={handleRouteToFallacyAudit}
            onSendToCounterarguments={handleRouteToCounterarguments}
            onSaveToLibrary={handleSaveToLibrary}
            isSending={isSending}
            selectedAudience={selectedAudience}
            onChangeAudience={setSelectedAudience}
          />
        )}

        {activeTab === 'dissection' && (
          <DissectionStudio
            onSaveToLibrary={handleSaveToLibrary}
            onSendToChat={(text) => handleSendMessage(text)}
            initialThought={dissectionInitialThought}
          />
        )}

        {activeTab === 'lab' && (
          <LogicDialecticLab
            onSaveToLibrary={handleSaveToLibrary}
            initialStressTestText={labInitialText}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicGenerator
            onSaveToLibrary={handleSaveToLibrary}
            onSendToStressTest={handleRouteToStressTest}
          />
        )}

        {activeTab === 'map' && (
          <ConceptMapViewer
            mapData={conceptMap}
            onUpdateMap={setConceptMap}
            onGenerateNewMap={handleGenerateNewConceptMap}
            isLoading={isMapLoading}
          />
        )}

        {activeTab === 'library' && (
          <PersonalLibrary
            items={libraryItems}
            onDeleteItem={handleDeleteLibraryItem}
            onAddItem={handleSaveToLibrary}
          />
        )}
      </main>
    </div>
  );
}
