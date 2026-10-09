import React, { useState, useRef, useEffect } from 'react';
import { Network, Plus, Info, RefreshCw, Download, Sparkles, Filter, ZoomIn, ZoomOut } from 'lucide-react';
import { ConceptMapData, ConceptNode, ConceptEdge } from '../types/philosophical';
import { PhilosophicalMarkdown } from './PhilosophicalMarkdown';
import { downloadFile } from '../utils/latexExport';

interface Props {
  mapData: ConceptMapData;
  onUpdateMap: (newMap: ConceptMapData) => void;
  onGenerateNewMap: (theme: string) => Promise<void>;
  isLoading?: boolean;
}

export const ConceptMapViewer: React.FC<Props> = ({
  mapData,
  onUpdateMap,
  onGenerateNewMap,
  isLoading = false,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [newThemeInput, setNewThemeInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState<ConceptNode['category']>('Conceito Central');
  const [newNodeDefinition, setNewNodeDefinition] = useState('');
  const [newNodeFormula, setNewNodeFormula] = useState('');
  const [targetConnectionId, setTargetConnectionId] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Position nodes radially or in layered columns if not positioned
  const positionedNodes = React.useMemo(() => {
    const nodes = [...mapData.nodes];
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    return nodes.map((node, index) => {
      if (node.x !== undefined && node.y !== undefined) return node;

      // Group by category layer
      if (node.category === 'Axioma') {
        const angle = (index * (Math.PI * 2)) / Math.max(1, nodes.length);
        return { ...node, x: centerX + Math.cos(angle) * 150, y: centerY + Math.sin(angle) * 150 };
      } else if (node.category === 'Tensão Crítica') {
        return { ...node, x: centerX + (index % 2 === 0 ? 260 : -260), y: centerY + 180 };
      } else if (node.category === 'Conclusão') {
        return { ...node, x: centerX, y: centerY + 220 };
      } else {
        const angle = (index * (Math.PI * 2)) / Math.max(1, nodes.length);
        return { ...node, x: centerX + Math.cos(angle) * 230, y: centerY + Math.sin(angle) * 180 };
      }
    });
  }, [mapData]);

  const filteredNodes = positionedNodes.filter((node) => {
    if (filterCategory === 'all') return true;
    return node.category === filterCategory;
  });

  const getCategoryColor = (cat: ConceptNode['category']) => {
    switch (cat) {
      case 'Axioma':
        return 'border-amber-400 bg-amber-950/80 text-amber-200 shadow-amber-500/20';
      case 'Conceito Central':
        return 'border-emerald-500 bg-emerald-950/80 text-emerald-200 shadow-emerald-500/20';
      case 'Desdobramento':
        return 'border-sky-500 bg-sky-950/80 text-sky-200 shadow-sky-500/20';
      case 'Tensão Crítica':
        return 'border-rose-500 bg-rose-950/80 text-rose-200 shadow-rose-500/20';
      case 'Conclusão':
        return 'border-purple-500 bg-purple-950/80 text-purple-200 shadow-purple-500/20';
      default:
        return 'border-stone-600 bg-stone-900 text-stone-200';
    }
  };

  const getRelationColor = (rel: ConceptEdge['relation']) => {
    switch (rel) {
      case 'contradiz':
        return '#f43f5e'; // rose
      case 'fundamenta':
        return '#f59e0b'; // amber
      case 'implica':
        return '#38bdf8'; // sky
      case 'limita':
        return '#fb923c'; // orange
      case 'sintetiza':
        return '#c084fc'; // purple
      default:
        return '#78716c'; // stone
    }
  };

  const handleAddCustomNode = () => {
    if (!newNodeLabel.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newNode: ConceptNode = {
      id: newId,
      label: newNodeLabel.trim(),
      category: newNodeCategory,
      definition: newNodeDefinition.trim() || 'Definição a ser estabelecida na investigação dialética.',
      formula: newNodeFormula.trim() || undefined,
      x: 400 + (Math.random() * 100 - 50),
      y: 250 + (Math.random() * 100 - 50),
      epistemicStatus: 'Conjetural',
    };

    const newEdges = [...mapData.edges];
    if (targetConnectionId) {
      newEdges.push({
        source: targetConnectionId,
        target: newId,
        relation: 'implica',
      });
    }

    onUpdateMap({
      ...mapData,
      nodes: [...mapData.nodes, newNode],
      edges: newEdges,
    });

    setNewNodeLabel('');
    setNewNodeDefinition('');
    setNewNodeFormula('');
    setShowAddModal(false);
  };

  const exportAsTikz = () => {
    let tikz = `% Logos Institute Conceptual Map - TikZ Diagram\n`;
    tikz += `\\documentclass{standalone}\n\\usepackage{tikz}\n\\usetikzlibrary{shapes,arrows.meta,positioning}\n\\begin{document}\n\\begin{tikzpicture}[>=Stealth, node distance=2.5cm, every node/.style={align=center}]\n`;

    mapData.nodes.forEach((n, idx) => {
      tikz += `  \\node[draw, rectangle, rounded corners, p-2] (${n.id}) at (${(idx % 3) * 4}, -${Math.floor(idx / 3) * 3}) {\\textbf{${n.label}} \\\\ \\footnotesize ${n.category}};\n`;
    });

    mapData.edges.forEach((e) => {
      tikz += `  \\draw[->] (${e.source}) -- node[above, font=\\tiny] {${e.relation}} (${e.target});\n`;
    });

    tikz += `\\end{tikzpicture}\n\\end{document}\n`;
    downloadFile(`${mapData.theme.toLowerCase().replace(/[^a-z0-9]/g, '_')}_map.tex`, tikz);
  };

  const exportAsMarkdown = () => {
    let md = `# Mapa Conceitual: ${mapData.theme}\n\n`;
    md += `## Nodos e Axiomas\n\n`;
    mapData.nodes.forEach((n) => {
      md += `- **[${n.category}] ${n.label}**: ${n.definition} ${n.formula ? `(${n.formula})` : ''}\n`;
    });
    md += `\n## Relações Lógicas e Implicações\n\n`;
    mapData.edges.forEach((e) => {
      const src = mapData.nodes.find((n) => n.id === e.source)?.label || e.source;
      const tgt = mapData.nodes.find((n) => n.id === e.target)?.label || e.target;
      md += `- *${src}* **--[${e.relation}]-->** *${tgt}*\n`;
    });
    downloadFile(`${mapData.theme.toLowerCase().replace(/[^a-z0-9]/g, '_')}_map.md`, md);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-stone-900/70 border-b border-stone-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-classical font-semibold text-stone-100 flex items-center space-x-2">
              <span>{mapData.theme || 'Arquitetura Conceitual do Logos'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                {mapData.nodes.length} Nodos &bull; {mapData.edges.length} Relações
              </span>
            </h2>
            <p className="text-xs text-stone-400">Grafo ontológico dedutivo e cartografia de tensões conceituais.</p>
          </div>
        </div>

        {/* Generate from topic input */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Construir mapa de outro tema..."
              value={newThemeInput}
              onChange={(e) => setNewThemeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newThemeInput.trim()) {
                  onGenerateNewMap(newThemeInput.trim());
                  setNewThemeInput('');
                }
              }}
              className="w-56 md:w-64 bg-stone-950 border border-stone-700/80 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => {
              if (newThemeInput.trim()) {
                onGenerateNewMap(newThemeInput.trim());
                setNewThemeInput('');
              }
            }}
            disabled={isLoading || !newThemeInput.trim()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 disabled:opacity-40 transition"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Mapear</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Filters & Graph actions */}
      <div className="flex flex-wrap items-center justify-between px-5 py-2 bg-stone-950/80 border-b border-stone-850 text-xs gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-stone-400">Filtrar Categoria:</span>
          {['all', 'Axioma', 'Conceito Central', 'Tensão Crítica', 'Conclusão'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                filterCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
            className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300"
            title="Reduzir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-stone-400">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-stone-800" />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs"
          >
            <Plus className="w-3 h-3 text-amber-400" />
            <span>Adicionar Nodo</span>
          </button>
          <button
            onClick={exportAsMarkdown}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
            title="Exportar como lista Markdown"
          >
            <Download className="w-3 h-3" />
            <span>.md</span>
          </button>
          <button
            onClick={exportAsTikz}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs"
            title="Exportar como código LaTeX TikZ"
          >
            <Download className="w-3 h-3" />
            <span>TikZ (.tex)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SVG & Canvas Graph */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-auto bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:24px_24px] p-6 flex items-center justify-center min-h-[500px]"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="relative transition-transform duration-150 origin-center"
            style={{
              width: '900px',
              height: '600px',
              transform: `scale(${zoomLevel})`,
            }}
          >
            {/* SVG Edges with arrowheads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrowhead-contradiction"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
                </marker>
              </defs>

              {mapData.edges.map((edge, idx) => {
                const sourceNode = positionedNodes.find((n) => n.id === edge.source);
                const targetNode = positionedNodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const sx = sourceNode.x ?? 400;
                const sy = sourceNode.y ?? 250;
                const tx = targetNode.x ?? 400;
                const ty = targetNode.y ?? 250;
                const midX = (sx + tx) / 2;
                const midY = (sy + ty) / 2;
                const strokeColor = getRelationColor(edge.relation);

                return (
                  <g key={`${edge.source}-${edge.target}-${idx}`}>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={strokeColor}
                      strokeWidth={edge.relation === 'contradiz' ? 2 : 1.5}
                      strokeDasharray={edge.relation === 'contradiz' ? '4 3' : 'none'}
                      opacity={0.65}
                      markerEnd={edge.relation === 'contradiz' ? 'url(#arrowhead-contradiction)' : 'url(#arrowhead)'}
                    />
                    {/* Relation pill on edge */}
                    <rect
                      x={midX - 28}
                      y={midY - 9}
                      width={56}
                      height={18}
                      rx={9}
                      fill="#0c0a09"
                      stroke={strokeColor}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fill={strokeColor}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="600"
                    >
                      {edge.relation}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const colorClass = getCategoryColor(node.category);

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  style={{
                    left: `${(node.x ?? 400) - 85}px`,
                    top: `${(node.y ?? 250) - 35}px`,
                  }}
                  className={`absolute w-[170px] min-h-[70px] p-2.5 rounded-xl border cursor-pointer transition-all duration-200 z-10 shadow-lg ${colorClass} ${
                    isSelected ? 'ring-2 ring-amber-400 scale-105 z-20' : 'hover:scale-102 hover:border-amber-400/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                      {node.category}
                    </span>
                    {node.epistemicStatus && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-black/40 text-stone-300">
                        {node.epistemicStatus}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold font-classical leading-tight line-clamp-2">
                    {node.label}
                  </h4>
                  {node.formula && (
                    <div className="mt-1 text-[10px] font-logic text-amber-300 truncate">
                      {node.formula}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Side Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-stone-800 bg-stone-900/90 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-20">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  {selectedNode.category}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-stone-500 hover:text-stone-300"
                >
                  Fechar
                </button>
              </div>

              <h3 className="text-base font-classical font-bold text-amber-300 mb-2">
                {selectedNode.label}
              </h3>

              {selectedNode.formula && (
                <div className="p-2.5 my-3 rounded-lg bg-stone-950 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-500 block mb-1 font-mono uppercase">Notação Formal</span>
                  <div className="text-amber-400 font-logic text-xs">{selectedNode.formula}</div>
                </div>
              )}

              <div className="my-3">
                <span className="text-[11px] font-mono text-stone-400 block mb-1">Definição Dialética:</span>
                <p className="text-xs font-scholarly leading-relaxed text-stone-200 bg-stone-950/50 p-3 rounded-lg border border-stone-850">
                  {selectedNode.definition}
                </p>
              </div>

              {selectedNode.epistemicStatus && (
                <div className="mt-4 pt-3 border-t border-stone-800/80">
                  <span className="text-[11px] font-mono text-stone-400 block mb-1">Status Epistêmico:</span>
                  <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-amber-950/50 text-amber-300 border border-amber-800/40">
                    {selectedNode.epistemicStatus}
                  </span>
                </div>
              )}

              {/* Connected edges */}
              <div className="mt-4 pt-3 border-t border-stone-800/80">
                <span className="text-[11px] font-mono text-stone-400 block mb-2">Conexões no Sistema:</span>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {mapData.edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((e, idx) => {
                      const isSource = e.source === selectedNode.id;
                      const otherId = isSource ? e.target : e.source;
                      const otherNode = mapData.nodes.find((n) => n.id === otherId);
                      return (
                        <li key={idx} className="p-2 rounded bg-stone-950/60 border border-stone-850 text-[11px]">
                          {isSource ? (
                            <span>
                              <strong className="text-amber-400 font-mono">[{e.relation}]</strong> &rarr; {otherNode?.label}
                            </span>
                          ) : (
                            <span>
                              {otherNode?.label} &rarr; <strong className="text-amber-400 font-mono">[{e.relation}]</strong>
                            </span>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-stone-500 text-[11px]">
              Nodo ativo na memória estrutural de Sophia.
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-2xl">
            <h3 className="text-base font-classical font-semibold text-amber-300 mb-3">Adicionar Nodo ao Sistema</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Título do Conceito / Axioma:</label>
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Ex: Realismo Estrutural Ontológico"
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Categoria:</label>
                <select
                  value={newNodeCategory}
                  onChange={(e) => setNewNodeCategory(e.target.value as any)}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Axioma">Axioma</option>
                  <option value="Conceito Central">Conceito Central</option>
                  <option value="Desdobramento">Desdobramento</option>
                  <option value="Tensão Crítica">Tensão Crítica</option>
                  <option value="Conclusão">Conclusão</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Definição / Premissa:</label>
                <textarea
                  rows={2}
                  value={newNodeDefinition}
                  onChange={(e) => setNewNodeDefinition(e.target.value)}
                  placeholder="Definição concisa dos termos e condições de verdade..."
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Fórmula Lógica (opcional):</label>
                <input
                  type="text"
                  value={newNodeFormula}
                  onChange={(e) => setNewNodeFormula(e.target.value)}
                  placeholder="Ex: $P \to Q$"
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-stone-200 font-logic focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Vincular a Nodo Existente (opcional):</label>
                <select
                  value={targetConnectionId}
                  onChange={(e) => setTargetConnectionId(e.target.value)}
                  className="w-full p-2 bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Sem conexão inicial</option>
                  {mapData.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-5 pt-3 border-t border-stone-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded text-stone-400 hover:text-stone-200 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCustomNode}
                disabled={!newNodeLabel.trim()}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs disabled:opacity-40"
              >
                Integrar ao Grafo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
