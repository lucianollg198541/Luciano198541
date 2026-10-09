export type EpistemicStatus =
  | 'Intuição Pré-Formal'
  | 'Conjetura Heurística'
  | 'Tese Axiomatizada'
  | 'Sistema Formalmente Robusto'
  | 'Problemático / Refutado';

export interface PhilosophicalPremise {
  id: string;
  statement: string;
  category: 'Ontologia' | 'Epistemologia' | 'Lógica Formal' | 'Filosofia da Ciência' | 'Ética / Axiologia';
  formalFormula?: string;
  epistemicStatus: EpistemicStatus;
  dateCreated: string;
  notes?: string;
  isPinned?: boolean;
}

export type QueryClassificationType =
  | 'Consulta Histórica'
  | 'Tese Filosófica'
  | 'Análise Conceitual'
  | 'Questão Científica'
  | 'Pergunta Biográfica'
  | 'Pergunta de Conhecimento Geral'
  | 'Dilema Ético & Humano';

export type AudienceProfile =
  | 'Auto (Dedução Dinâmica)'
  | 'Jovem Pensador (Criança / Jovem)'
  | 'Jovem Aprendiz (Estudante / Juvenil)'
  | 'Cidadão em Reflexão (Vida Prática & Ética)'
  | 'Investigador Acadêmico (Rigor Total)'
  | 'Madureza & Sabedoria (Sênior / Legado)';

export type FontSizeMode = 'normal' | 'large' | 'extralarge';
export type ThemeMode = 'slate' | 'parchment' | 'twilight';

export interface DialogueMessage {
  id: string;
  role: 'user' | 'sophia';
  content: string;
  timestamp: string;
  queryClassification?: string;
  deducedProfile?: string;
  actionContext?: 'stress_test' | 'fallacy_audit' | 'counterargument' | 'thesis_elevation' | 'concept_map' | 'dissection' | 'direct_dialogue';
}

export type DocumentType =
  | 'Ensaio Acadêmico'
  | 'Ensaio Pedagógico'
  | 'Manifesto Filosófico'
  | 'Tese Acadêmica'
  | 'Fábula ou Diálogo Filosófico'
  | 'Carta de Sabedoria Prática'
  | 'Dissecação de Pensamento'
  | 'Teste de Estresse'
  | 'Auditoria de Falácias'
  | 'Disputa Dialética (Contra-Argumentos)'
  | 'Comparação Teórica'
  | 'Mapa Conceitual';

export interface LibraryItem {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  abstract?: string;
  tags: string[];
  dateCreated: string;
  dateModified: string;
  epistemicStatus?: EpistemicStatus;
  latexSource?: string;
  metadata?: {
    topic?: string;
    axioms?: string[];
    school?: string;
    targetAudience?: string;
    confidenceScore?: string;
  };
}

export interface ConceptNode {
  id: string;
  label: string;
  category: 'Axioma' | 'Conceito Central' | 'Desdobramento' | 'Tensão Crítica' | 'Conclusão';
  definition: string;
  formula?: string;
  epistemicStatus?: string;
  x?: number;
  y?: number;
}

export interface ConceptEdge {
  source: string;
  target: string;
  relation: 'implica' | 'fundamenta' | 'contradiz' | 'limita' | 'necessita' | 'sintetiza';
}

export interface ConceptMapData {
  theme: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}
