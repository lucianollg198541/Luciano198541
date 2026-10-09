import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  GitCompare,
  Zap,
  BookmarkPlus,
  Share2,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';
import { LibraryItem, DocumentType } from '../types/philosophical';

interface Props {
  onSaveToLibrary: (item: LibraryItem) => void;
  initialStressTestText?: string;
}

export const LogicDialecticLab: React.FC<Props> = ({
  onSaveToLibrary,
  initialStressTestText = '',
}) => {
  const [activeModule, setActiveModule] = useState<'stress_test' | 'fallacy_audit' | 'counterarguments' | 'compare_theories'>(
    initialStressTestText ? 'stress_test' : 'stress_test'
  );

  // Stress Test state
  const [stressProposition, setStressProposition] = useState(initialStressTestText || '');
  const [stressContext, setStressContext] = useState('');
  const [stressResult, setStressResult] = useState<string | null>(null);

  // Fallacy state
  const [fallacyArgument, setFallacyArgument] = useState('');
  const [fallacyResult, setFallacyResult] = useState<string | null>(null);

  // Counterargument state
  const [counterThesis, setCounterThesis] = useState('');
  const [counterSchool, setCounterSchool] = useState('Todas as Tradições Opositoras Principais');
  const [counterResult, setCounterResult] = useState<string | null>(null);

  // Compare Theories state
  const [theoryA, setTheoryA] = useState('Racionalismo Cartesiano (Descartes)');
  const [theoryB, setTheoryB] = useState('Empirismo Radical (David Hume)');
  const [compareDimension, setCompareDimension] = useState('Fundamentação do Conhecimento e Causalidade');
  const [compareResult, setCompareResult] = useState<string | null>(null);

  // Generic loading & modal
  const [isLoading, setIsLoading] = useState(false);
  const [exportItem, setExportItem] = useState<{ title: string; content: string; type: DocumentType } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle Stress Test
  const runStressTest = async () => {
    if (!stressProposition.trim()) return;
    setIsLoading(true);
    setStressResult(null);
    try {
      const res = await fetch('/api/sophia/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposition: stressProposition.trim(), context: stressContext.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha ao processar teste de estresse.');
      setStressResult(data.analysis);
    } catch (err: any) {
      setStressResult(`**Erro do Instituto Logos:** ${err?.message || 'Falha na conexão com o servidor.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Fallacy Audit
  const runFallacyAudit = async () => {
    if (!fallacyArgument.trim()) return;
    setIsLoading(true);
    setFallacyResult(null);
    try {
      const res = await fetch('/api/sophia/fallacy-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ argument: fallacyArgument.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha ao analisar falácias.');
      setFallacyResult(data.report);
    } catch (err: any) {
      setFallacyResult(`**Erro do Instituto Logos:** ${err?.message || 'Falha na conexão com o servidor.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Counterarguments
  const runCounterarguments = async () => {
    if (!counterThesis.trim()) return;
    setIsLoading(true);
    setCounterResult(null);
    try {
      const res = await fetch('/api/sophia/counterarguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thesis: counterThesis.trim(), school: counterSchool }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha ao formular contra-argumentos.');
      setCounterResult(data.counterarguments);
    } catch (err: any) {
      setCounterResult(`**Erro do Instituto Logos:** ${err?.message || 'Falha na conexão com o servidor.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Theory Comparison
  const runCompareTheories = async () => {
    if (!theoryA.trim() || !theoryB.trim()) return;
    setIsLoading(true);
    setCompareResult(null);
    try {
      const res = await fetch('/api/sophia/compare-theories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theoryA: theoryA.trim(), theoryB: theoryB.trim(), focusDimension: compareDimension.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Falha ao comparar sistemas filosóficos.');
      setCompareResult(data.comparison);
    } catch (err: any) {
      setCompareResult(`**Erro do Instituto Logos:** ${err?.message || 'Falha na conexão com o servidor.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveActiveResult = (title: string, content: string, type: DocumentType) => {
    const newItem: LibraryItem = {
      id: `lab_${Date.now()}`,
      title,
      type,
      content,
      abstract: `Análise produzida pelo Laboratório de Lógica e Dialética do Instituto Logos.`,
      tags: [type, 'AnaliseFormal', 'Logos'],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    onSaveToLibrary(newItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-stone-900/80 border-b border-stone-800 gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveModule('stress_test')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeModule === 'stress_test'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Teste de Estresse (7 Passos)</span>
          </button>

          <button
            onClick={() => setActiveModule('fallacy_audit')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeModule === 'fallacy_audit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Identificador de Falácias</span>
          </button>

          <button
            onClick={() => setActiveModule('counterarguments')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeModule === 'counterarguments'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Sparring Dialético (Contra-Argumentos)</span>
          </button>

          <button
            onClick={() => setActiveModule('compare_theories')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeModule === 'compare_theories'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-sky-400" />
            <span>Comparador de Teorias</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-stone-500 hidden md:block">
          Logos Institute &bull; Protocolo de Auditoria Racional
        </div>
      </div>

      {/* Main Workspace: 2-column or split screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Input Pane */}
        <div className="w-full lg:w-[420px] p-5 border-r border-stone-800 bg-stone-950/70 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* 1. Stress Test Pane */}
            {activeModule === 'stress_test' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-classical font-bold text-amber-300 mb-1">
                    Protocolo Analítico: Teste de Estresse Sistêmico
                  </h3>
                  <p className="text-xs text-stone-400">
                    Submete uma proposição ao escrutínio clínico de Sophia: pressupostos ocultos, erros categoriais, objeções máximas, poderes explicativo/preditivo e coerência.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                    Proposição / Conjetura sob Exame:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: A consciência fenomênica é um epifenômeno da complexidade de processamento informacional e não possui eficácia causal própria."
                    value={stressProposition}
                    onChange={(e) => setStressProposition(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 font-scholarly leading-relaxed focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                    Contexto Teórico ou Axiomas de Apoio (opcional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Apoiado no funcionalismo computacional de Putnam ou fisicalismo não-redutivo..."
                    value={stressContext}
                    onChange={(e) => setStressContext(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-3 bg-stone-900/50 rounded-lg border border-stone-850 text-[11px] text-stone-400 space-y-1">
                  <div className="font-semibold text-amber-400/90 font-mono">7 Fatores Auditados:</div>
                  <ol className="list-decimal list-inside space-y-0.5 font-mono text-[10px] text-stone-400">
                    <li>Hidden Assumptions (Pressupostos Ocultos)</li>
                    <li>Category Errors (Erros Categoriais)</li>
                    <li>Strongest Counterarguments (Objeções Fortes)</li>
                    <li>Explanatory Power (Poder Explicativo)</li>
                    <li>Predictive Power (Poder Preditivo)</li>
                    <li>Internal Coherence (Coerência Interna)</li>
                    <li>Confidence Assessment (Estabilidade Epistêmica)</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 2. Fallacy Audit Pane */}
            {activeModule === 'fallacy_audit' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-classical font-bold text-emerald-300 mb-1">
                    Auditoria Lógica e Identificação de Falácias
                  </h3>
                  <p className="text-xs text-stone-400">
                    Decomposição silogística formal, cálculo proposicional com LaTeX e diagnóstico de falácias formais e informais sem condescendência.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                    Argumento a Ser Auditado:
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Ex: Se a teoria da relatividade é verdadeira, o espaço-tempo é curvo. Como observamos a curvatura da luz das estrelas no eclipse, logo a teoria da relatividade está demonstrada como verdade absoluta."
                    value={fallacyArgument}
                    onChange={(e) => setFallacyArgument(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 font-scholarly leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-2.5 bg-stone-900/50 rounded-lg border border-stone-850 text-[11px] text-stone-400">
                  <span className="font-mono text-emerald-400 block mb-1 font-semibold">Exemplos Rápidos:</span>
                  <button
                    onClick={() =>
                      setFallacyArgument(
                        'Ninguém conseguiu provar empiricamente que a mente existe independentemente do cérebro. Portanto, o dualismo de substância é falso.'
                      )
                    }
                    className="text-[10px] text-stone-300 hover:text-emerald-300 block text-left underline mb-1"
                  >
                    &bull; Argumentum ad Ignorantiam
                  </button>
                  <button
                    onClick={() =>
                      setFallacyArgument(
                        'Se chove, a rua fica molhada. A rua está molhada, portanto certamente choveu.'
                      )
                    }
                    className="text-[10px] text-stone-300 hover:text-emerald-300 block text-left underline"
                  >
                    &bull; Afirmação do Consequente ($P \\to Q, Q \\vdash P$)
                  </button>
                </div>
              </div>
            )}

            {/* 3. Counterarguments Pane */}
            {activeModule === 'counterarguments' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-classical font-bold text-rose-300 mb-1">
                    Sparring Dialético: Objeções e Steelmanning
                  </h3>
                  <p className="text-xs text-stone-400">
                    Gera as objeções mais rigorosas possíveis a partir de tradições opostas e propõe caminhos de síntese de ordem superior.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                    Tese a Ser Desafiada:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: O imperativo categórico kantiano é a única base moral racional e universalizável."
                    value={counterThesis}
                    onChange={(e) => setCounterThesis(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 font-scholarly leading-relaxed focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                    Escola / Tradição Opositora Alvo:
                  </label>
                  <select
                    value={counterSchool}
                    onChange={(e) => setCounterSchool(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Todas as Tradições Opositoras Principais">Todas as Tradições (Pluralismo Dialético)</option>
                    <option value="Utilitarismo de Regras & Consequencialismo">Utilitarismo & Consequencialismo</option>
                    <option value="Nietzscheanismo & Crítica Genealógica da Moral">Crítica Genealógica & Nietzsche</option>
                    <option value="Empirismo Cético & Relativismo Epistêmico">Empirismo Cético & Anti-realismo</option>
                    <option value="Ética das Virtudes Aristotélico-Tomista">Ética das Virtudes</option>
                  </select>
                </div>
              </div>
            )}

            {/* 4. Compare Theories Pane */}
            {activeModule === 'compare_theories' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-classical font-bold text-sky-300 mb-1">
                    Comparador de Sistemas Filosóficos
                  </h3>
                  <p className="text-xs text-stone-400">
                    Investigação comparativa entre duas teorias, mapeando fundamentos ontológicos, critérios epistêmicos e vulnerabilidades mútuas.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">Teoria / Sistema A:</label>
                  <input
                    type="text"
                    value={theoryA}
                    onChange={(e) => setTheoryA(e.target.value)}
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">Teoria / Sistema B:</label>
                  <input
                    type="text"
                    value={theoryB}
                    onChange={(e) => setTheoryB(e.target.value)}
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-stone-400 block mb-1">Dimensão de Análise:</label>
                  <input
                    type="text"
                    value={compareDimension}
                    onChange={(e) => setCompareDimension(e.target.value)}
                    placeholder="Ex: Critério de Verdade e Epistemologia"
                    className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Quick matrix presets */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-mono text-stone-500 block mb-1">Disputas Canônicas:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      onClick={() => {
                        setTheoryA('Spinoza (Monismo da Substância)');
                        setTheoryB('Leibniz (Pluralismo das Mônadas)');
                        setCompareDimension('Ontologia e Natureza de Deus');
                      }}
                      className="p-1.5 rounded bg-stone-900/60 hover:bg-stone-900 border border-stone-800 text-stone-300 text-left truncate"
                    >
                      Spinoza vs Leibniz
                    </button>
                    <button
                      onClick={() => {
                        setTheoryA('Tractatus Logico-Philosophicus (Wittgenstein I)');
                        setTheoryB('Investigações Filosóficas (Wittgenstein II)');
                        setCompareDimension('Teoria Pictórica vs Jogos de Linguagem');
                      }}
                      className="p-1.5 rounded bg-stone-900/60 hover:bg-stone-900 border border-stone-800 text-stone-300 text-left truncate"
                    >
                      Wittgenstein I vs II
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 border-t border-stone-800">
            {activeModule === 'stress_test' && (
              <button
                onClick={runStressTest}
                disabled={isLoading || !stressProposition.trim()}
                className="w-full p-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-classical font-semibold text-xs flex items-center justify-center space-x-2 transition"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>Executar Teste de Estresse</span>
              </button>
            )}

            {activeModule === 'fallacy_audit' && (
              <button
                onClick={runFallacyAudit}
                disabled={isLoading || !fallacyArgument.trim()}
                className="w-full p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-stone-950 font-classical font-semibold text-xs flex items-center justify-center space-x-2 transition"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
                <span>Auditar Validade & Falácias</span>
              </button>
            )}

            {activeModule === 'counterarguments' && (
              <button
                onClick={runCounterarguments}
                disabled={isLoading || !counterThesis.trim()}
                className="w-full p-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-stone-950 font-classical font-semibold text-xs flex items-center justify-center space-x-2 transition"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>Formular Objeções Máximas</span>
              </button>
            )}

            {activeModule === 'compare_theories' && (
              <button
                onClick={runCompareTheories}
                disabled={isLoading || !theoryA.trim() || !theoryB.trim()}
                className="w-full p-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-stone-950 font-classical font-semibold text-xs flex items-center justify-center space-x-2 transition"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
                <span>Confrontar Sistemas Filosóficos</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Output View */}
        <div className="flex-1 flex flex-col bg-stone-950/90 overflow-hidden">
          {/* Active Result Content */}
          {(() => {
            const currentResult =
              activeModule === 'stress_test'
                ? stressResult
                : activeModule === 'fallacy_audit'
                ? fallacyResult
                : activeModule === 'counterarguments'
                ? counterResult
                : compareResult;

            const currentTitle =
              activeModule === 'stress_test'
                ? `Teste de Estresse: ${stressProposition.slice(0, 50)}...`
                : activeModule === 'fallacy_audit'
                ? `Auditoria de Falácias: ${fallacyArgument.slice(0, 50)}...`
                : activeModule === 'counterarguments'
                ? `Objeções Dialéticas: ${counterThesis.slice(0, 50)}...`
                : `Comparação: ${theoryA} vs ${theoryB}`;

            const currentType: DocumentType =
              activeModule === 'stress_test'
                ? 'Teste de Estresse'
                : activeModule === 'fallacy_audit'
                ? 'Auditoria de Falácias'
                : activeModule === 'counterarguments'
                ? 'Disputa Dialética (Contra-Argumentos)'
                : 'Comparação Teórica';

            if (isLoading) {
              return (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <h3 className="text-sm font-classical font-semibold text-amber-300">
                    Processando com Rigor Epistêmico...
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mt-1">
                    Sophia está aplicando deduções, testes de antinomia e formulações matemáticas em LaTeX.
                  </p>
                </div>
              );
            }

            if (!currentResult) {
              return (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-500">
                  <Scale className="w-10 h-10 mb-2 opacity-40 text-stone-400" />
                  <h3 className="text-sm font-classical font-medium text-stone-300">Aguardando Proposição</h3>
                  <p className="text-xs text-stone-500 max-w-sm mt-1">
                    Preencha os parâmetros no painel à esquerda e execute o módulo dialético selecionado.
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* Result Bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-stone-800 bg-stone-900/60">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                      {currentType}
                    </span>
                    <span className="text-xs font-semibold text-stone-200 truncate max-w-md">{currentTitle}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSaveActiveResult(currentTitle, currentResult, currentType)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{savedSuccess ? 'Salvo no Codex!' : 'Salvar no Codex'}</span>
                    </button>
                    <button
                      onClick={() => setExportItem({ title: currentTitle, content: currentResult, type: currentType })}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Exportar LaTeX / MD</span>
                    </button>
                  </div>
                </div>

                {/* Markdown / KaTeX Result Viewer */}
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="max-w-3xl mx-auto bg-stone-900/50 p-8 rounded-xl border border-stone-800/80 shadow-md">
                    <PhilosophicalMarkdown content={currentResult} />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Export Modal */}
      {exportItem && (
        <ExportModal
          isOpen={true}
          onClose={() => setExportItem(null)}
          title={exportItem.title}
          content={exportItem.content}
          type={exportItem.type}
          abstract="Relatório de investigação analítica do Instituto Logos."
        />
      )}
    </div>
  );
};
