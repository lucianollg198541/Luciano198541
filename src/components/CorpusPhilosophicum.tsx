import React, { useState } from 'react';
import {
  Compass,
  History,
  GitBranch,
  ShieldAlert,
  BookOpen,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Send,
  Layers,
  FileText,
  Clock,
  HelpCircle,
  ExternalLink,
  Tag,
  RefreshCw,
  BookMarked,
  Scroll,
} from 'lucide-react';
import {
  PhilosophicalPremise,
  CorpusRevision,
  HistoricalTradition,
  EpistemicTension,
  LibraryItem,
  IntellectualMilestone,
  EpistemicStatus,
} from '../types/philosophical';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';

interface Props {
  premises: PhilosophicalPremise[];
  revisions: CorpusRevision[];
  milestones: IntellectualMilestone[];
  libraryItems: LibraryItem[];
  onAddPremise: (premise: Omit<PhilosophicalPremise, 'id' | 'dateCreated'>) => void;
  onUpdatePremise: (id: string, updated: Partial<PhilosophicalPremise>) => void;
  onAddRevision: (revision: CorpusRevision) => void;
  onSendToDialogue: (text: string) => void;
  onSendToStressTest: (text: string) => void;
  onSaveToLibrary: (item: LibraryItem) => void;
}

const HISTORICAL_CANON: HistoricalTradition[] = [
  {
    id: 'canon_socrates_plato',
    name: 'Maiêutica Socrática & Teoria das Ideias',
    school: 'Platonismo Clássico',
    period: 'Atenas Clássica (séc. V–IV a.C.)',
    corePrinciple: 'Uma vida sem exame não merece ser vivida; as coisas sensíveis participam de formas perfeitas e inteligíveis.',
    canonicalFormula: '\\text{Ideia}(F) \\models F(x)',
    fundamentalThesis: 'O conhecimento genuíno não é acúmulo de opiniões (doxa), mas a recordação racional e o discernimento da essência perene das coisas.',
    educationalAnalogy: 'Assim como uma parteira ajuda a mãe a dar à luz um bebê que já estava ali, o diálogo maiêutico ajuda a mente a parir a verdade que já habitava seu íntimo.',
    keyAuthors: ['Sócrates', 'Platão'],
  },
  {
    id: 'canon_aristotle',
    name: 'Axiomática & O Órganon Lógico',
    school: 'Aristotelismo',
    period: 'Liceu de Atenas (séc. IV a.C.)',
    corePrinciple: 'O Princípio de Não-Contradição é o axioma fundacional e transcendental de todo discurso e ser.',
    canonicalFormula: '\\neg (P \\land \\neg P)',
    fundamentalThesis: 'É impossível que o mesmo predicado pertença e não pertença ao mesmo sujeito sob o mesmo aspecto e no mesmo tempo.',
    educationalAnalogy: 'Não é possível que uma porta esteja inteiramente trancada e inteiramente aberta no mesmíssimo segundo; sem esta certeza, nenhuma palavra teria sentido.',
    keyAuthors: ['Aristóteles'],
  },
  {
    id: 'canon_stoicism',
    name: 'Dicotomia do Controle & Razão Serena',
    school: 'Estoicismo Imperial',
    period: 'Roma Helenística (séc. I–II d.C.)',
    corePrinciple: 'Dentre as coisas do mundo, algumas estão sob nosso governo; outras, não. A virtude é a conformidade com a Razão Cósmica (Logos).',
    canonicalFormula: '\\text{Liberdade} = \\text{Controle}(\\text{Juízos}) \\land \\text{Aceitação}(\\text{Fatum})',
    fundamentalThesis: 'Não são os fatos externos que perturbam a alma humana, mas o juízo apressado que a mente constrói a respeito deles.',
    educationalAnalogy: 'Um barquinho não pode mandar no vento da tempestade, mas o timoneiro sábio pode regular perfeitamente as velas para nunca naufragar.',
    keyAuthors: ['Sêneca', 'Epicteto', 'Marco Aurélio'],
  },
  {
    id: 'canon_descartes',
    name: 'Racionalismo & Dúvida Metódica',
    school: 'Cartesianismo',
    period: 'Século XVII (Idade Moderna)',
    corePrinciple: 'Cogito, ergo sum: a dúvida hiperbólica atesta infalivelmente a existência da substância pensante.',
    canonicalFormula: '\\text{Dubito} \\to \\text{Cogito} \\to \\text{Sum}',
    fundamentalThesis: 'Ainda que os sentidos nos enganem, o ato de duvidar exige uma consciência que duvida, constituindo o ponto arquimediano de certeza.',
    educationalAnalogy: 'Se uma cesta de maçãs pode conter frutos podres, o cozinheiro cuidadoso esvazia a cesta inteira para recolocar apenas as maçãs rigorosamente sãs.',
    keyAuthors: ['René Descartes'],
  },
  {
    id: 'canon_kant',
    name: 'Criticismo Epistemológico & Dever Moral',
    school: 'Idealismo Transcendental',
    period: 'Iluminismo Alemão (séc. XVIII)',
    corePrinciple: 'Conhecemos os fenômenos através das formas a priori da sensibilidade e categorias do entendimento; age de tal modo que tua máxima se torne lei universal.',
    canonicalFormula: '\\text{Conhecimento} = \\text{Intuições Sensíveis} + \\text{Conceitos Puros}',
    fundamentalThesis: 'Pensamentos sem conteúdo são vazios; intuições sem conceitos são cegas.',
    educationalAnalogy: 'Usamos óculos transparentes cujas lentes têm a cor do espaço e do tempo; nunca vemos o mundo sem essas lentes que a nossa mente humana impõe à experiência.',
    keyAuthors: ['Immanuel Kant'],
  },
  {
    id: 'canon_frege_russell',
    name: 'Lógica Simbólica & Filosofia Analítica',
    school: 'Filosofia Analítica',
    period: 'Séculos XIX–XX',
    corePrinciple: 'A clarificação lógica da linguagem elimina falsos problemas metafísicos; distinção estrita entre sentido (Sinn) e referência (Bedeutung).',
    canonicalFormula: '\\forall x (P(x) \\to Q(x))',
    fundamentalThesis: 'A maioria dos paradoxos filosóficos decorre de armadilhas gramaticais da linguagem ordinária disfarçadas de problemas ontológicos.',
    educationalAnalogy: 'Um microscópio potente nos revela que o que parecia poeira numa mesa é, na verdade, uma estrutura cristalina regular; a lógica formal é o microscópio da mente.',
    keyAuthors: ['Gottlob Frege', 'Bertrand Russell', 'Ludwig Wittgenstein'],
  },
  {
    id: 'canon_popper',
    name: 'Racionalismo Crítico & Falsificabilidade',
    school: 'Filosofia da Ciência',
    period: 'Século XX',
    corePrinciple: 'O critério de cientificidade de uma teoria é a sua capacidade de ser testada e refutada por experimentos cruciais.',
    canonicalFormula: '(\\exists x (\\neg P(x))) \\vdash \\neg \\forall y P(y)',
    fundamentalThesis: 'Nenhum número de cisnes brancos observados basta para provar que todos os cisnes são brancos; basta um único cisne negro para refutar a tese.',
    educationalAnalogy: 'Uma espada de metal só prova sua têmpera se for batida contra uma pedra; se uma ideia foge de qualquer teste de realidade, ela não é conhecimento, é dogma.',
    keyAuthors: ['Karl Popper'],
  },
];

export const CorpusPhilosophicum: React.FC<Props> = ({
  premises,
  revisions,
  milestones,
  libraryItems,
  onAddPremise,
  onUpdatePremise,
  onAddRevision,
  onSendToDialogue,
  onSendToStressTest,
  onSaveToLibrary,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lineage' | 'revisions' | 'canon' | 'tensions'>('lineage');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Premise Form State
  const [isAddingPremise, setIsAddingPremise] = useState(false);
  const [newStatement, setNewStatement] = useState('');
  const [newCategory, setNewCategory] = useState<PhilosophicalPremise['category']>('Ontologia');
  const [newFormula, setNewFormula] = useState('');
  const [newStatus, setNewStatus] = useState<EpistemicStatus>('Conjetura Heurística');

  // Revision Synthesis State
  const [revisionTarget, setRevisionTarget] = useState<PhilosophicalPremise | null>(null);
  const [proposedDirection, setProposedDirection] = useState('');
  const [revisionRationale, setRevisionRationale] = useState('');
  const [isSynthesizingRevision, setIsSynthesizingRevision] = useState(false);
  const [synthesizedDoc, setSynthesizedDoc] = useState<string | null>(null);

  // Epistemic Tension Audit State
  const [isAuditingTensions, setIsAuditingTensions] = useState(false);
  const [tensionReport, setTensionReport] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePremise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    onAddPremise({
      statement: newStatement.trim(),
      category: newCategory,
      formalFormula: newFormula.trim() || undefined,
      epistemicStatus: newStatus,
    });

    setNewStatement('');
    setNewFormula('');
    setIsAddingPremise(false);
    showToast('Axioma postulado e integrado ao Corpus Filosófico.');
  };

  const handleAdoptCanon = (tradition: HistoricalTradition) => {
    onAddPremise({
      statement: tradition.corePrinciple,
      category: tradition.school.includes('Lógica') ? 'Lógica Formal' : 'Epistemologia',
      formalFormula: tradition.canonicalFormula,
      epistemicStatus: 'Sistema Formalmente Robusto',
      notes: `Herdado do Cânone: ${tradition.name} (${tradition.period})`,
    });
    showToast(`Princípio de "${tradition.name}" incorporado à sua linhagem intelectual.`);
  };

  const handleRunTensionAudit = async () => {
    if (premises.length === 0) {
      showToast('Cadastre ao menos 1 axioma para auditar tensões sistêmicas.');
      return;
    }

    setIsAuditingTensions(true);
    setTensionReport(null);
    try {
      const res = await fetch('/api/sophia/tension-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          premises,
          libraryTheses: libraryItems.filter((i) => i.type === 'Tese Acadêmica' || i.type === 'Ensaio Acadêmico'),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha na auditoria.');
      setTensionReport(data.report);
      showToast('Auditoria de tensões epistêmicas concluída por Sophia.');
    } catch (err: any) {
      setTensionReport(`**Aviso:** ${err?.message || 'Erro ao conectar ao servidor do Logos.'}`);
    } finally {
      setIsAuditingTensions(false);
    }
  };

  const handleSynthesizeRevision = async () => {
    if (!revisionTarget) return;

    setIsSynthesizingRevision(true);
    setSynthesizedDoc(null);
    try {
      const res = await fetch('/api/sophia/revision-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalStatement: revisionTarget.statement,
          proposedChange: proposedDirection,
          rationale: revisionRationale,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha ao sintetizar revisão.');
      setSynthesizedDoc(data.revisionDoc);
    } catch (err: any) {
      setSynthesizedDoc(`**Erro:** ${err?.message || 'Falha ao processar síntese.'}`);
    } finally {
      setIsSynthesizingRevision(false);
    }
  };

  const handleApplySynthesizedRevision = () => {
    if (!revisionTarget || !proposedDirection.trim()) return;

    const newRev: CorpusRevision = {
      id: `rev_${Date.now()}`,
      targetId: revisionTarget.id,
      targetTitle: revisionTarget.statement.slice(0, 40) + '...',
      version: `v${(revisions.length + 1).toFixed(1)}`,
      previousFormulation: revisionTarget.statement,
      newFormulation: proposedDirection.trim(),
      rationale: revisionRationale.trim() || 'Refinamento epistêmico e precisão lógica orientada por Sophia.',
      epistemicDelta: 'Aprimoramento Conceitual Sistêmico',
      timestamp: new Date().toISOString(),
    };

    onAddRevision(newRev);

    // Update active premise statement
    onUpdatePremise(revisionTarget.id, {
      statement: proposedDirection.trim(),
      epistemicStatus: 'Tese Axiomatizada',
    });

    // Save as a document in Library
    if (synthesizedDoc) {
      onSaveToLibrary({
        id: `lib_rev_${Date.now()}`,
        title: `Revisão Conceitual: ${revisionTarget.statement.slice(0, 36)}...`,
        type: 'Tese Acadêmica',
        abstract: `Registro histórico de evolução e refinação formal no Corpus Filosófico Logos (${newRev.version}).`,
        content: synthesizedDoc,
        tags: ['CorpusLogos', 'RevisaoFormal', 'LinhagemIntelectual'],
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        epistemicStatus: 'Tese Axiomatizada',
      });
    }

    setRevisionTarget(null);
    setProposedDirection('');
    setRevisionRationale('');
    setSynthesizedDoc(null);
    showToast('Revisão formal registrada com sucesso na linhagem do Corpus.');
  };

  return (
    <div className="relative flex flex-col h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-900/95 border border-amber-500/40 text-stone-100 shadow-2xl text-xs backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 border-b border-stone-800 bg-stone-900/50 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-classical font-bold text-stone-100 flex items-center space-x-2">
                <span>Corpus Filosófico Logos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  Memória Histórica Viva
                </span>
              </h1>
              <p className="text-xs text-stone-400">
                Acervo de tradições clássicas, linhagem de axiomas e registro de evolução conceitual de Sophia.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center space-x-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('lineage')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'lineage'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Linhagem ({premises.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('revisions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'revisions'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Revisões ({revisions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('canon')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'canon'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cânone Clássico ({HISTORICAL_CANON.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tensions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubTab === 'tensions'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Auditoria de Tensões</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* SUBTAB 1: LINHAGEM INTELECTUAL & AXIOMAS VIVOS */}
        {activeSubTab === 'lineage' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-classical font-semibold text-stone-100">
                  Linhagem Axiomática do Interlocutor
                </h2>
                <p className="text-xs text-stone-400">
                  Estes postulados constituem a memória ontológica ativa que Sophia consulta para orientar raciocínios e detectar contradições.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPremise(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Postular Novo Axioma</span>
              </button>
            </div>

            {/* Premise List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premises.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        Axioma #{idx + 1} &bull; {p.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {p.epistemicStatus}
                      </span>
                    </div>

                    <p className="text-sm font-classical font-semibold text-stone-100 leading-snug">
                      "{p.statement}"
                    </p>

                    {p.formalFormula && (
                      <div className="p-2 rounded bg-stone-950 border border-stone-850 text-xs font-mono text-amber-300">
                        {p.formalFormula}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSendToDialogue(`Como o postulado "${p.statement}" sustenta nosso raciocínio dialético?`)}
                      className="text-stone-400 hover:text-amber-400 flex items-center space-x-1 transition"
                      title="Debater este axioma com Sophia no Diálogo"
                    >
                      <Send className="w-3 h-3" />
                      <span>Debater com Sophia</span>
                    </button>

                    <button
                      onClick={() => {
                        setRevisionTarget(p);
                        setProposedDirection(p.statement);
                        setActiveSubTab('revisions');
                      }}
                      className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition"
                      title="Formalizar uma nova versão deste axioma"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>Formalizar Revisão</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline of Intellectual Milestones */}
            <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-850 space-y-4">
              <h3 className="text-sm font-classical font-semibold text-stone-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Marcos do Desenvolvimento Intelectual</span>
              </h3>

              {milestones.length === 0 ? (
                <p className="text-xs text-stone-500 italic">
                  Conforme você postular princípios, redigir teses ou formalizar revisões com Sophia, esta linha do tempo documentará sua genealogia filosófica.
                </p>
              ) : (
                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-start space-x-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-stone-200">{m.title}</span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {new Date(m.timestamp).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-stone-400 mt-0.5">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: REGISTRO DE REVISÕES FORMAIS */}
        {activeSubTab === 'revisions' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-base font-classical font-semibold text-stone-100">
                Genealogia e Revisões Formais do Pensamento
              </h2>
              <p className="text-xs text-stone-400">
                Filosofar é saber rever postulados diante de novas evidências sem perder a solidez lógica. Aqui você formaliza revisões históricas com a mentoria de Sophia.
              </p>
            </div>

            {/* Revision Workspace Form */}
            <div className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-4">
              <h3 className="text-sm font-classical font-semibold text-amber-300 flex items-center space-x-2">
                <GitBranch className="w-4 h-4" />
                <span>Laboratório de Revisão Epistêmica</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Postulado sob Revisão:
                  </label>
                  {revisionTarget ? (
                    <div className="p-3 rounded-lg bg-stone-950 border border-amber-500/40 text-xs text-stone-200 flex items-center justify-between">
                      <span>"{revisionTarget.statement}"</span>
                      <button
                        onClick={() => setRevisionTarget(null)}
                        className="text-stone-400 hover:text-stone-200 text-[11px]"
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => {
                        const target = premises.find((p) => p.id === e.target.value);
                        if (target) {
                          setRevisionTarget(target);
                          setProposedDirection(target.statement);
                        }
                      }}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Selecione um axioma existente para revisar...</option>
                      {premises.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.statement.slice(0, 70)}...
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Nova Redação Proposta (Direção do Refinamento):
                  </label>
                  <textarea
                    rows={2}
                    value={proposedDirection}
                    onChange={(e) => setProposedDirection(e.target.value)}
                    placeholder="Ex: Refinar a validade para excluir dialeteísmos ou delimitar o escopo semântico..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Motivação Racional da Mudança (Por que a versão anterior gerou tensão?):
                  </label>
                  <input
                    type="text"
                    value={revisionRationale}
                    onChange={(e) => setRevisionRationale(e.target.value)}
                    placeholder="Ex: Resolver aparente atrito com a teoria da relatividade ou com o livre-arbítrio..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 placeholder-stone-600"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    disabled={!revisionTarget || !proposedDirection.trim() || isSynthesizingRevision}
                    onClick={handleSynthesizeRevision}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 disabled:opacity-40 transition shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSynthesizingRevision ? 'Sophia analisando...' : 'Pedir Síntese Formal a Sophia'}</span>
                  </button>
                </div>
              </div>

              {/* Synthesized Output */}
              {synthesizedDoc && (
                <div className="mt-4 p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300">
                      Demonstração da Revisão Formal por Sophia:
                    </span>
                    <button
                      onClick={handleApplySynthesizedRevision}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Formalizar Revisão no Corpus</span>
                    </button>
                  </div>
                  <PhilosophicalMarkdown content={synthesizedDoc} />
                </div>
              )}
            </div>

            {/* Past Recorded Revisions */}
            <div className="space-y-3">
              <h3 className="text-sm font-classical font-semibold text-stone-200">
                Histórico de Revisões Consagradas
              </h3>

              {revisions.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-4 rounded-xl bg-stone-900/30 border border-stone-850">
                  Nenhuma revisão formal registrada ainda. Quando um postulado amadurece, a versão anterior é arquivada e o salto epistêmico é catalogado.
                </p>
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">
                        {rev.version} &bull; {rev.targetTitle}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(rev.timestamp).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 rounded bg-stone-950 border border-stone-850">
                      <div>
                        <span className="text-[10px] text-rose-400 block font-semibold">Formulação Anterior:</span>
                        <p className="text-stone-400 text-[11px] line-through mt-0.5">{rev.previousFormulation}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block font-semibold">Nova Formulação Consagrada:</span>
                        <p className="text-stone-200 text-[11px] font-medium mt-0.5">{rev.newFormulation}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400">
                      <strong className="text-stone-300">Justificativa:</strong> {rev.rationale}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: CÂNONE CLÁSSICO DAS TRADIÇÕES */}
        {activeSubTab === 'canon' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-base font-classical font-semibold text-stone-100">
                Cânone Filosófico Perene
              </h2>
              <p className="text-xs text-stone-400">
                Grandes tradições do pensamento humano. Cada postulado conta com formulação canônica e uma analogia pedagógica para ensinar com clareza a todas as faixas etárias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HISTORICAL_CANON.map((tradition) => (
                <div
                  key={tradition.id}
                  className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                        {tradition.period}
                      </span>
                      <span className="text-xs font-serif italic text-amber-300">
                        {tradition.keyAuthors.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-base font-classical font-bold text-stone-100">
                      {tradition.name}
                    </h3>

                    <p className="text-xs text-stone-300 font-scholarly leading-relaxed">
                      {tradition.fundamentalThesis}
                    </p>

                    {/* Educational Analogy ("mamando a caducando") */}
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs space-y-1">
                      <span className="text-[10px] font-semibold text-amber-300 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Analogia Pedagógica Universal:</span>
                      </span>
                      <p className="text-stone-300 text-[11px] leading-relaxed italic">
                        "{tradition.educationalAnalogy}"
                      </p>
                    </div>

                    {tradition.canonicalFormula && (
                      <div className="p-2 rounded bg-stone-950 border border-stone-850 text-xs font-mono text-amber-300 text-center">
                        {tradition.canonicalFormula}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => onSendToDialogue(`Explique para mim a tradição de ${tradition.name} usando uma conversa acolhedora e agradável.`)}
                      className="text-xs text-stone-400 hover:text-amber-400 flex items-center space-x-1 transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dialogar com Sophia</span>
                    </button>

                    <button
                      onClick={() => handleAdoptCanon(tradition)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-stone-950 border border-amber-500/40 transition"
                    >
                      Adotar no Meu Acervo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: AUDITORIA DE TENSÕES EPISTÊMICAS */}
        {activeSubTab === 'tensions' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-classical font-semibold text-stone-100">
                  Auditoria de Tensões Epistêmicas
                </h2>
                <p className="text-xs text-stone-400">
                  Sophia examina a coerência de todos os seus axiomas em conjunto, apontando atritos dialéticos e caminhos de síntese (Aufhebung).
                </p>
              </div>

              <button
                disabled={isAuditingTensions || premises.length === 0}
                onClick={handleRunTensionAudit}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 disabled:opacity-40 transition shadow-sm self-start md:self-auto"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isAuditingTensions ? 'Auditoria em curso...' : 'Executar Auditoria de Coerência'}</span>
              </button>
            </div>

            {/* Current Premises Being Evaluated */}
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-850 space-y-2">
              <span className="text-xs font-semibold text-stone-300">
                Axiomas Atualmente Submetidos ao Teste de Coerência Mútua ({premises.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {premises.map((p, i) => (
                  <span
                    key={p.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300"
                  >
                    #{i + 1} {p.statement.slice(0, 35)}...
                  </span>
                ))}
              </div>
            </div>

            {/* Report */}
            {tensionReport ? (
              <div className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <h3 className="text-sm font-classical font-bold text-amber-300 flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span>Relatório de Coerência e Harmonização Sistêmica</span>
                  </h3>
                  <button
                    onClick={() => {
                      onSaveToLibrary({
                        id: `audit_${Date.now()}`,
                        title: `Auditoria de Tensões Epistêmicas no Corpus`,
                        type: 'Teste de Estresse',
                        abstract: 'Exame de coerência global e síntese dialética dos axiomas fundacionais.',
                        content: tensionReport,
                        tags: ['CorpusLogos', 'TensaoEpistemica', 'Aufhebung'],
                        dateCreated: new Date().toISOString(),
                        dateModified: new Date().toISOString(),
                      });
                      showToast('Relatório de auditoria salvo na Biblioteca.');
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition"
                  >
                    Salvar na Biblioteca
                  </button>
                </div>

                <PhilosophicalMarkdown content={tensionReport} />
              </div>
            ) : (
              <div className="p-12 text-center text-stone-500 rounded-2xl bg-stone-900/20 border border-stone-850">
                <Scale className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-400" />
                <h4 className="text-sm font-classical font-semibold text-stone-300">
                  Nenhuma auditoria executada recentemente
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Clique em "Executar Auditoria de Coerência" para que Sophia examine todos os seus postulados em busca de antinomias ou divergências conceituais.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Custom Premise */}
      {isAddingPremise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-classical font-bold text-stone-100">
              Postular Novo Axioma no Corpus
            </h3>

            <form onSubmit={handleCreatePremise} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Enunciado Canônico do Princípio:
                </label>
                <textarea
                  rows={2}
                  required
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="Ex: Todo efeito contingente requer uma razão suficiente..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Categoria Ontológica:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                  >
                    <option value="Ontologia">Ontologia</option>
                    <option value="Epistemologia">Epistemologia</option>
                    <option value="Lógica Formal">Lógica Formal</option>
                    <option value="Filosofia da Ciência">Filosofia da Ciência</option>
                    <option value="Ética / Axiologia">Ética / Axiologia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Grau de Certeza:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                  >
                    <option value="Intuição Pré-Formal">Intuição Pré-Formal</option>
                    <option value="Conjetura Heurística">Conjetura Heurística</option>
                    <option value="Tese Axiomatizada">Tese Axiomatizada</option>
                    <option value="Sistema Formalmente Robusto">Sistema Robusto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Fórmula em Notação Lógica / LaTeX (Opcional):
                </label>
                <input
                  type="text"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="Ex: \forall x (P(x) \to Q(x))"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddingPremise(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-sm"
                >
                  Adicionar ao Corpus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
