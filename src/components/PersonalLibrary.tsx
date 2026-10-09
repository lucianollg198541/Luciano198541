import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ShieldAlert,
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

  // In-app modal confirmation states (replacing window.confirm to function in iframes)
  const [itemToDelete, setItemToDelete] = useState<LibraryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showStressPruneModal, setShowStressPruneModal] = useState(false);
  const [stressTestToKeepId, setStressTestToKeepId] = useState<string>('');

  // Keep selectedItem synchronized when items change
  useEffect(() => {
    if (selectedItem && !items.some((i) => i.id === selectedItem.id)) {
      setSelectedItem(items[0] || null);
    } else if (!selectedItem && items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  // Auto-dismiss toast after 3.5s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const stressTestItems = items.filter((i) => i.type === 'Teste de Estresse');

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
    setToastMessage('Backup exportado com sucesso.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          let count = 0;
          parsed.forEach((item) => {
            if (item && item.id && item.title) {
              onAddItem(item);
              count++;
            }
          });
          setToastMessage(`${count} documentos restaurados com sucesso.`);
        } else {
          setToastMessage('Formato de arquivo inválido: esperado um array JSON.');
        }
      } catch (err) {
        setToastMessage('Falha ao processar arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmSingleDelete = (id: string) => {
    const remaining = items.filter((i) => i.id !== id);
    onDeleteItem(id);
    if (selectedItem?.id === id) {
      setSelectedItem(remaining[0] || null);
    }
    setItemToDelete(null);
    setToastMessage('Documento excluído com sucesso.');
  };

  const handlePruneStressTests = (keepId: string) => {
    const targetsToDelete = stressTestItems.filter((item) => item.id !== keepId);
    targetsToDelete.forEach((item) => onDeleteItem(item.id));

    // Ensure the preserved item is selected
    const preserved = stressTestItems.find((item) => item.id === keepId);
    if (preserved) {
      setSelectedItem(preserved);
    }

    setShowStressPruneModal(false);
    setToastMessage(
      `Excluídos ${targetsToDelete.length} teste(s) de estresse. Apenas 1 foi preservado no acervo.`
    );
  };

  const getTypeBadgeClass = (type: DocumentType) => {
    switch (type) {
      case 'Tese Acadêmica':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'Ensaio Acadêmico':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Fábula ou Diálogo Filosófico':
        return 'bg-teal-950/60 text-teal-300 border-teal-800/40';
      case 'Carta de Sabedoria Prática':
        return 'bg-amber-950/60 text-amber-200 border-amber-800/40';
      case 'Dissecação de Pensamento':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40';
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
    <div className="relative flex h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-900/95 border border-amber-500/40 text-stone-100 shadow-2xl text-xs backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-stone-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left List Column */}
      <div className="w-80 md:w-96 border-r border-stone-800 flex flex-col bg-stone-950/60 shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-1 overflow-x-auto py-1 text-[11px] no-scrollbar">
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
              Estresse ({stressTestItems.length})
            </button>
          </div>

          {/* Special Helper Banner when multiple stress tests exist */}
          {stressTestItems.length > 1 && (
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] text-blue-300 font-medium">
                <span className="flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{stressTestItems.length} Testes de Estresse gravados</span>
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Você pode deixar apenas um teste ativo e descartar os excedentes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStressTestToKeepId(stressTestItems[0].id);
                  setShowStressPruneModal(true);
                }}
                className="w-full py-1 px-2 rounded-md bg-blue-600/25 hover:bg-blue-600/40 border border-blue-500/40 text-[11px] font-semibold text-blue-200 transition flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Deixar apenas 1 Teste de Estresse</span>
              </button>
            </div>
          )}
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
                  className={`group relative p-3.5 cursor-pointer transition ${
                    isSelected ? 'bg-stone-900 border-l-2 border-amber-400' : 'hover:bg-stone-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(item.dateCreated).toLocaleDateString('pt-BR')}
                      </span>
                      {/* Direct Trash Can button on every single card */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(item);
                        }}
                        className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition"
                        title={`Excluir "${item.title}"`}
                        aria-label={`Excluir ${item.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs font-classical font-semibold text-stone-200 line-clamp-2 mb-1 pr-4">
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
              <div className="pr-4">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getTypeBadgeClass(
                    selectedItem.type
                  )}`}
                >
                  {selectedItem.type}
                </span>
                <h1 className="text-xl font-classical font-bold text-amber-300 mt-1 line-clamp-1">
                  {selectedItem.title}
                </h1>
                <div className="flex items-center space-x-3 text-xs text-stone-400 mt-1 font-mono">
                  <span>Criado: {new Date(selectedItem.dateCreated).toLocaleDateString('pt-BR')}</span>
                  {selectedItem.epistemicStatus && (
                    <span>&bull; Status: {selectedItem.epistemicStatus}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setExportModalItem(selectedItem)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Exportar LaTeX / MD</span>
                </button>

                {/* Prominent Trash Button in Detail Toolbar */}
                <button
                  type="button"
                  onClick={() => setItemToDelete(selectedItem)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition"
                  title="Excluir este documento da biblioteca"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Excluir</span>
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
              Selecione um texto à esquerda ou crie novas teses e ensaios com Sophia para salvá-los no acervo permanente.
            </p>
          </div>
        )}
      </div>

      {/* In-App Modal: Confirm Delete Single Item (No window.confirm!) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-classical font-bold text-stone-100">
                  Excluir da Biblioteca
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Tem certeza de que deseja remover permanentemente este documento do seu acervo?
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getTypeBadgeClass(
                    itemToDelete.type
                  )}`}
                >
                  {itemToDelete.type}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {new Date(itemToDelete.dateCreated).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-200 line-clamp-2">
                {itemToDelete.title}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmSingleDelete(itemToDelete.id)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Documento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Modal: Prune Stress Tests to leave exactly ONE */}
      {showStressPruneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-classical font-bold text-stone-100">
                  Deixar Somente 1 Teste de Estresse
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Selecione qual teste de estresse você deseja MANTER. Os outros {stressTestItems.length - 1} serão excluídos permanentemente.
                </p>
              </div>
            </div>

            {/* Radio list of stress tests */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {stressTestItems.map((item, idx) => {
                const isSelectedToKeep = (stressTestToKeepId || stressTestItems[0].id) === item.id;
                return (
                  <label
                    key={item.id}
                    onClick={() => setStressTestToKeepId(item.id)}
                    className={`block p-3 rounded-xl border cursor-pointer transition ${
                      isSelectedToKeep
                        ? 'bg-amber-950/30 border-amber-500/60 text-stone-100'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="stressTestToKeep"
                          checked={isSelectedToKeep}
                          onChange={() => setStressTestToKeepId(item.id)}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-semibold text-amber-300">
                          {idx === 0 ? 'Teste Mais Recente' : `Teste #${idx + 1}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(item.dateCreated).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-200 line-clamp-1 ml-5">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 ml-5 mt-0.5">
                      {item.abstract || item.content.slice(0, 90)}...
                    </p>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <span className="text-[11px] text-stone-400">
                {stressTestItems.length - 1} teste(s) serão removidos.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStressPruneModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handlePruneStressTests(stressTestToKeepId || stressTestItems[0].id)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Manter Selecionado e Excluir Demais</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
