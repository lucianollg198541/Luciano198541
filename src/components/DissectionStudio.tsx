import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  BookOpen,
  Share2,
  BookmarkPlus,
  RefreshCw,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Compass,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';
import { LibraryItem } from '../types/philosophical';

interface Props {
  onSaveToLibrary: (item: LibraryItem) => void;
  onSendToChat?: (text: string) => void;
  initialThought?: string;
}

export const DissectionStudio: React.FC<Props> = ({
  onSaveToLibrary,
  onSendToChat,
  initialThought = '',
}) => {
  const [thoughtInput, setThoughtInput] = useState(initialThought);
  const [contextInput, setContextInput] = useState('');
  const [isDissecting, setIsDissecting] = useState(false);
  const [dissectionResult, setDissectionResult] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    {
      group: '👶 Para Pequenos e Jovens',
      title: 'O amigo que não quis brincar',
      text: 'Se meu melhor amigo não quis brincar comigo no recreio hoje, significa que ele não gosta mais de mim e eu vou ficar sozinho.',
      context: 'Sentimento de rejeição imediata após um dia difícil na escola.',
    },
    {
      group: '🎒 Para Jovens e Estudantes',
      title: 'A pressão de pertencer',
      text: 'Todo mundo nas redes sociais está fazendo isso ou usando essa roupa; se eu não fizer igual, serei um fracasso social.',
      context: 'Dilema de identidade e medo de ser julgado pelos colegas.',
    },
    {
      group: '🌿 Para Adultos & Cotidiano',
      title: 'Catastrofização no trabalho',
      text: 'Se eu cometer um erro nesta apresentação profissional, minha credibilidade estará destruída para sempre.',
      context: 'Ansiedade de desempenho e confusão entre um evento pontual e o valor da pessoa.',
    },
    {
      group: '🏛️ Para Investigadores & Debates',
      title: 'Relativismo Radical vs. Verdade',
      text: 'Como cada pessoa tem sua própria perspectiva cultural e subjetiva, não existe nenhuma verdade objetiva em coisa alguma.',
      context: 'Discussão sobre epistemologia e os limites do relativismo epistêmico.',
    },
    {
      group: '⏳ Para a Madureza & Sênior',
      title: 'O mito da incapacidade de mudar',
      text: 'Pau que nasce torto morre torto; depois de certa idade a pessoa não muda mais de ideia nem de hábitos.',
      context: 'Crença limitante sobre neuroplasticidade e desenvolvimento moral contínuo.',
    },
  ];

  const handleDissect = async () => {
    if (!thoughtInput.trim() || isDissecting) return;
    setIsDissecting(true);
    setDissectionResult(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/sophia/dissect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: thoughtInput.trim(),
          context: contextInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Falha ao dessecar o pensamento.');
      }
      setDissectionResult(data.dissection);
    } catch (err: any) {
      console.error(err);
      setDissectionResult(
        `**Aviso da Mentoria:** Não foi possível concluir a dessecação neste instante. Detalhe: ${
          err?.message || 'Falha de comunicação.'
        }`
      );
    } finally {
      setIsDissecting(false);
    }
  };

  const handleSave = () => {
    if (!dissectionResult) return;
    const title = `Dissecação Racional: "${thoughtInput.slice(0, 45)}..."`;
    onSaveToLibrary({
      id: `lib_diss_${Date.now()}`,
      title,
      type: 'Dissecação de Pensamento',
      content: dissectionResult,
      abstract: `Análise dissecadora de Sophia sobre as armadilhas cognitivas e nuances do pensamento: "${thoughtInput.slice(
        0,
        120
      )}..."`,
      tags: ['Dissecação', 'Clareza Cognitiva', 'Educação do Pensamento', 'Lógica Prática'],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      epistemicStatus: 'Sistema Formalmente Robusto',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      {/* Left Column: Input and Presets */}
      <div className="w-full lg:w-5/12 flex flex-col space-y-4 overflow-y-auto pr-1">
        <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-classical font-bold text-stone-100">
                Mestra Dissecadora
              </h2>
              <p className="text-xs text-stone-400">
                Desembaraçar nós do raciocínio com afeto, clareza cirúrgica e pedagogia socrática
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Pensamento, dilema, frase ou dúvida confusa:
              </label>
              <textarea
                value={thoughtInput}
                onChange={(e) => setThoughtInput(e.target.value)}
                placeholder="Exemplo: 'Se eu errar nisso, serei um fracasso total' ou 'Como todo mundo diz que é verdade, então deve ser verdade'..."
                className="w-full h-28 px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 text-stone-200 text-sm placeholder:text-stone-600 outline-none resize-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Contexto ou sentimento complementar (opcional):
              </label>
              <input
                type="text"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                placeholder="Ex: Situação na escola, conversa em família, debate em aula..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-500/50 text-stone-200 text-xs placeholder:text-stone-600 outline-none transition"
              />
            </div>

            <button
              onClick={handleDissect}
              disabled={isDissecting || !thoughtInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-stone-950 font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition"
            >
              {isDissecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Sophia está dissecando o raciocínio...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Dissecar com Sophia</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pedagogical Presets for All Ages */}
        <div className="bg-stone-900/50 border border-stone-850 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-300 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Dilemas Frequentes da Mente Humana</span>
            </span>
            <span className="text-[10px] text-amber-400/90 font-mono">De mamando a caducando</span>
          </div>

          <div className="space-y-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setThoughtInput(preset.text);
                  setContextInput(preset.context);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-stone-950/60 hover:bg-stone-850/80 border border-stone-850 hover:border-amber-500/40 transition group"
              >
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium mb-0.5">
                  <span>{preset.group}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-stone-400 transition">
                    Usar &rarr;
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-200 transition">
                  {preset.title}
                </div>
                <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                  &ldquo;{preset.text}&rdquo;
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Dissection Results */}
      <div className="w-full lg:w-7/12 flex flex-col bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-sm min-h-[480px]">
        {/* Results Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 bg-stone-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-stone-200">
              Quadro de Dissecação & Lucidez Pedagógica
            </h3>
          </div>

          {dissectionResult && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-750 transition"
                title="Salvar na Biblioteca Pessoal"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>{savedSuccess ? 'Salvo!' : 'Salvar'}</span>
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-750 transition"
                title="Exportar em LaTeX ou Markdown"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-300" />
                <span>Exportar</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {dissectionResult ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-800/40 text-xs text-amber-200/90 flex items-start space-x-2.5">
                <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-semibold">Postura Compassiva:</strong>{' '}
                  A mente humana busca atalhos por proteção e cansaço. Dissecamos o pensamento não
                  para condenar, mas para iluminar a senda da tranquilidade racional.
                </div>
              </div>

              <div className="bg-stone-950/70 border border-stone-800/90 rounded-xl p-5 shadow-inner">
                <PhilosophicalMarkdown content={dissectionResult} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Lightbulb className="w-8 h-8 opacity-80" />
              </div>
              <h4 className="text-sm font-semibold text-stone-300 mb-1">
                A Arte de Desatar os Nós do Pensamento
              </h4>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Digite um pensamento confuso ao lado ou selecione um dos dilemas cotidianos. Sophia
                irá separar o joio do trigo, revelar as nuances da hesitação humana e entregar uma
                analogia clara que qualquer idade pode compreender.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {isExportOpen && dissectionResult && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title={`Dissecação: ${thoughtInput.slice(0, 40)}...`}
          content={dissectionResult}
          documentType="Dissecação de Pensamento"
          tags={['Dissecação', 'Pedagogia Socrática', 'Lógica Prática']}
        />
      )}
    </div>
  );
};
