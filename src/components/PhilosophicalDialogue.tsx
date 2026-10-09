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
} from 'lucide-react';
import { DialogueMessage, PhilosophicalPremise, LibraryItem } from '../types/philosophical';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';

interface Props {
  messages: DialogueMessage[];
  premises: PhilosophicalPremise[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
  onAddPremise: (premise: Omit<PhilosophicalPremise, 'id' | 'dateCreated'>) => void;
  onRemovePremise: (id: string) => void;
  onSendToStressTest: (text: string) => void;
  onSendToFallacyAudit: (text: string) => void;
  onSendToCounterarguments: (text: string) => void;
  onSaveToLibrary: (item: LibraryItem) => void;
  isSending: boolean;
}

export const PhilosophicalDialogue: React.FC<Props> = ({
  messages,
  premises,
  onSendMessage,
  onClearHistory,
  onAddPremise,
  onRemovePremise,
  onSendToStressTest,
  onSendToFallacyAudit,
  onSendToCounterarguments,
  onSaveToLibrary,
  isSending,
}) => {
  const [inputText, setInputText] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showPremisesDrawer, setShowPremisesDrawer] = useState(false);
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
    await onSendMessage(text);
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

  const compiledTranscript = messages
    .map(
      (m) =>
        `### ${m.role === 'sophia' ? 'Sophia (Chief Virtual Philosopher)' : 'Pesquisador'}\n\n${m.content}\n`
    )
    .join('\n\n---\n\n');

  return (
    <div className="flex h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-classical font-bold text-sm shadow-sm">
              Σ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-classical font-bold text-stone-100">Sophia</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  Chief Virtual Philosopher
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Instituto Logos &bull; Razão Dedutiva, Epistemologia & Rigor Dialético
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPremisesDrawer(!showPremisesDrawer)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                showPremisesDrawer
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Memória do Sistema ({premises.length})</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              disabled={messages.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 disabled:opacity-40 transition"
              title="Exportar transcrição completa em LaTeX / Markdown"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={onClearHistory}
              disabled={messages.length === 0}
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 disabled:opacity-30 transition"
              title="Reiniciar diálogo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-xl mx-auto py-12 text-center text-stone-500">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto mb-4 flex items-center justify-center text-amber-400 font-classical text-xl">
                Ψ
              </div>
              <h3 className="text-base font-classical font-semibold text-stone-200">
                Disputa Dialética do Instituto Logos
              </h3>
              <p className="text-xs font-scholarly text-stone-400 mt-2 leading-relaxed">
                Bem-vindo ao laboratório de razão rigorosa. Apresente uma intuição inicial, uma conjectura ontológica ou um problema epistemológico.
                Sophia examinará a consistência lógica, mapeará consequências sistêmicas e evitará dogmatismos.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <button
                  onClick={() =>
                    onSendMessage(
                      'Proponho que o tempo não é uma dimensão ontológica real do cosmos, mas apenas um construto da entropia termodinâmica e da percepção do sujeito.'
                    )
                  }
                  className="p-3 rounded-lg bg-stone-900/60 border border-stone-850 hover:border-amber-500/40 text-xs text-stone-300 transition"
                >
                  <span className="font-semibold text-amber-300 block mb-1">Ontologia do Tempo:</span>
                  &ldquo;O tempo é um construto entrópico ou realidade fundamental?&rdquo;
                </button>
                <button
                  onClick={() =>
                    onSendMessage(
                      'Existe uma contradição insuperável entre o determinismo causal do universo físico e a responsabilidade moral do agente humano?'
                    )
                  }
                  className="p-3 rounded-lg bg-stone-900/60 border border-stone-850 hover:border-amber-500/40 text-xs text-stone-300 transition"
                >
                  <span className="font-semibold text-amber-300 block mb-1">Livre-Arbítrio & Causalidade:</span>
                  &ldquo;Determinismo causal versus responsabilidade moral.&rdquo;
                </button>
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
                      {isSophia ? 'Sophia &bull; Logos Institute' : 'Interlocutor'}
                    </span>
                    <span className="text-[9px] font-mono text-stone-600">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-3xl rounded-xl p-5 shadow-md ${
                      isSophia
                        ? 'bg-stone-900/80 border border-stone-800 text-stone-200'
                        : 'bg-amber-950/30 border border-amber-900/40 text-stone-100'
                    }`}
                  >
                    <PhilosophicalMarkdown content={message.content} />

                    {/* Contextual Action Bar for messages */}
                    <div className="mt-4 pt-3 border-t border-stone-800/70 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <button
                        onClick={() => onSendToStressTest(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-950/70 hover:bg-stone-850 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                        title="Submeter esta passagem ao Teste de Estresse Sistêmico (7 passos)"
                      >
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        <span>Teste de Estresse</span>
                      </button>

                      <button
                        onClick={() => onSendToFallacyAudit(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-950/70 hover:bg-stone-850 text-stone-400 hover:text-emerald-300 border border-stone-800 transition"
                        title="Auditar falácias formais e silogísticas"
                      >
                        <Scale className="w-3 h-3 text-emerald-400" />
                        <span>Auditar Falácias</span>
                      </button>

                      <button
                        onClick={() => onSendToCounterarguments(message.content)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-950/70 hover:bg-stone-850 text-stone-400 hover:text-rose-300 border border-stone-800 transition"
                        title="Formular contra-argumentos rigorosos"
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
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-950/70 hover:bg-stone-850 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
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
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-mono text-stone-500 mb-1 px-1">
                Sophia está ponderando sob o rigor formal...
              </span>
              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-scholarly text-amber-300/80">
                  Auditando premissas, detectando implicações e derivando conclusões...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-stone-800 bg-stone-900/40">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Apresente uma tese, conjectura ou contraposição a Sophia (Shift+Enter para nova linha)..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-4 pr-24 py-3 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 resize-none font-scholarly leading-relaxed"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="absolute right-3 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-classical font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow"
            >
              <span>Argüir</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-stone-500 font-mono">
            <span>
              Pressione Enter para enviar &bull; As respostas mantêm a memória do seu sistema de pensamento.
            </span>
            <span>Instituto Logos &bull; Sophia</span>
          </div>
        </form>
      </div>

      {/* Right Drawer: Philosophical System Memory */}
      {showPremisesDrawer && (
        <div className="w-80 border-l border-stone-800 bg-stone-900/90 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-classical font-bold text-stone-200">Axiomas do Sistema</h3>
            </div>
            <button
              onClick={() => setShowPremisesDrawer(false)}
              className="text-xs text-stone-500 hover:text-stone-300"
            >
              Fechar
            </button>
          </div>

          {/* Premise List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-[11px] text-stone-400 leading-relaxed font-scholarly">
              Estes são os axiomas ativos que Sophia consulta continuamente para validar a continuidade do seu pensamento e alertar sobre contradições.
            </p>

            {premises.length === 0 ? (
              <div className="p-4 rounded-lg bg-stone-950 border border-stone-850 text-center text-xs text-stone-500">
                Nenhum axioma fixado no momento. Adicione proposições abaixo ou fixe passagens do diálogo.
              </div>
            ) : (
              premises.map((p, index) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-stone-950 border border-stone-850 text-xs relative group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-900 text-amber-400 border border-stone-800">
                      Axioma {index + 1}: {p.category}
                    </span>
                    <button
                      onClick={() => onRemovePremise(p.id)}
                      className="text-stone-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                      title="Remover premissa"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-stone-300 font-scholarly leading-relaxed">{p.statement}</p>
                  {p.epistemicStatus && (
                    <span className="inline-block mt-2 text-[9px] text-stone-500 font-mono">
                      Status: {p.epistemicStatus}
                    </span>
                  )}
                </div>
              ))
            )}

            {/* Quick add premise form */}
            <form onSubmit={handleCreatePremise} className="pt-3 border-t border-stone-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Novo Axioma:</span>
              <select
                value={newPremiseCategory}
                onChange={(e) => setNewPremiseCategory(e.target.value as any)}
                className="w-full p-1.5 bg-stone-950 border border-stone-800 rounded text-xs text-stone-300"
              >
                <option value="Ontologia">Ontologia</option>
                <option value="Epistemologia">Epistemologia</option>
                <option value="Lógica Formal">Lógica Formal</option>
                <option value="Filosofia da Ciência">Filosofia da Ciência</option>
                <option value="Ética / Axiologia">Ética / Axiologia</option>
              </select>
              <textarea
                rows={2}
                placeholder="Declare o axioma do seu sistema..."
                value={newPremiseStatement}
                onChange={(e) => setNewPremiseStatement(e.target.value)}
                className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-xs text-stone-200"
              />
              <button
                type="submit"
                disabled={!newPremiseStatement.trim()}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-semibold rounded text-xs transition"
              >
                Fixar Axioma
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Export Dialogue Modal */}
      {isExportOpen && (
        <ExportModal
          isOpen={true}
          onClose={() => setIsExportOpen(false)}
          title="Disputa Dialética com Sophia"
          content={compiledTranscript}
          type="Registro Dialético"
          abstract={`Transcrição formal de diálogo e desenvolvimento de sistema filosófico com Sophia, Chief Virtual Philosopher.`}
        />
      )}
    </div>
  );
};
