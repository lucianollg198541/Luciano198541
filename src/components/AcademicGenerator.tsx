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
} from 'lucide-react';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';
import { DocumentType, LibraryItem } from '../types/philosophical';

interface Props {
  onSaveToLibrary: (item: LibraryItem) => void;
  onSendToStressTest: (content: string) => void;
}

export const AcademicGenerator: React.FC<Props> = ({
  onSaveToLibrary,
  onSendToStressTest,
}) => {
  const [workType, setWorkType] = useState<'essay' | 'manifesto' | 'thesis'>('thesis');
  const [topic, setTopic] = useState('');
  const [corePremise, setCorePremise] = useState('');
  const [methodology, setMethodology] = useState('Racionalismo Crítico & Análise Conceitual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    {
      label: 'A Intencionalidade da Mente e a Ilusão Fisicalista',
      type: 'thesis' as const,
      premise: 'Estados fenomênicos não são redutíveis a correlações neurofisiológicas sem perda ontológica irremediável.',
      methodology: 'Filosofia da Mente & Fenomenologia Realista',
    },
    {
      label: 'Manifesto pela Lucidez Epistêmica na Era da Hiperinformação',
      type: 'manifesto' as const,
      premise: 'A verdade não é consenso algorítmico; ela exige submissão deliberada às regras da contradição e do rigor dedutivo.',
      methodology: 'Racionalismo Intransigente & Crítica Cultural',
    },
    {
      label: 'Sobre a Indutibilidade das Leis Naturais em David Hume e Karl Popper',
      type: 'essay' as const,
      premise: 'Nenhuma quantificação empírica finita justifica a passagem lógica para uma necessidade universal irrestrita.',
      methodology: 'Epistemologia e Filosofia da Ciência',
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
        }),
      });

      const data = await response.json();
      if (data.content) {
        setGeneratedResult(data.content);
      } else {
        setGeneratedResult('Não foi possível gerar a obra acadêmica solicitada.');
      }
    } catch (err: any) {
      console.error(err);
      setGeneratedResult('Erro na conexão com o Instituto Logos ao gerar tratado.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedResult) return;

    const typeLabel: DocumentType =
      workType === 'essay'
        ? 'Ensaio Acadêmico'
        : workType === 'manifesto'
        ? 'Manifesto Filosófico'
        : 'Tese Acadêmica';

    const newItem: LibraryItem = {
      id: `work_${Date.now()}`,
      title: topic,
      type: typeLabel,
      content: generatedResult,
      abstract: `Tratado formulado sob rigor metodológico: ${methodology}. Premissa: ${corePremise || topic}`,
      tags: [workType, methodology.split(' ')[0], 'LogosInstitute'],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      epistemicStatus: workType === 'thesis' ? 'Tese Axiomatizada' : 'Conjetura Heurística',
    };

    onSaveToLibrary(newItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5 p-1 overflow-hidden">
      {/* Left Configuration Column */}
      <div className="w-full lg:w-96 flex flex-col bg-stone-950 border border-stone-800 rounded-xl p-5 shadow-lg overflow-y-auto">
        <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-stone-800">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-classical font-semibold text-stone-100">Escritório Acadêmico</h2>
            <p className="text-xs text-stone-400">Geração de tratados formais e manifestos com Sophia.</p>
          </div>
        </div>

        {/* Work Type Selection */}
        <div className="mb-4">
          <label className="text-xs font-mono uppercase text-stone-400 block mb-2">Gênero Filosófico:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWorkType('thesis')}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                workType === 'thesis'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span className="text-xs">Tese</span>
            </button>
            <button
              onClick={() => setWorkType('essay')}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                workType === 'essay'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-1" />
              <span className="text-xs">Ensaio</span>
            </button>
            <button
              onClick={() => setWorkType('manifesto')}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                workType === 'manifesto'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Scroll className="w-4 h-4 mb-1" />
              <span className="text-xs">Manifesto</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5 flex-1">
          <div>
            <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
              Tema / Questão Central:
            </label>
            <input
              type="text"
              placeholder="Ex: A Irredutibilidade Ontológica do Tempo"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
              Premissa ou Axioma Condutor:
            </label>
            <textarea
              rows={3}
              placeholder="Ex: O devir temporal não é uma ilusão cognitiva, mas o horizonte transcendental da causalidade..."
              value={corePremise}
              onChange={(e) => setCorePremise(e.target.value)}
              className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed font-scholarly"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
              Metodologia & Linhagem Epistêmica:
            </label>
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Dedução Axiomática e Filosofia Analítica">Dedução Axiomática & Filosofia Analítica</option>
              <option value="Racionalismo Crítico & Análise Conceitual">Racionalismo Crítico & Falsificacionismo</option>
              <option value="Fenomenologia Eidética & Epistemologia">Fenomenologia Eidética & Epistemologia</option>
              <option value="Pragmatismo Lógico & Inferencialismo">Pragmatismo Lógico & Inferencialismo</option>
              <option value="Materialismo Dialético & Filosofia da Ciência">Materialismo Dialético & Filosofia da Ciência</option>
            </select>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-stone-500 block mb-1.5 uppercase">Sugestões de Tratados:</span>
            <div className="space-y-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(p.label);
                    setWorkType(p.type);
                    setCorePremise(p.premise);
                    setMethodology(p.methodology);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900 border border-stone-850 text-[11px] text-stone-300 transition"
                >
                  <span className="font-semibold text-amber-400 block truncate">{p.label}</span>
                  <span className="text-stone-500 text-[10px] truncate block">{p.methodology}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full mt-4 flex items-center justify-center space-x-2 p-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-classical font-semibold rounded-lg shadow-md transition"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Redigindo com Sophia...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Redigir {workType === 'thesis' ? 'Tese' : workType === 'essay' ? 'Ensaio' : 'Manifesto'}</span>
            </>
          )}
        </button>
      </div>

      {/* Right Result Column */}
      <div className="flex-1 flex flex-col bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
        {generatedResult ? (
          <>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-900/50">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/40">
                  {workType === 'thesis' ? 'Tese Acadêmica' : workType === 'essay' ? 'Ensaio' : 'Manifesto'}
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">&bull; {topic}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSendToStressTest(generatedResult)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Teste de Estresse</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{savedSuccess ? 'Salvo no Codex!' : 'Salvar no Codex'}</span>
                </button>

                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Exportar LaTeX / MD</span>
                </button>
              </div>
            </div>

            {/* Document Reader */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-stone-900/40 p-8 rounded-xl border border-stone-800/80 shadow-md">
                <PhilosophicalMarkdown content={generatedResult} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-500">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <h3 className="text-base font-classical font-semibold text-amber-300">
                  Estruturando Dedutivamente...
                </h3>
                <p className="text-xs font-scholarly text-stone-400 max-w-md">
                  Sophia está articulando premissas, derivando consequências formais e incorporando referências e notação LaTeX.
                </p>
              </div>
            ) : (
              <div className="max-w-md">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-stone-600" />
                <h3 className="text-base font-classical font-semibold text-stone-300">
                  Pronto para Formulação
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Selecione à esquerda o gênero acadêmico (Tese, Ensaio ou Manifesto), defina a premissa central e solicite a Sophia a redação formal.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export Modal */}
      {isExportModalOpen && generatedResult && (
        <ExportModal
          isOpen={true}
          onClose={() => setIsExportModalOpen(false)}
          title={topic}
          content={generatedResult}
          type={workType === 'thesis' ? 'Tese Acadêmica' : workType === 'essay' ? 'Ensaio Filosófico' : 'Manifesto'}
          abstract={`Tratado elaborado sob os parâmetros de ${methodology}.`}
        />
      )}
    </div>
  );
};
