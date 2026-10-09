/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Scale,
  Award,
  Network,
  Library,
  BookOpen,
  Sparkles,
  Info,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { PhilosophicalDialogue } from './components/PhilosophicalDialogue';
import { LogicDialecticLab } from './components/LogicDialecticLab';
import { AcademicGenerator } from './components/AcademicGenerator';
import { ConceptMapViewer } from './components/ConceptMapViewer';
import { PersonalLibrary } from './components/PersonalLibrary';
import {
  DialogueMessage,
  PhilosophicalPremise,
  LibraryItem,
  ConceptMapData,
} from './types/philosophical';

const STORAGE_KEYS = {
  MESSAGES: 'logos_dialogue_messages_v1',
  PREMISES: 'logos_system_premises_v1',
  LIBRARY: 'logos_personal_library_v1',
  CONCEPT_MAP: 'logos_concept_map_v1',
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
    statement: 'Realismo Estrutural: As leis teóricas da ciência capturam relações invariantes da realidade objetiva independente da mente.',
    category: 'Filosofia da Ciência',
    formalFormula: '$\\mathcal{R} \\models \\Sigma$',
    epistemicStatus: 'Conjetura Heurística',
    dateCreated: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'p3',
    statement: 'Incompatibilismo do Livre-Arbítrio: A deliberação consciente requer abertura genuína de contingência que o determinismo laplaciano anula.',
    category: 'Ontologia',
    epistemicStatus: 'Intuição Pré-Formal',
    dateCreated: new Date().toISOString(),
    isPinned: false,
  },
];

const INITIAL_CONCEPT_MAP: ConceptMapData = {
  theme: 'Arquitetura Fundacional do Logos',
  nodes: [
    {
      id: 'node_logic',
      label: 'Lógica Clássica',
      category: 'Axioma',
      definition: 'Estrutura dedutiva baseada em Identidade, Não-Contradição e Terceiro Excluído.',
      formula: '$\\neg(p \\land \\neg p)$',
      epistemicStatus: 'Fundacional',
    },
    {
      id: 'node_epistemology',
      label: 'Racionalismo Crítico',
      category: 'Conceito Central',
      definition: 'Submissão de conjecturas teóricas a testes implacáveis de falsificabilidade e coerência dedutiva.',
      formula: '$\\forall x (T(x) \\to O(x))$',
      epistemicStatus: 'Fundacional',
    },
    {
      id: 'node_ontology',
      label: 'Realismo Estrutural Ontológico',
      category: 'Desdobramento',
      definition: 'O que existe no mundo fundamental são estruturas e relações lógico-matemáticas invariantes.',
      epistemicStatus: 'Conjectural',
    },
    {
      id: 'node_crisis',
      label: 'Problema de Gettier',
      category: 'Tensão Crítica',
      definition: 'Crença verdadeira justificada não é condição estritamente suficiente para constituir conhecimento legítimo.',
      epistemicStatus: 'Problemático',
    },
    {
      id: 'node_synthesis',
      label: 'Sintese Dialética Sophia',
      category: 'Conclusão',
      definition: 'Integração contínua de novas intuições sob a disciplina dos axiomas formais e da falseabilidade.',
      epistemicStatus: 'Robusto',
    },
  ],
  edges: [
    { source: 'node_logic', target: 'node_epistemology', relation: 'fundamenta' },
    { source: 'node_epistemology', target: 'node_ontology', relation: 'implica' },
    { source: 'node_ontology', target: 'node_crisis', relation: 'limita' },
    { source: 'node_crisis', target: 'node_synthesis', relation: 'sintetiza' },
    { source: 'node_logic', target: 'node_synthesis', relation: 'necessita' },
  ],
};

const INITIAL_LIBRARY: LibraryItem[] = [
  {
    id: 'lib_init_1',
    title: 'Tese sobre a Inviolabilidade do Princípio de Não-Contradição',
    type: 'Tese Acadêmica',
    abstract: 'Demonstração de que qualquer tentativa de refutar o princípio de não-contradição já o pressupõe tacitamente em sua formulação dialética.',
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

### Conclusão e Horizontes
O Logos Institute conclui que o PNC não é uma preferência psicológica, mas a sintaxe mínima do cosmos inteligível.`,
    tags: ['Logica', 'Axiomatica', 'Aristoteles'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    epistemicStatus: 'Sistema Formalmente Robusto',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dialogue' | 'lab' | 'academic' | 'map' | 'library'>('dialogue');
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [premises, setPremises] = useState<PhilosophicalPremise[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [conceptMap, setConceptMap] = useState<ConceptMapData>(INITIAL_CONCEPT_MAP);
  const [isSending, setIsSending] = useState(false);
  const [labInitialText, setLabInitialText] = useState<string>('');
  const [isMapLoading, setIsMapLoading] = useState(false);

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

  // Dialogue actions
  const handleSendMessage = async (userText: string) => {
    const userMsg: DialogueMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsSending(true);

    try {
      const res = await fetch('/api/sophia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newHistory.map((m) => ({ role: m.role, content: m.content })),
          activePremises: premises,
        }),
      });

      const data = await res.json();
      const sophiaMsg: DialogueMessage = {
        id: `sophia_${Date.now()}`,
        role: 'sophia',
        content: data.reply || 'Sophia processou a consulta sob os princípios da razão.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, sophiaMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: DialogueMessage = {
        id: `sophia_${Date.now()}`,
        role: 'sophia',
        content:
          'Houve uma desconexão momentânea com os servidores do Logos Institute. Por favor, reenvie sua premissa.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Deseja reiniciar a sessão de diálogo com Sophia? A memória do sistema será mantida.')) {
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

    // Also link to concept map as an axiom node
    const newNode = {
      id: `node_${Date.now()}`,
      label: p.statement.slice(0, 35) + '...',
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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0c0a09] text-stone-100 overflow-hidden font-sans select-none">
      {/* Top Academic Header */}
      <header className="h-14 border-b border-stone-800/90 bg-[#120f0d] flex items-center justify-between px-6 z-30 shrink-0">
        {/* Brand & Chief Philosopher */}
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-900/40 border border-amber-500/50 flex items-center justify-center text-amber-300 font-classical font-extrabold text-base shadow-sm">
            Λ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-classical font-bold tracking-wider text-stone-100">
                LOGOS INSTITUTE
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-400 border border-amber-800/50">
                Sophia v3.8
              </span>
            </div>
            <p className="text-[10px] font-mono text-stone-400 hidden sm:block">
              Digital Philosophical Institution &bull; Razão Dedutiva e Rigor Epistemológico
            </p>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-stone-950/80 p-1 rounded-xl border border-stone-850">
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'dialogue'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Diálogo com Sophia</span>
            <span className="md:hidden">Diálogo</span>
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
            <span className="hidden md:inline">Laboratório Dialético</span>
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
            <span className="hidden md:inline">Escritório Acadêmico</span>
            <span className="md:hidden">Teses</span>
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
            <span className="hidden md:inline">Mapa Conceitual</span>
            <span className="md:hidden">Mapa</span>
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
            <span className="hidden md:inline">Biblioteca do Codex</span>
            <span className="md:hidden">Codex ({libraryItems.length})</span>
          </button>
        </nav>

        {/* Right Status Badge */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-stone-400 bg-stone-950/90 px-2.5 py-1 rounded-lg border border-stone-850">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Memória Ativa: {premises.length} Axiomas</span>
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
            onSendToStressTest={handleRouteToStressTest}
            onSendToFallacyAudit={handleRouteToFallacyAudit}
            onSendToCounterarguments={handleRouteToCounterarguments}
            onSaveToLibrary={handleSaveToLibrary}
            isSending={isSending}
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
