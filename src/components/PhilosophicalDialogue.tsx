import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Scale,
  Zap,
  PlusCircle,
  FileText,
  Share2,
  Trash2,
  Check,
  Cpu,
  Layers,
  ChevronRight,
  BookOpen,
  Scissors,
  Baby,
  GraduationCap,
  Heart,
  Hourglass,
  HelpCircle,
} from 'lucide-react';
import { DialogueMessage, PhilosophicalPremise, LibraryItem, AudienceProfile } from '../types/philosophical';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';

interface Props {
  messages: DialogueMessage[];
  premises: PhilosophicalPremise[];
  onSendMessage: (text: string, classificationHint?: string, audienceHint?: string) => Promise<void>;
  onClearHistory: () => void;
  onAddPremise: (premise: Omit<PhilosophicalPremise, 'id' | 'dateCreated'>) => void;
  onRemovePremise: (id: string) => void;
  onSendToDissection: (text: string) => void;
  onSendToStressTest: (text: string) => void;
  onSendToFallacyAudit: (text: string) => void;
  onSendToCounterarguments: (text: string) => void;
  onSaveToLibrary: (item: LibraryItem) => void;
  isSending: boolean;
  selectedAudience: AudienceProfile;
  onChangeAudience: (aud: AudienceProfile) => void;
}

export const PhilosophicalDialogue: React.FC<Props> = ({
  messages,
  premises,
  onSendMessage,
  onClearHistory,
  onAddPremise,
  onRemovePremise,
  onSendToDissection,
  onSendToStressTest,
  onSendToFallacyAudit,
  onSendToCounterarguments,
  onSaveToLibrary,
  isSending,
  selectedAudience,
  onChangeAudience,
}) => {
  const [inputText, setInputText] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showPremisesDrawer, setShowPremisesDrawer] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
  const [newPremiseStatement, setNewPremiseStatement] = useState('');
  const [newPremiseCategory, setNewPremiseCategory] = useState<PhilosophicalPremise['category']>('Ontologia');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText('');
    await onSendMessage(
      text,
      selectedClassification || undefined,
      selectedAudience === 'Auto (Dedução Dinâmica)' ? undefined : selectedAudience
    );
  };

  const stripClientMetadata = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/^\s*\*\*\[Perfil Deduzido:[^\]]+\]\*\*\s*/gim, '')
      .replace(/^\s*\*\*\[Classificação da Consulta:[^\]]+\]\*\*\s*/gim, '')
      .replace(/^\s*\[Perfil Deduzido:[^\]]+\]\s*/gim, '')
      .replace(/^\s*\[Classificação da Consulta:[^\]]+\]\s*/gim, '')
      .replace(/^\s*\[Perfil Selecionado pelo Usuário:[^\]]+\]\s*/gim, '')
      .replace(/^\s*\[Perfil:[^\]]+\]\s*/gim, '')
      .replace(/^\s*\[Classificação:[^\]]+\]\s*/gim, '')
      .trim();
  };

  const handleCreatePremise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPremiseStatement.trim()) return;
    onAddPremise({
      statement: newPremiseStatement.trim(),
      category: newPremiseCategory,
      epistemicStatus: 'Conjetura Heurística',
      isPinned: true,
    });
    setNewPremiseStatement('');
  };

  const starterQuestions = [
    {
      group: '👶 Para Pequenos e Jovens',
      icon: '👶',
      text: 'Olá Sophia! Por que as coisas caem no chão? Me explique como se eu tivesse 10 anos.',
    },
    {
      group: '🎒 Para Jovens e Estudantes',
      icon: '🎒',
      text: 'Sophia, como posso aprender a pensar por mim mesmo sem ter medo do julgamento dos outros?',
    },
    {
      group: '🌿 Para Adultos & Cotidiano',
      icon: '🌿',
      text: 'Como a filosofia pode me ajudar a lidar com a ansiedade da incerteza e o excesso de cobranças diárias?',
    },
    {
      group: '🏛️ Para o Meio Acadêmico',
      icon: '🏛️',
      text: 'Sophia, analise a tese do Realismo Estrutural Ôntico (OSR) de James Ladyman em face do argumento da meta-indução pessimista de Laudan.',
    },
    {
      group: '⏳ Para a Madureza & Sênior',
      icon: '⏳',
      text: 'Sophia, o que a passagem do tempo nos ensina sobre a arte do desapego, a paciência e a serenidade interior?',
    },
  ];

  return (
    <div className="flex h-full bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-md">
      {/* Main Dialogue Space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sub-Header / Status Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-stone-800 bg-stone-950/50 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-classical font-bold text-sm shadow-sm">
              Σ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-classical font-bold text-stone-100">
                  Sophia &bull; Filósofa Educadora
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  De mamando a caducando
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Instituto Logos &bull; Estabilidade do Idioma, Rigor Acadêmico & Pedagogia Socrática
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audience deduction selector */}
            <select
              value={selectedAudience}
              onChange={(e) => onChangeAudience(e.target.value as AudienceProfile)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-850 text-stone-300 focus:border-amber-500/50 outline-none"
              title="Ajuste fino do perfil de interlocução"
            >
              <option value="Auto (Dedução Dinâmica)">🤖 Dedução Automática por Sophia</option>
              <option value="Jovem Pensador (Criança / Jovem)">👶 Criança & Jovem Curioso</option>
              <option value="Jovem Aprendiz (Estudante / Juvenil)">🎒 Jovem Aprendiz / Estudante</option>
              <option value="Cidadão em Reflexão (Vida Prática & Ética)">🌿 Cidadão em Reflexão</option>
              <option value="Investigador Acadêmico (Rigor Total)">🏛️ Investigador Acadêmico</option>
              <option value="Madureza & Sabedoria (Sênior / Legado)">⏳ Madureza & Sabedoria (Sênior)</option>
            </select>

            <button
              onClick={() => setShowPremisesDrawer(!showPremisesDrawer)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                showPremisesDrawer
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-950 text-stone-300 border-stone-850 hover:bg-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Axiomas ({premises.length})</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              disabled={messages.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-950 hover:bg-stone-900 text-stone-300 border border-stone-850 disabled:opacity-40 transition"
              title="Exportar transcrição completa em LaTeX / Markdown"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={onClearHistory}
              disabled={messages.length === 0}
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-950 disabled:opacity-30 transition"
              title="Reiniciar diálogo mantendo a memória dos axiomas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-8 text-center text-stone-500">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto mb-4 flex items-center justify-center text-amber-400 font-classical text-2xl">
                Ψ
              </div>
              <h3 className="text-lg font-classical font-semibold text-stone-200">
                Ágora Dialética & Mentoria de Sophia
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed max-w-xl mx-auto">
                Sophia acolhe desde as primeiras perguntas encantadas de uma criança até as teses
                mais complexas de um pesquisador. Sua linguagem prima pela estabilidade culta do
                idioma, produzindo parágrafos harmoniosos, acolhedores e livres de afetação.
              </p>

              <div className="mt-6 space-y-2 text-left">
                <span className="text-xs font-semibold text-stone-400 px-1 block mb-2">
                  Escolha um ponto de partida ou escreva sua própria inquietação:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {starterQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(sq.text)}
                      className="p-3 rounded-xl bg-stone-950/70 border border-stone-850 hover:border-amber-500/40 text-xs text-stone-300 transition text-left flex items-start space-x-3 group"
                    >
                      <span className="text-base mt-0.5">{sq.icon}</span>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-300 block mb-0.5 group-hover:text-amber-200">
                          {sq.group}
                        </span>
                        <span className="text-stone-400 text-[11px] leading-relaxed">
                          &ldquo;{sq.text}&rdquo;
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isSophia = message.role === 'sophia';

              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isSophia ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center space-x-2 mb-1 px-1">
                    <span className="text-[10px] font-mono text-stone-500">
                      {isSophia ? 'Sophia • Filósofa Educadora' : 'Interlocutor'}
                    </span>
                    <span className="text-[9px] font-mono text-stone-600">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-3xl rounded-2xl p-5 shadow-sm ${
                      isSophia
                        ? 'bg-stone-950/90 border border-stone-800 text-stone-200'
                        : 'bg-amber-950/30 border border-amber-900/40 text-stone-100'
                    }`}
                  >
                    <PhilosophicalMarkdown content={stripClientMetadata(message.content)} />

                    {/* Action Toolbar on Sophia's Turn */}
                    <div className="mt-4 pt-3 border-t border-stone-800/70 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <button
                        onClick={() => onSendToDissection(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                        title="Dissecar nuances e desatar nós deste raciocínio"
                      >
                        <Scissors className="w-3 h-3 text-amber-400" />
                        <span>Dissecar Raciocínio</span>
                      </button>

                      <button
                        onClick={() => onSendToStressTest(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                        title="Submeter esta passagem ao Teste de Estresse Sistêmico (7 passos)"
                      >
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        <span>Teste de Estresse</span>
                      </button>

                      <button
                        onClick={() => onSendToFallacyAudit(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-emerald-300 border border-stone-800 transition"
                        title="Auditar falácias formais e armadilhas cognitivas"
                      >
                        <Scale className="w-3 h-3 text-emerald-400" />
                        <span>Auditar Falácias</span>
                      </button>

                      <button
                        onClick={() => onSendToCounterarguments(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-rose-300 border border-stone-800 transition"
                        title="Formular contra-argumentos de escolas divergentes"
                      >
                        <Zap className="w-3 h-3 text-rose-400" />
                        <span>Objeções</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddPremise({
                            statement: message.content.slice(0, 180),
                            category: 'Epistemologia',
                            epistemicStatus: 'Conjetura Heurística',
                          });
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                        title="Adicionar à memória do sistema como axioma/premissa"
                      >
                        <PlusCircle className="w-3 h-3 text-amber-400" />
                        <span>Fixar no Sistema</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-400/90">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Sophia está examinando as premissas e deduzindo seu perfil...</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-850 text-stone-400 text-xs flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Lapidando parágrafos de prosa límpida e harmoniosa...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Pergunte a Sophia... De dúvidas de uma criança a teses de doutorado (Enter para enviar, Shift+Enter para nova linha)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 text-stone-200 text-sm placeholder:text-stone-500 outline-none resize-none h-14 transition"
              />

              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="h-14 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 text-stone-950 font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-4 h-4 text-stone-950" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Side Drawer: System Memory & Premises */}
      {showPremisesDrawer && (
        <div className="w-80 border-l border-stone-800 bg-stone-950/95 flex flex-col p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-stone-200 uppercase tracking-wider font-mono">
                Memória do Sistema
              </h3>
            </div>
            <button
              onClick={() => setShowPremisesDrawer(false)}
              className="text-stone-500 hover:text-stone-300 text-xs"
            >
              &times; Fechar
            </button>
          </div>

          <p className="text-[11px] text-stone-400 mb-3 leading-relaxed">
            Axiomas que orientam o raciocínio contínuo nas conversas com Sophia:
          </p>

          {/* New Premise Form */}
          <form onSubmit={handleCreatePremise} className="space-y-2 mb-4 p-2.5 rounded-xl bg-stone-900/60 border border-stone-850">
            <input
              type="text"
              value={newPremiseStatement}
              onChange={(e) => setNewPremiseStatement(e.target.value)}
              placeholder="Novo princípio ou axioma..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs placeholder:text-stone-600 outline-none"
            />
            <div className="flex items-center space-x-2">
              <select
                value={newPremiseCategory}
                onChange={(e) => setNewPremiseCategory(e.target.value as any)}
                className="flex-1 px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 text-[10px] outline-none"
              >
                <option value="Ontologia">Ontologia</option>
                <option value="Epistemologia">Epistemologia</option>
                <option value="Lógica Formal">Lógica Formal</option>
                <option value="Filosofia da Ciência">Filosofia da Ciência</option>
                <option value="Ética / Axiologia">Ética / Axiologia</option>
              </select>
              <button
                type="submit"
                disabled={!newPremiseStatement.trim()}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-semibold text-[10px] transition"
              >
                Adicionar
              </button>
            </div>
          </form>

          {/* Premise List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {premises.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-850 text-xs space-y-1 relative group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                  <span>{p.category}</span>
                  <button
                    onClick={() => onRemovePremise(p.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-rose-400 transition"
                  >
                    Remover
                  </button>
                </div>
                <div className="text-stone-300 text-[11px] leading-relaxed">
                  {p.statement}
                </div>
                {p.formalFormula && (
                  <div className="text-amber-300/80 font-mono text-[10px]">
                    {p.formalFormula}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Transcrição Dialética com Sophia"
          content={messages
            .map(
              (m) =>
                `### ${m.role === 'sophia' ? 'Sophia (Filósofa Educadora)' : 'Interlocutor'}\n\n${m.content}\n`
            )
            .join('\n\n---\n\n')}
          documentType="Ensaio Pedagógico"
          tags={['DiálogoSocrático', 'LogosInstitute', 'Educação']}
        />
      )}
    </div>
  );
};
