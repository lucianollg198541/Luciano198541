import React, { useState } from 'react';
import {
  Library,
  Search,
  Filter,
  FileText,
  Trash2,
  Share2,
  Calendar,
  Tag,
  BookMarked,
  ArrowUpRight,
  Download,
  Upload,
  Plus,
} from 'lucide-react';
import { LibraryItem, DocumentType, EpistemicStatus } from '../types/philosophical';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { ExportModal } from './ExportModal';
import { downloadFile } from '../utils/latexExport';

interface Props {
  items: LibraryItem[];
  onDeleteItem: (id: string) => void;
  onAddItem: (item: LibraryItem) => void;
  onSelectForInspection?: (item: LibraryItem) => void;
}

export const PersonalLibrary: React.FC<Props> = ({
  items,
  onDeleteItem,
  onAddItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(items[0] || null);
  const [exportModalItem, setExportModalItem] = useState<LibraryItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || item.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleExportBackup = () => {
    const json = JSON.stringify(items, null, 2);
    downloadFile(`logos_biblioteca_backup_${Date.now()}.json`, json, 'application/json');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => onAddItem(item));
        }
      } catch (err) {
        alert('Erro ao importar arquivo JSON de biblioteca.');
      }
    };
    reader.readAsText(file);
  };

  const getTypeBadgeClass = (type: DocumentType) => {
    switch (type) {
      case 'Tese Acadêmica':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'Ensaio Acadêmico':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Manifesto Filosófico':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      case 'Teste de Estresse':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/40';
      case 'Auditoria de Falácias':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      default:
        return 'bg-stone-900 text-stone-300 border-stone-800';
    }
  };

  return (
    <div className="flex h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
      {/* Left List Column */}
      <div className="w-80 md:w-96 border-r border-stone-800 flex flex-col bg-stone-950/60">
        {/* Header */}
        <div className="p-4 border-b border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Library className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-classical font-semibold text-stone-100">Biblioteca do Logos</h2>
            </div>
            <div className="flex items-center space-x-1">
              <label
                title="Restaurar backup JSON"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded cursor-pointer transition"
              >
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
              <button
                onClick={handleExportBackup}
                title="Exportar backup JSON da biblioteca"
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar teses, ensaios, axiomas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto py-2 text-[11px] no-scrollbar">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition ${
                selectedType === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Todos ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('Tese Acadêmica')}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition ${
                selectedType === 'Tese Acadêmica'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Teses
            </button>
            <button
              onClick={() => setSelectedType('Ensaio Acadêmico')}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition ${
                selectedType === 'Ensaio Acadêmico'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Ensaios
            </button>
            <button
              onClick={() => setSelectedType('Manifesto Filosófico')}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition ${
                selectedType === 'Manifesto Filosófico'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Manifestos
            </button>
            <button
              onClick={() => setSelectedType('Teste de Estresse')}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition ${
                selectedType === 'Teste de Estresse'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Estresse
            </button>
          </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-850">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nenhum tratado encontrado. Salve ensaios ou análises de Sophia para compor seu acervo.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 cursor-pointer transition ${
                    isSelected ? 'bg-stone-900 border-l-2 border-amber-400' : 'hover:bg-stone-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {new Date(item.dateCreated).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="text-xs font-classical font-semibold text-stone-200 line-clamp-2 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-stone-400 font-scholarly line-clamp-2">
                    {item.abstract || item.content.slice(0, 120)}...
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-850"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Preview Column */}
      <div className="flex-1 flex flex-col bg-stone-950/90 overflow-hidden">
        {selectedItem ? (
          <>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/40">
              <div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getTypeBadgeClass(
                    selectedItem.type
                  )}`}
                >
                  {selectedItem.type}
                </span>
                <h1 className="text-xl font-classical font-bold text-amber-300 mt-1">{selectedItem.title}</h1>
                <div className="flex items-center space-x-3 text-xs text-stone-400 mt-1 font-mono">
                  <span>Criado: {new Date(selectedItem.dateCreated).toLocaleDateString('pt-BR')}</span>
                  {selectedItem.epistemicStatus && (
                    <span>&bull; Status: {selectedItem.epistemicStatus}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExportModalItem(selectedItem)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Exportar LaTeX / MD</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Deseja remover "${selectedItem.title}" da biblioteca?`)) {
                      onDeleteItem(selectedItem.id);
                      setSelectedItem(null);
                    }
                  }}
                  className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-stone-800 rounded transition"
                  title="Excluir documento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-stone-900/50 p-8 rounded-xl border border-stone-800/80 shadow-lg">
                <PhilosophicalMarkdown content={selectedItem.content} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-500">
            <Library className="w-12 h-12 mb-3 text-stone-600" />
            <h3 className="text-base font-classical font-semibold text-stone-300">Nenhum documento selecionado</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Selecione um texto à esquerda ou crie novas teses e ensaios com Sophia para salvá-los no codex pessoal.
            </p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {exportModalItem && (
        <ExportModal
          isOpen={true}
          onClose={() => setExportModalItem(null)}
          title={exportModalItem.title}
          content={exportModalItem.content}
          type={exportModalItem.type}
          abstract={exportModalItem.abstract}
        />
      )}
    </div>
  );
};
