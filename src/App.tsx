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
  Scroll,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { PhilosophicalDialogue } from './components/PhilosophicalDialogue';
import { DissectionStudio } from './components/DissectionStudio';
import { LogicDialecticLab } from './components/LogicDialecticLab';
import { AcademicGenerator } from './components/AcademicGenerator';
import { ConceptMapViewer } from './components/ConceptMapViewer';
import { PersonalLibrary } from './components/PersonalLibrary';
import { CorpusPhilosophicum } from './components/CorpusPhilosophicum';
import {
  DialogueMessage,
  PhilosophicalPremise,
  LibraryItem,
  ConceptMapData,
  AudienceProfile,
  FontSizeMode,
  ThemeMode,
  CorpusRevision,
  IntellectualMilestone,
} from './types/philosophical';

const STORAGE_KEYS = {
  MESSAGES: 'logos_dialogue_messages_v2',
  PREMISES: 'logos_system_premises_v2',
  LIBRARY: 'logos_personal_library_v2',
  CONCEPT_MAP: 'logos_concept_map_v2',
  FONT_SIZE: 'logos_font_size_v2',
  THEME: 'logos_theme_v2',
  CORPUS_REVISIONS: 'logos_corpus_revisions_v2',
  INTELLECTUAL_MILESTONES: 'logos_intellectual_milestones_v2',
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
  {
    id: 'lib_init_stress_1',
    title: 'Teste de Estresse Dialético: Solipsismo Epistêmico vs. Realismo Racional',
    type: 'Teste de Estresse',
    abstract: 'Avaliação da resiliência lógica da tese contra o ceticismo radical e solipsismo sob as 7 dimensões do Instituto Logos.',
    content: `## Relatório de Teste de Estresse Sistêmico (7 Dimensões)

**Objeto do Teste:** Tese do Realismo Racional versus Solipsismo Epistêmico
**Escola de Avaliação:** Lógica Formal e Racionalismo Crítico

### 1. Pressupostos Ocultos (Hidden Assumptions)
- A existência de leis lógicas objetivas pressupõe que o próprio pensamento não é mera alucinação arbitrária.
- O ato de duvidar pressupõe um padrão de verdade em relação ao qual a dúvida adquire sentido inteligível.

### 2. Erros de Categoria (Category Errors)
- Confundir a impossibilidade psicológica de certeza empírica imediata com a impossibilidade lógica de consistência objetiva.

### 3. Objeções Mais Fortes (Strongest Counterarguments)
- O argumento do ceticismo pirrônico radical e a regressão infinita de justificativas (*Trilema de Agripa*).

### 4. Poder Explicativo (Explanatory Power)
- O Realismo Racional explica com elegância a convergência científica intersubjetiva e o sucesso preditivo da matemática formal.

### 5. Poder Preditivo (Predictive Power)
- Antecipa que qualquer agente racional capaz de deliberação intencional converge para as mesmas regras transcendentais de não-contradição.

### 6. Coerência Interna (Internal Coherence)
- O solipsismo incorre em contradição performativa ao tentar comunicar formalmente sua própria tese a outros interlocutores.

### 7. Veredito de Estabilidade Epistêmica
- **Classificação:** Axioma Robusto com Tensão Solúvel
- **Recomendação Metodológica:** Preservar a distinção entre a certeza do cogito e a construtibilidade do mundo exterior.`,
    tags: ['TesteDeEstresse', 'Epistemologia', 'Logica', 'Axiomatica'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    epistemicStatus: 'Problemático / Refutado',
  },
];

const INITIAL_MILESTONES: IntellectualMilestone[] = [
  {
    id: 'm1',
    type: 'Axioma Postulado',
    title: 'Axiomatização do Princípio de Não-Contradição',
    description: 'Postulado clássico de base formal para sustentar o raciocínio dedutivo no Logos: ¬(P ∧ ¬P).',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'm2',
    type: 'Tese Formulada',
    title: 'Redação da Tese sobre a Inviolabilidade do PNC',
    description: 'Demonstração axiomática contra o dialeteísmo irrestrito arquivada no Corpus.',
    timestamp: new Date().toISOString(),
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dialogue' | 'corpus' | 'dissection' | 'lab' | 'academic' | 'map' | 'library'>('dialogue');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lazy state initializers to load synchronously and prevent overwrites
  const [messages, setMessages] = useState<DialogueMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [premises, setPremises] = useState<PhilosophicalPremise[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREMISES);
      return stored ? JSON.parse(stored) : INITIAL_PREMISES;
    } catch {
      return INITIAL_PREMISES;
    }
  });

  const [corpusRevisions, setCorpusRevisions] = useState<CorpusRevision[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CORPUS_REVISIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [milestones, setMilestones] = useState<IntellectualMilestone[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTELLECTUAL_MILESTONES);
      return stored ? JSON.parse(stored) : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      if (stored) {
        let items: LibraryItem[] = JSON.parse(stored);
        // Automatically prune duplicate stress tests if user had multiple, keeping only 1 as requested
        const stressTests = items.filter((i) => i.type === 'Teste de Estresse');
        if (stressTests.length > 1) {
          const keepId = stressTests[0].id;
          items = items.filter((i) => i.type !== 'Teste de Estresse' || i.id === keepId);
          try {
            localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
          } catch {}
        }
        return items;
      }
    } catch {}
    return INITIAL_LIBRARY;
  });

  const [conceptMap, setConceptMap] = useState<ConceptMapData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONCEPT_MAP);
      return stored ? JSON.parse(stored) : INITIAL_CONCEPT_MAP;
    } catch {
      return INITIAL_CONCEPT_MAP;
    }
  });

  const [isSending, setIsSending] = useState(false);
  const [dissectionInitialThought, setDissectionInitialThought] = useState<string>('');
  const [labInitialText, setLabInitialText] = useState<string>('');
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Accessibility & Preferences for all age groups
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
      if (stored) return stored as FontSizeMode;
    } catch {}
    return 'normal';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored) return stored as ThemeMode;
    } catch {}
    return 'slate';
  });

  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile>('Auto (Dedução Dinâmica)');

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
      localStorage.setItem(STORAGE_KEYS.CORPUS_REVISIONS, JSON.stringify(corpusRevisions));
    } catch {}
  }, [corpusRevisions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTELLECTUAL_MILESTONES, JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

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
          intellectualLineage: milestones,
          corpusRevisions: corpusRevisions,
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
    setMessages([]);
  };

  const handleAddPremise = (p: Omit<PhilosophicalPremise, 'id' | 'dateCreated'>) => {
    const newPremise: PhilosophicalPremise = {
      ...p,
      id: `p_${Date.now()}`,
      dateCreated: new Date().toISOString(),
    };
    setPremises((prev) => [newPremise, ...prev]);

    // Link to intellectual lineage in Corpus
    const newMilestone: IntellectualMilestone = {
      id: `ms_${Date.now()}`,
      type: 'Axioma Postulado',
      title: p.statement.slice(0, 42) + '...',
      description: `Axioma (${p.category}) cadastrado no acervo do Logos.`,
      timestamp: new Date().toISOString(),
    };
    setMilestones((prev) => [newMilestone, ...prev]);

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

  const handleUpdatePremise = (id: string, updated: Partial<PhilosophicalPremise>) => {
    setPremises((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const handleAddRevision = (rev: CorpusRevision) => {
    setCorpusRevisions((prev) => [rev, ...prev]);
    const milestone: IntellectualMilestone = {
      id: `ms_rev_${Date.now()}`,
      type: 'Revisão Epistêmica',
      title: `Revisão ${rev.version}: ${rev.targetTitle}`,
      description: rev.rationale,
      timestamp: new Date().toISOString(),
    };
    setMilestones((prev) => [milestone, ...prev]);
  };

  const handleRemovePremise = (id: string) => {
    setPremises((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveToLibrary = (item: LibraryItem) => {
    setLibraryItems((prev) => [item, ...prev]);
    const milestone: IntellectualMilestone = {
      id: `ms_lib_${Date.now()}`,
      type: item.type === 'Teste de Estresse' ? 'Teste Concluído' : 'Tese Formulada',
      title: item.title,
      description: item.abstract || `Documento ${item.type} incorporado à Biblioteca.`,
      timestamp: new Date().toISOString(),
      referenceId: item.id,
    };
    setMilestones((prev) => [milestone, ...prev]);
  };

  const handleDeleteLibraryItem = (id: string) => {
    setLibraryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handlePruneLibraryStressTests = (keepId: string) => {
    setLibraryItems((prev) => {
      const others = prev.filter((item) => item.type === 'Teste de Estresse' && item.id !== keepId);
      const otherIds = new Set(others.map((i) => i.id));
      const updated = prev.filter((item) => !otherIds.has(item.id));
      try {
        localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
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

  const NAV_ITEMS = [
    { id: 'dialogue', label: 'Diálogo', fullLabel: 'Diálogo Filosófico', icon: <MessageSquare className="w-3.5 h-3.5" />, desc: 'Mentoria dialética, acolhimento e reflexão com Sophia' },
    { id: 'corpus', label: 'Corpus', fullLabel: 'Corpus Filosófico', icon: <Scroll className="w-3.5 h-3.5" />, desc: 'Memória viva, acervo canônico e linhagem intelectual' },
    { id: 'dissection', label: 'Dissecar', fullLabel: 'Dissecadora', icon: <Scissors className="w-3.5 h-3.5" />, desc: 'Análise de nós lógicos e pressupostos ontológicos' },
    { id: 'lab', label: 'Laboratório', fullLabel: 'Laboratório', icon: <Scale className="w-3.5 h-3.5" />, desc: 'Testes de estresse sistêmico e auditoria de falácias' },
    { id: 'academic', label: 'Oficina', fullLabel: 'Oficina de Escrita', icon: <Award className="w-3.5 h-3.5" />, desc: 'Redação de teses, ensaios e manifestos' },
    { id: 'map', label: 'Árvore', fullLabel: 'Árvore do Saber', icon: <Network className="w-3.5 h-3.5" />, desc: 'Mapa conceitual interativo e conexões epistêmicas' },
    { id: 'library', label: 'Biblioteca', fullLabel: 'Biblioteca do Logos', icon: <Library className="w-3.5 h-3.5" />, desc: 'Acervo pessoal com tratados salvos e backup JSON' },
  ] as const;

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none reading-ease ${fontClass} ${themeClass}`}>
      {/* Top Academic & Educational Header */}
      <header className={`h-14 sm:h-15 border-b px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 ${headerBgClass}`}>
        {/* Brand & Chief Philosopher */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-700/40 border border-amber-500/40 flex items-center justify-center text-amber-300 font-classical font-extrabold text-base shrink-0 shadow-sm">
            Λ
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-xs sm:text-sm font-classical font-bold tracking-wider text-amber-400 truncate">
                LOGOS INSTITUTE
              </h1>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/50 shrink-0">
                Sophia
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden lg:block truncate">
              Sabedoria e Razão Clara &bull; Para todas as idades (de mamando a caducando)
            </p>
          </div>
        </div>

        {/* Central Navigation Tabs (Desktop: visible on lg screens and up) */}
        <nav className="hidden lg:flex items-center space-x-1 bg-stone-950/70 p-1 rounded-xl border border-stone-850">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                {item.icon}
                <span>
                  {item.id === 'library' ? `Biblioteca (${libraryItems.length})` : item.fullLabel}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Accessibility & Comfort Controls + Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
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
              title="Fonte Generosa (Acessibilidade)"
            >
              A+
            </button>
          </div>

          {/* Theme Mode Toggle (Tablet & Desktop) */}
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

          {/* Mobile Menu Trigger Button (Visible on screens below lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition flex items-center justify-center shadow-sm"
            title="Menu Completo"
            aria-label="Abrir Menu de Navegação"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-amber-400" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Swipeable Subnav (Always accessible on mobile for 1-tap switching) */}
      <nav className="lg:hidden shrink-0 border-b border-stone-850/90 bg-stone-950/95 px-2 py-1.5 overflow-x-auto no-scrollbar flex items-center space-x-1.5 z-20">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800/60'
              }`}
            >
              {item.icon}
              <span>{item.id === 'library' ? `Codex (${libraryItems.length})` : item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Navigation Drawer / Full Menu Modal */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-4 border-b border-stone-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-classical font-bold text-sm">
                Λ
              </div>
              <div>
                <h3 className="text-sm font-classical font-bold text-stone-100">Instituto Logos</h3>
                <p className="text-[10px] text-stone-400">Sophia • Filósofa Educadora</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-800"
              aria-label="Fechar menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 mb-2 px-1">
                Seções do Instituto Logos
              </p>
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition text-left ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-stone-900/60 border-stone-800/70 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-stone-100">
                            {item.id === 'library' ? `Biblioteca (${libraryItems.length})` : item.fullLabel}
                          </p>
                          <p className="text-[10px] text-stone-400 line-clamp-1">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading and Theme Settings in Mobile Menu */}
            <div className="pt-2 border-t border-stone-800/80 space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 px-1">
                Tema do Instituto
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setThemeMode('slate')}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col items-center space-y-1 transition ${
                    themeMode === 'slate' ? 'bg-stone-900 border-amber-500 text-amber-300 font-bold' : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-[10px]">Ardósia</span>
                </button>
                <button
                  onClick={() => setThemeMode('parchment')}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col items-center space-y-1 transition ${
                    themeMode === 'parchment' ? 'bg-[#f4efe4] border-amber-600 text-stone-900 font-bold' : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-700" />
                  <span className="text-[10px]">Pergaminho</span>
                </button>
                <button
                  onClick={() => setThemeMode('twilight')}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col items-center space-y-1 transition ${
                    themeMode === 'twilight' ? 'bg-[#181424] border-amber-500 text-amber-200 font-bold' : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-[10px]">Crepúsculo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 p-2 sm:p-3 overflow-hidden">
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

        {activeTab === 'corpus' && (
          <CorpusPhilosophicum
            premises={premises}
            revisions={corpusRevisions}
            milestones={milestones}
            libraryItems={libraryItems}
            onAddPremise={handleAddPremise}
            onUpdatePremise={handleUpdatePremise}
            onAddRevision={handleAddRevision}
            onSendToDialogue={(text) => {
              handleSendMessage(text);
              setActiveTab('dialogue');
            }}
            onSendToStressTest={(text) => {
              handleRouteToStressTest(text);
            }}
            onSaveToLibrary={handleSaveToLibrary}
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
            libraryItems={libraryItems}
            onDeleteItem={handleDeleteLibraryItem}
            onAddItem={handleSaveToLibrary}
            onPruneStressTests={handlePruneLibraryStressTests}
          />
        )}
      </main>
    </div>
  );
}
