import React, { useState, useMemo } from 'react';
import { Copy, Download, Check, FileText, Code, Eye, X, BookOpen } from 'lucide-react';
import { generateFullLatexDocument, downloadFile } from '../utils/latexExport';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  type?: string;
  abstract?: string;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  content,
  type = 'Tratado Filosófico',
  abstract = '',
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'latex' | 'markdown'>('preview');
  const [copied, setCopied] = useState<string | null>(null);

  const latexCode = useMemo(() => {
    return generateFullLatexDocument({
      title,
      abstract,
      body: content,
      institution: 'Logos Institute — Chief Virtual Philosopher Sophia',
    });
  }, [title, abstract, content]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'logos_document'}.md`;
    downloadFile(filename, `# ${title}\n\n${content}`, 'text/markdown;charset=utf-8');
  };

  const handleDownloadLatex = () => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'logos_document'}.tex`;
    downloadFile(filename, latexCode, 'application/x-latex;charset=utf-8');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80">{type}</span>
              <h2 className="text-lg font-classical font-semibold text-stone-100 truncate max-w-md">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-stone-950/40 border-b border-stone-800/80 gap-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visualização Tipográfica</span>
            </button>
            <button
              onClick={() => setActiveTab('latex')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'latex'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Código LaTeX (.tex)</span>
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'markdown'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {activeTab === 'latex' && (
              <>
                <button
                  onClick={() => handleCopy(latexCode, 'latex')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition"
                >
                  {copied === 'latex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'latex' ? 'Copiado!' : 'Copiar LaTeX'}</span>
                </button>
                <button
                  onClick={handleDownloadLatex}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-600/90 text-stone-900 font-semibold hover:bg-amber-500 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .tex</span>
                </button>
              </>
            )}
            {activeTab === 'markdown' && (
              <>
                <button
                  onClick={() => handleCopy(`# ${title}\n\n${content}`, 'md')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition"
                >
                  {copied === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'md' ? 'Copiado!' : 'Copiar Markdown'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-600/90 text-stone-900 font-semibold hover:bg-amber-500 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .md</span>
                </button>
              </>
            )}
            {activeTab === 'preview' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-800 text-stone-300 hover:bg-stone-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .md</span>
                </button>
                <button
                  onClick={handleDownloadLatex}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-600/90 text-stone-900 font-semibold hover:bg-amber-500 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .tex</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-stone-950/70">
          {activeTab === 'preview' && (
            <div className="max-w-3xl mx-auto bg-stone-900/60 border border-stone-800/80 rounded-xl p-8 shadow-inner">
              <div className="border-b border-stone-800 pb-4 mb-6">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-500/80">Logos Institute Document</span>
                <h1 className="text-2xl font-classical font-bold text-amber-300 mt-1">{title}</h1>
                <p className="text-xs font-mono text-stone-400 mt-2">Sophia, Virtual Philosopher &bull; Logos Academic Archive</p>
              </div>
              <PhilosophicalMarkdown content={content} />
            </div>
          )}

          {activeTab === 'latex' && (
            <div className="relative">
              <pre className="font-logic text-xs text-amber-200/90 bg-stone-950 p-5 rounded-lg border border-stone-800 overflow-x-auto selection:bg-amber-900/50">
                <code>{latexCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="relative">
              <pre className="font-logic text-xs text-stone-300 bg-stone-950 p-5 rounded-lg border border-stone-800 overflow-x-auto whitespace-pre-wrap selection:bg-amber-900/50">
                <code>{`# ${title}\n\n${content}`}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-400">
          <span>Pronto para compilação via pdfLaTeX, XeLaTeX ou leitores acadêmicos de Markdown.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
