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

export interface DialogueMessage {
  id: string;
  role: 'user' | 'sophia';
  content: string;
  timestamp: string;
  actionContext?: 'stress_test' | 'fallacy_audit' | 'counterargument' | 'thesis_elevation' | 'concept_map' | 'direct_dialogue';
}

export type DocumentType =
  | 'Ensaio Acadêmico'
  | 'Manifesto Filosófico'
  | 'Tese Acadêmica'
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
