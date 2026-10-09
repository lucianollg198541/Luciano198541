import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  BookOpen,
  Scroll,
  Send,
  Download,
  Share2,
  BookmarkPlus,
  ShieldCheck,
  RefreshCw,
  Award,
  Baby,
  Feather,
  GraduationCap,
} from 'lucide-react';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';
import { DocumentType, LibraryItem } from '../types/philosophical';

interface Props {
  onSaveToLibrary: (item: LibraryItem) => void;
  onSendToStressTest: (content: string) => void;
}

export type ExpandedWorkType = 'fable' | 'wisdom_letter' | 'essay' | 'thesis' | 'manifesto';

export const AcademicGenerator: React.FC<Props> = ({
  onSaveToLibrary,
  onSendToStressTest,
}) => {
  const [workType, setWorkType] = useState<ExpandedWorkType>('thesis');
  const [topic, setTopic] = useState('');
  const [corePremise, setCorePremise] = useState('');
  const [methodology, setMethodology] = useState('Racionalismo Crítico & Análise Conceitual');
  const [targetAudience, setTargetAudience] = useState('Público Geral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    {
      label: '👶 Fábula: O Menino que Queria Engarrafar o Vento',
      type: 'fable' as const,
      topic: 'O valor da liberdade e a impossibilidade de possuir tudo',
      premise: 'A beleza do mundo não está em aprisioná-lo, mas em contemplá-lo e conviver com o mistério.',
      methodology: 'Narrativa socrática com animais sábios e lição moral lúcida',
      audience: 'Crianças e Jovens Curiosos',
    },
    {
      label: '⏳ Carta de Sabedoria: Da Arte de Envelhecer com Dignidade',
      type: 'wisdom_letter' as const,
      topic: 'A serenidade diante da passagem inexorável dos anos',
      premise: 'O tempo não nos rouba a vida; ele amadurece o discernimento daquele que aprendeu a distinguir o essencial do efêmero.',
      methodology: 'Estoicismo clássico e humanismo perene (Estilo Sêneca)',
      audience: 'Adultos, Idosos e Espíritos Reflexivos',
    },
    {
      label: '🏛️ Tese Acadêmica: Realismo Estrutural Ôntico & OSR',
      type: 'thesis' as const,
      topic: 'A Invariância Estrutural na Física Quântica e a Refutação do Realismo de Entidades',
      premise: 'A ontologia fundamental do cosmos consiste em relações matemáticas invariantes e não em substâncias corpusculares isoladas.',
      methodology: 'Filosofia da Ciência, Teoria de Modelos e Dedução Axiomática',
      audience: 'Comunidade Acadêmica & Investigadores',
    },
    {
      label: '🌿 Ensaio: Por Que a Razão e o Afeto Não São Inimigos',
      type: 'essay' as const,
      topic: 'A Harmonia entre a Lógica Formal e a Empatia Humana',
      premise: 'Um raciocínio desprovido de compreensão humana degenera em sofisma estéril; a verdadeira inteligência é compassiva.',
      methodology: 'Ética das Virtudes & Epistemologia Humanista',
      audience: 'Leitores de Todas as Idades',
    },
    {
      label: '📢 Manifesto: Pela Serenidade do Pensamento Livre',
      type: 'manifesto' as const,
      topic: 'Princípios Inabaláveis contra o Tumulto e a Pressa Contemporânea',
      premise: 'Rejeitamos o tribunal da pressa e a ditadura do clique; afirmamos o direito ao silêncio, à dúvida honesta e ao exame diário.',
      methodology: 'Racionalismo Intransigente & Filosofia Prática',
      audience: 'Cidadãos Conscientes',
    },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/sophia/generate-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: workType,
          topic: topic.trim(),
          corePremise: corePremise.trim() || topic.trim(),
          methodology,
          targetAudience,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Não foi possível gerar a obra solicitada.');
      }
      if (data.content) {
        setGeneratedResult(data.content);
      }
    } catch (err: any) {
      console.error(err);
      setGeneratedResult(`**Erro do Instituto Logos:** ${err?.message || 'Falha ao redigir o tratado.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDocTypeLabel = (t: ExpandedWorkType): DocumentType => {
    switch (t) {
      case 'fable':
        return 'Fábula ou Diálogo Filosófico';
      case 'wisdom_letter':
        return 'Carta de Sabedoria Prática';
      case 'essay':
        return 'Ensaio Acadêmico';
      case 'manifesto':
        return 'Manifesto Filosófico';
      case 'thesis':
      default:
        return 'Tese Acadêmica';
    }
  };

  const handleSave = () => {
    if (!generatedResult) return;

    const typeLabel = getDocTypeLabel(workType);

    const newItem: LibraryItem = {
      id: `work_${Date.now()}`,
      title: topic,
      type: typeLabel,
      content: generatedResult,
      abstract: `Obra gerada por Sophia (${typeLabel}): ${topic}. Premissa: ${corePremise || topic}`,
      tags: [workType, methodology.split(' ')[0], 'InstitutoLogos'],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      epistemicStatus: workType === 'thesis' ? 'Tese Axiomatizada' : 'Sistema Formalmente Robusto',
    };

    onSaveToLibrary(newItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5 p-1 overflow-hidden">
      {/* Parameter Controls Panel */}
      <div className="w-full lg:w-5/12 flex flex-col space-y-4 overflow-y-auto pr-1">
        <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-classical font-bold text-stone-100">
                Oficina de Escrita & Sabedoria
              </h2>
              <p className="text-xs text-stone-400">
                Obras completas: de fábulas para crianças a teses acadêmicas de rigor irrefutável
              </p>
            </div>
          </div>

          {/* Type Selector (5 Types) */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              Gênero da Obra:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setWorkType('thesis')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  workType === 'thesis'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>Tese Acadêmica</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkType('fable')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  workType === 'fable'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <Baby className="w-3.5 h-3.5 shrink-0" />
                <span>Fábula / Jovens</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkType('wisdom_letter')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  workType === 'wisdom_letter'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <Feather className="w-3.5 h-3.5 shrink-0" />
                <span>Carta de Sabedoria</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkType('essay')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  workType === 'essay'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Ensaio Filosófico</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkType('manifesto')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition col-span-2 sm:col-span-1 ${
                  workType === 'manifesto'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <Scroll className="w-3.5 h-3.5 shrink-0" />
                <span>Manifesto</span>
              </button>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Tema ou Questão Central:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: A natureza do tempo, O medo de errar, A inviolabilidade da verdade..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-stone-200 text-xs placeholder:text-stone-600 outline-none transition"
            />
          </div>

          {/* Core Premise */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Premissa ou Mensagem Fundamental:
            </label>
            <textarea
              value={corePremise}
              onChange={(e) => setCorePremise(e.target.value)}
              placeholder="O núcleo do que deve ser demonstrado ou ensinado..."
              className="w-full h-18 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-stone-200 text-xs placeholder:text-stone-600 outline-none resize-none transition"
            />
          </div>

          {/* Methodology or Style */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Metodologia ou Tradição Filosófica:
            </label>
            <input
              type="text"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              placeholder="Ex: Racionalismo Crítico, Estoicismo Humanista, Fenomenologia..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-stone-200 text-xs placeholder:text-stone-600 outline-none transition"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-stone-950 font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                <span>Sophia está redigindo com primor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Redigir com Sophia</span>
              </>
            )}
          </button>
        </div>

        {/* Presets */}
        <div className="bg-stone-900/50 border border-stone-850 rounded-2xl p-4">
          <span className="text-xs font-semibold text-stone-300 block mb-2.5">
            Modelos Canônicos Prontos (Para Todas as Idades):
          </span>
          <div className="space-y-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setWorkType(preset.type);
                  setTopic(preset.topic);
                  setCorePremise(preset.premise);
                  setMethodology(preset.methodology);
                  setTargetAudience(preset.audience);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-stone-950/60 hover:bg-stone-850/80 border border-stone-850 hover:border-amber-500/40 transition group"
              >
                <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-200 transition">
                  {preset.label}
                </div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">
                  {preset.audience} &bull; {preset.methodology}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Result Display */}
      <div className="w-full lg:w-7/12 flex flex-col bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-sm min-h-[480px]">
        {/* Results Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 bg-stone-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-classical font-semibold text-stone-200">
              {getDocTypeLabel(workType)}
            </span>
            {topic && (
              <span className="text-xs text-stone-400 truncate max-w-[200px] sm:max-w-[320px]">
                &bull; {topic}
              </span>
            )}
          </div>

          {generatedResult && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-750 transition"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>{savedSuccess ? 'Salvo!' : 'Salvar'}</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-750 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-300" />
                <span>Exportar</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {generatedResult ? (
            <div className="bg-stone-950/70 border border-stone-800/90 rounded-xl p-6 shadow-inner">
              <PhilosophicalMarkdown content={generatedResult} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Scroll className="w-8 h-8 opacity-80" />
              </div>
              <h4 className="text-sm font-semibold text-stone-300 mb-1">
                A Pena de Sophia Está Pronta
              </h4>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Configure os parâmetros ao lado ou selecione um dos modelos canônicos. Sophia redigirá
                um texto estruturado, com prosa equilibrada e estabilidade formal, pronto para ser
                lido ou exportado em LaTeX e Markdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {isExportModalOpen && generatedResult && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title={topic}
          content={generatedResult}
          documentType={getDocTypeLabel(workType)}
          tags={[workType, 'LogosInstitute', 'Sophia']}
        />
      )}
    </div>
  );
};
