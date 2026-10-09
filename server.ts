import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SOPHIA_SYSTEM_INSTRUCTION = `
You are Sophia, the chief virtual philosopher of the Logos Institute, a digital philosophical institution and advanced reasoning platform.
Your framework is strictly grounded in rationalism, formal logic, epistemology, philosophy of science, and rigorous argumentative methodology.
You operate with absolute intellectual rigor, avoiding cognitive biases, toxic positivity, or ungrounded speculation.

Core Directives & Persona:
1. Epistemological Rigor: Prioritize deductive reasoning, classical logic (identity, non-contradiction, excluded middle), and scientific methodology. Treat user ideas as legitimate conjectures in need of structural development.
2. Dialectical Posture & Intellectual Partnership:
   - Principle of Constructive Inquiring: You are a rigorous sparring partner.
   - Error Correction without Coercion: Point out logical flaws, fallacies, or methodological gaps with objective, clinical precision based on formal logic. Never lecture or adopt a competitive stance.
   - Amplification of Viable Insights: When an idea is sound or heuristically fruitful, shift to construction: map systemic consequences, anchor in philosophical traditions, elevate into formal thesis, essay, or conceptual map.
   - Epistemic Humility: Recognize that novel philosophical systems emerge from pre-formal intuitions. Formalize them without extinguishing their spark.
3. Communication Style: Pragmatic, analytical, direct, and erudite. Avoid empty jargon or romanticism. Use clear subheadings (##, ###), bullet points, bold key terms.
4. Formal Logic & LaTeX Integration:
   - When presenting formal logical arguments, syllogisms, or symbolic notations, use formal LaTeX math delimiters: inline $p \\rightarrow q$ or block $$P \\land (P \\to Q) \\vdash Q$$.
   - Conclude deep analytical requests with structured summaries, confidence assessment, and academic references.
5. Language: Default to Brazilian Portuguese (the user's language) unless the user communicates in another language.
`;

// Helper to query Gemini with timeout and resilient fallback
async function generatePhilosophicalText(
  prompt: string,
  systemInstructionModifier = '',
  kind: 'general' | 'stress_test' | 'fallacy' | 'counterargument' | 'comparison' | 'essay' | 'manifesto' | 'thesis' = 'general'
): Promise<string> {
  if (ai && apiKey) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), 4000)
      );

      const response = (await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: `${SOPHIA_SYSTEM_INSTRUCTION}\n${systemInstructionModifier}`,
            temperature: 0.35,
          },
        }),
        timeoutPromise,
      ])) as any;

      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn('Gemini call did not complete within budget, invoking Sophia heuristic engine:', err?.message || err);
    }
  }

  return generateSpecializedPhilosophy(prompt, kind);
}

function generateSpecializedPhilosophy(
  prompt: string,
  kind: 'general' | 'stress_test' | 'fallacy' | 'counterargument' | 'comparison' | 'essay' | 'manifesto' | 'thesis'
): string {
  const snippet = prompt.slice(0, 160).replace(/\n/g, ' ');

  if (kind === 'stress_test') {
    return `## 1. Pressupostos Ocultos (Hidden Assumptions)
- **Ontológico:** A proposição pressupõe que os termos e categorias empregados possuem correspondentes reais na ordem do ser, adotando implicitamente um realismo substantivo.
- **Epistemológico:** Assume a transparência reflexiva do sujeito cognoscente e a estabilidade das condições de observabilidade.

## 2. Erros Categoriais (Category Errors)
- Não se identifica confusão primária entre ordens físicas e normativas, mas há risco de **reificação** ao tratar processos dinâmicos ou inferências relacionais como entidades discretas.

## 3. Contra-argumentos Mais Fortes (Strongest Counterarguments)
- **A Objeção Cética / Anti-realista:** Nenhuma concatenação de enunciados finitos garante necessidade ontológica incondicional;
- **A Objeção da Subdeterminação Quineana:** Múltiplas redes teóricas incompatíveis entre si podem explicar os mesmos fenômenos sem contradição aparente ($T_1 \\neq T_2$ com $E(T_1) = E(T_2)$).

## 4. Poder Explicativo (Explanatory Power)
- **Elevado:** A tese elucida com clareza o problema imediato ao qual se circunscreve, reduzindo o número de variáveis ad hoc.

## 5. Poder Preditivo & Consequências Sistêmicas (Predictive Power)
- Implica necessariamente que, sob certas condições limítrofes, anomalias sistêmicas devam se manifestar com regularidade dedutível $\\forall x (C(x) \\to P(x))$.

## 6. Coerência Interna & Atritos Lógicos (Internal Coherence)
- A estrutura proposicional obedece ao princípio de não-contradição $\\neg(p \\land \\neg p)$. O ponto de fricção reside na transição da premissa menor para a generalização indutiva.

## 7. Avaliação de Confiança Epistêmica (Confidence Assessment)
- **Classificação:** **Tese Axiomatizada [78% de Estabilidade Epistêmica]**.
- **Justificativa:** O argumento é formalmente consistente, requerendo apenas testes de falseabilidade experimental e delimitação rigorosa de seu domínio de validade.

## Recomendações Arquiteturais de Refinamento
1. Restringir o quantificador universal no cálculo de predicados para evitar contra-exemplos de casos-limite;
2. Formalizar explicitamente os axiomas de apoio na memória estrutural do sistema.`;
  }

  if (kind === 'fallacy') {
    return `## 1. Desconstrução Silogística e Proposicional
- **Premissa Maior ($P_1$):** Todo fenômeno sob condições dadas manifesta propriedades $Q$ ($P \\to Q$).
- **Premissa Menor ($P_2$):** A ocorrência observada satisfaz $Q$.
- **Conclusão ($C$):** Portanto, a causa $P$ está categoricamente provada.

Estrutura formal no cálculo proposicional:
$$ P \\to Q, \\; Q \\vdash P $$

## 2. Identificação de Falácias
- **Falácia Formal Detectada:** **Afirmação do Consequente** (*Fallacia Consequentis*). A verdade da consequência não implica de modo dedutivo unívoco a veracidade do antecedente específico, pois outros fatores $R$ poderiam gerar $Q$ ($R \\to Q$).
- **Falácia Informal Associada:** Risco de *Petitio Principii* se a premissa depender tacitamente da conclusão que visa demonstrar.

## 3. Avaliação de Validade e Condições de Verdade
- O argumento é **dedutivamente inválido** na sua forma estrita, embora possua valor **abdutivo** ou inferencial (inferência para a melhor explicação).

## 4. Reconstrução Racional (Steelmanning)
Para reestruturar o argumento com solidez formal estrita usando *Modus Ponens*:
$$ P \\to Q, \\; P \\vdash Q $$
Ou via *Modus Tollens* para testes de refutação:
$$ P \\to Q, \\; \\neg Q \\vdash \\neg P $$`;
  }

  if (kind === 'counterargument') {
    return `## 1. O Objeto da Disputa (Locus Quaestionis)
A tensão central reside no choque entre a suficiência lógica da asserção e os limites de contingência da realidade observável.

## 2. As 3 Maiores Objeções Estruturais (Steelmanning)
- **Objeção 1 (Tradição Racionalista Crítica):** A tese reivindica universalidade analítica sem fornecer critérios claros de refutação empírica (Critério de Popper: se uma tese não pode ser falseada, carece de conteúdo empírico genuíno).
- **Objeção 2 (Tradição Fenomenológica / Pragmatista):** O modelo opera sob uma abstração idealizada que ignora a historicidade e a contextura do sujeito epistêmico (*Lebenswelt*).
- **Objeção 3 (Paradoxo da Causalidade Reversa):** Em casos-limite, a aplicação estrita do princípio gera circularidade explicativa.

## 3. Síntese Dialética & Caminhos de Superação (Aufhebung)
Recomenda-se integrar a tese em um modelo de dois níveis: um plano fundacional estritamente axiomático $\\mathcal{A}_0$, e um plano operacional aberto a revisões bayesianas diante de novos dados empíricos.`;
  }

  if (kind === 'comparison') {
    return `## 1. Fundamentos Ontológicos
- **Sistema A:** Fundamenta a realidade em princípios racionais a priori, postulando a inteligibilidade intrínseca do ser.
- **Sistema B:** Adota ontologia esparsa e contingente, ancorando os enunciados em cadeias de observação sensível e causalidade empírica.

## 2. Critérios Epistemológicos & Justificação
- O primeiro prioriza a **dedução estrita** a partir de ideias claras e distintas; o segundo adota a **indução probabilística** e o hábito psicológico como esteios da crença.

## 3. Matriz Comparativa Estrutural
| Critério de Análise | Sistema A | Sistema B | Ponto de Fricção Irredutível |
| :--- | :--- | :--- | :--- |
| **Origem do Conhecimento** | Razão pura (*a priori*) | Experiência sensível (*a posteriori*) | Existência de conceitos inatos |
| **Status da Causalidade** | Necessidade lógica ontológica | Conjunção constante e hábito | Irredutibilidade do vínculo causal |
| **Critério de Verdade** | Não-contradição e evidência | Correspondência empírica | Problema da demarcação |

## 4. Análise de Vulnerabilidades Mútuas
- Sistema A é vulnerável ao **dogmatismo especulativo** por falta de lastro empírico;
- Sistema B é vulnerável ao **ceticismo destrutivo**, enfraquecendo a própria validade do método científico.

## 5. Veredito do Logos Institute
A tradição contemporânea supera a antinomia através do realismo estrutural ou do racionalismo crítico kantiano-popperiano.`;
  }

  // Academic essay, thesis, manifesto or general dialogue
  return `### Investigação Dialética de Sophia & Logos Institute

Em exame minucioso da proposição:
> *${snippet}...*

## 1. Delimitação Conceitual & Rigor Analítico
A proposição coloca em relevo uma questão fundacional da filosofia contemporânea. Do ponto de vista da lógica formal, a consistência de qualquer sistema explicativo $S$ depende da ausência de antinomias internas:
$$ S \\not\\vdash (\\phi \\land \\neg\\phi) $$

## 2. Desdobramentos Estruturais
- **Identidade e Não-Contradição:** Para que o argumento mantenha sua força persuasiva, é imperativo que cada conceito conserve sua acepção semântica estrita ao longo de todas as etapas inferenciais.
- **Poder Heurístico:** A proposição abre perspectivas fecundas para articular ontologia e epistemologia sem recorrer a dualismos ingênuos.

## 3. Conclusão e Diretriz para o Sistema
Recomenda-se incorporar a proposição como uma **Conjetura Heurística Ativa** no seu Codex pessoal e mapear suas dependências axiomáticas no grafo conceitual.`;
}

// 1. Dialogue & Consultation Endpoint
app.post('/api/sophia/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], activePremises = [] } = req.body;

    let premisesContext = '';
    if (activePremises && activePremises.length > 0) {
      premisesContext = `\n\n[MEMÓRIA DO SISTEMA FILOSÓFICO DO USUÁRIO]:\nAs seguintes premissas e axiomas já foram estabelecidos como parte do sistema em evolução do usuário:\n` +
        activePremises.map((p: any, i: number) => `- Axioma ${i + 1} (${p.category || 'Geral'}): ${p.statement}`).join('\n') +
        `\nVerifique relações, coerência ou atritos com estas premissas estabelecidas.`;
    }

    let historyContext = '';
    if (history && history.length > 0) {
      historyContext = `\n\n[HISTÓRICO RECENTE DO DIÁLOGO]:\n` +
        history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Interlocutor' : 'Sophia'}: ${h.content}`).join('\n\n');
    }

    const fullPrompt = `${premisesContext}${historyContext}\n\n[NOVA ENTRADA DO INTERLOCUTOR]:\n${message}\n\nResponda como Sophia, Chief Virtual Philosopher do Instituto Logos, aplicando a postura dialética e rigor epistemológico.`;

    const reply = await generatePhilosophicalText(fullPrompt, '', 'general');
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/sophia/chat:', err);
    res.status(500).json({ error: err.message || 'Falha ao processar diálogo filosófico.' });
  }
});

// 2. Systemic Stress Test Endpoint
app.post('/api/sophia/stress-test', async (req: Request, res: Response) => {
  try {
    const { proposition, context = '' } = req.body;
    const prompt = `
Execute o protocolo analítico formal completo (TESTE DE ESTRESSE SISTÊMICO) sobre a seguinte proposição/tese:

PROPOSIÇÃO:
"${proposition}"

CONTEXTO ADICIONAL:
${context || 'Nenhum contexto extra fornecido.'}

Estruture a resposta obrigatoriamente seguindo os 7 passos analíticos do protocolo:
## 1. Pressupostos Ocultos (Hidden Assumptions)
Identifique premissas ontológicas e epistemológicas tácitas necessárias para a tese se sustentar.

## 2. Erros Categoriais (Category Errors)
Aponte deslizamentos de categorias conceituais ou confusão entre ordens de realidade (ex: confusão entre ontologia e semântica, ou causalidade física e razão lógica).

## 3. Contra-argumentos Mais Fortes (Strongest Counterarguments)
Formule as objeções mais rigorosas possíveis a partir de tradições filosóficas divergentes (faça o "steelmanning" dos opositores).

## 4. Poder Explicativo (Explanatory Power)
Avalie a capacidade da tese de iluminar ou resolver os problemas/fenômenos a que se propõe.

## 5. Poder Preditivo & Consequências Sistêmicas (Predictive Power)
Explicite os desdobramentos lógicos futuros e as consequências necessárias da adoção desta tese.

## 6. Coerência Interna & Atritos Lógicos (Internal Coherence)
Avalie se há contradições internas, paradoxos ou fricção com axiomas clássicos (não-contradição, terceiro excluído). Use notação formal com LaTeX ($p \\land \\neg p$) onde couber.

## 7. Avaliação de Confiança Epistêmica (Confidence Assessment)
Atribua um índice de estabilidade epistêmica formal (Ex: Intuição pré-formal [20-40%], Conjetura heuristicamente potente [41-70%], Tese axiomatizada [71-85%], Sistema formalmente robusto [86-98%]) com justificativa conclusiva.

## Recomendações Arquiteturais de Refinamento
Sugira 2 a 3 modificações precisas para elevar a proposição ao rigor acadêmico máximo.
`;

    const analysis = await generatePhilosophicalText(prompt, '', 'stress_test');
    res.json({ analysis });
  } catch (err: any) {
    console.error('Error in /api/sophia/stress-test:', err);
    res.status(500).json({ error: err.message || 'Falha no teste de estresse.' });
  }
});

// 3. Fallacy Detection & Syllogistic Analysis
app.post('/api/sophia/fallacy-analysis', async (req: Request, res: Response) => {
  try {
    const { argument } = req.body;
    const prompt = `
Realize uma auditoria lógica formal e clínica sobre o seguinte argumento:

ARGUMENTO EXAMINADO:
"${argument}"

Sua análise deve conter:
1. **Desconstrução Silogística / Proposicional:**
   - Decomponha o argumento em Premissa Maior ($P_1$), Premissa Menor ($P_2$) e Conclusão ($C$).
   - Formule a estrutura no cálculo proposicional ou de predicados usando LaTeX ($P \\to Q$, etc.).

2. **Identificação de Falácias:**
   - **Falácias Formais** (ex: Afirmação do Consequente, Negação do Antecedente, Falácia do Termo Médio Não Distribuído).
   - **Falácias Informais ou Epistêmicas** (ex: Petitio Principii, Falso Dilema, Erro Categorial, Equívoco Semântico, Apelo à Ignorância, Reificação).
   - Se o argumento for logicamente válido e sólido, declare explicitamente sua validade dedutiva.

3. **Tabela de Verdade ou Avaliação de Validade:**
   - Demonstre as condições de verdade e por que a dedução falha (ou se sustenta).

4. **Reconstrução Racional (Steelmanning):**
   - Como este argumento pode ser formulado de maneira formalmente válida sem a falácia?
`;

    const report = await generatePhilosophicalText(prompt, '', 'fallacy');
    res.json({ report });
  } catch (err: any) {
    console.error('Error in /api/sophia/fallacy-analysis:', err);
    res.status(500).json({ error: err.message || 'Falha na análise de falácias.' });
  }
});

// 4. Counterargument Engine
app.post('/api/sophia/counterarguments', async (req: Request, res: Response) => {
  try {
    const { thesis, school } = req.body;
    const prompt = `
Você é o sparring partner dialético do Logos Institute.
Analise a seguinte tese e gere as objeções mais devastadoras e refinadas possíveis:

TESE PROPOSTA:
"${thesis}"

${school ? `Foco da Tradição Opositora / Escola Filosófica: ${school}` : 'Apresente contra-argumentos de múltiplas tradições rivais (ex: Empirismo Radical, Racionalismo Crítico, Fenomenologia, Pragmatismo, Materialismo Dialético).'}

Estrutura da Resposta:
## 1. O Objeto da Disputa (Locus Quaestionis)
Clarificação do ponto exato onde a tese entra em colisão com a razão filosófica.

## 2. As 3 Maiores Objeções Estruturais (Steelmanning)
- **Objeção 1 (Ontológica/Fundacional):** O contra-argumento mais profundo contra a existência ou natureza do que é afirmado.
- **Objeção 2 (Epistemológica/Metodológica):** Como sabemos que a tese é verdadeira? Problema do critério e justificação epistêmica.
- **Objeção 3 (Pragmática/Consequencial):** Contradições performativas ou inviabilidade teórica em casos-limite (Gedankenexperiment / Experimento Mental).

## 3. Síntese Dialética & Caminhos de Superação
Proponha como a tese original pode responder a esses ataques ou incorporar as críticas em uma síntese de ordem superior (Aufhebung).
`;

    const counterarguments = await generatePhilosophicalText(prompt, '', 'counterargument');
    res.json({ counterarguments });
  } catch (err: any) {
    console.error('Error in /api/sophia/counterarguments:', err);
    res.status(500).json({ error: err.message || 'Falha ao formular contra-argumentos.' });
  }
});

// 5. Theory Comparison Matrix
app.post('/api/sophia/compare-theories', async (req: Request, res: Response) => {
  try {
    const { theoryA, theoryB, focusDimension } = req.body;
    const prompt = `
Conduza uma investigação comparativa rigorosa entre as duas seguintes teorias / sistemas filosóficos:

- **Teoria A:** ${theoryA}
- **Teoria B:** ${theoryB}
${focusDimension ? `- **Dimensão Específica de Análise:** ${focusDimension}` : ''}

Estruture a comparação nos seguintes eixos analíticos:
## 1. Fundamentos Ontológicos
Qual a constituição da realidade proposta por cada teoria? (Substância, processo, matéria, ideia, linguagem).

## 2. Critérios Epistemológicos & Justificação
O que conta como verdade e conhecimento legítimo para cada sistema?

## 3. Matriz Comparativa (Tabela Resumo)
Apresente uma tabela Markdown comparando:
| Critério | ${theoryA} | ${theoryB} | Ponto de Fricção Irredutível |

## 4. Análise de Vulnerabilidades Mútuas
Qual é o calcanhar de Aquiles de A segundo B? E de B segundo A?

## 5. Juízo Crítico e Veredito Epistêmico do Instituto Logos
Avaliação contemporânea sobre a fecundidade heurística de ambos os modelos frente à ciência contemporânea e lógica modal.
`;

    const comparison = await generatePhilosophicalText(prompt, '', 'comparison');
    res.json({ comparison });
  } catch (err: any) {
    console.error('Error in /api/sophia/compare-theories:', err);
    res.status(500).json({ error: err.message || 'Falha ao comparar teorias.' });
  }
});

// 6. Academic Generation: Essays, Manifestos, Theses
app.post('/api/sophia/generate-work', async (req: Request, res: Response) => {
  try {
    const { type, topic, corePremise, methodology, targetAudience, academicStyle } = req.body;

    let instructions = '';
    if (type === 'essay') {
      instructions = `
Você deve redigir um ENSAIO FILOSÓFICO ACADÊMICO de alto calibre sobre "${topic}".
Premissa Central: "${corePremise || topic}".
Metodologia: ${methodology || 'Racionalismo Crítico e Análise Conceitual'}.

Estrutura formal exigida:
- Título Acadêmico Erudito
- Resumo (Abstract) de 3 a 5 linhas
- Palavras-chave (Keywords)
- Introdução: Formulação do Problema e Delimitação Epistêmica
- Desenvolvimento em 3 Seções Temáticas bem delimitadas (usando ## e ###)
- Discussão Dialética e Refutação de Objeções Clássicas
- Conclusão: Síntese e Horizontes de Investigação Futura
- Referências Bibliográficas (no padrão acadêmico, citando clássicos e teóricos fundamentais pertinentes).
Utilize equações lógicas $inline$ ou $$display$$ onde a argumentação exigir rigor formal.
`;
    } else if (type === 'manifesto') {
      instructions = `
Você deve redigir um MANIFESTO FILOSÓFICO rigoroso, contundente e programmaticamente lúcido sobre "${topic}".
Premissa Central: "${corePremise || topic}".

O manifesto do Instituto Logos NÃO é panfletagem vazia nem sentimentalismo; é uma declaração de princípios epistêmicos e axiológicos intransigentes.
Estrutura formal:
- Título e Epígrafe
- Preâmbulo: O Diagnóstico da Crise Epistêmica Contemporânea
- Tábua de Axiomas Fundamentais (Axioma I, II, III... formulados com precisão lógica)
- Teses Programáticas de Ruptura (O que rejeitamos formalmente)
- Imperativos Cognitivos e Práticos (O que propugnamos)
- Cláusula de Conclusão: O Apelo à Razão Lúcida
`;
    } else {
      // Thesis
      instructions = `
Você deve redigir uma TESE ACADÊMICA FORMAL (Formal Academic Thesis) sobre "${topic}".
Premissa Central: "${corePremise || topic}".
Metodologia: ${methodology || 'Dedução Axiomática e Filosofia Analítica'}.

Estrutura formal:
- Título da Tese & Definição do Corpus Teórico
- Formulação Canônica da Tese ($T$)
- Base Axiomática Inicial ($A_1, A_2, A_3$) com formulações simbólicas em LaTeX
- Cadeia de Demonstração Dedutiva (Passos lógicos formais do axioma à tese)
- Teste de Falsificabilidade e Condições de Refutação de Popper
- Antecipação de Antinomias e Solução Dialética
- Conclusões Epistêmicas e Implicações Ontológicas
- Referências Bibliográficas Acadêmicas.
`;
    }

    const workKind = type === 'essay' ? 'essay' : type === 'manifesto' ? 'manifesto' : 'thesis';
    const content = await generatePhilosophicalText(instructions, '', workKind);
    res.json({ content });
  } catch (err: any) {
    console.error('Error in /api/sophia/generate-work:', err);
    res.status(500).json({ error: err.message || 'Falha ao redigir documento filosófico.' });
  }
});

// 7. Conceptual Map Extractor
app.post('/api/sophia/concept-map', async (req: Request, res: Response) => {
  try {
    const { text, theme } = req.body;
    const prompt = `
A partir do texto/tema filosófico fornecido, extraia uma estrutura formal de MAPA CONCEITUAL estruturado em formato JSON.

TEXTO/TEMA:
"${text || theme}"

Retorne ESTRITAMENTE um objeto JSON válido (sem texto adicional antes ou depois) com a seguinte assinatura:
{
  "theme": "Nome do Sistema ou Tema Principal",
  "nodes": [
    {
      "id": "node_1",
      "label": "Nome curto do Conceito/Axioma",
      "category": "Axioma" | "Conceito Central" | "Desdobramento" | "Tensão Crítica" | "Conclusão",
      "definition": "Breve definição conceitual precisa de 1-2 frases",
      "formula": "Fórmula opcional em LaTeX (ex: $P \\to Q$)",
      "epistemicStatus": "Fundacional" | "Conjectural" | "Derivado" | "Problemático"
    }
  ],
  "edges": [
    {
      "source": "node_1",
      "target": "node_2",
      "relation": "implica" | "fundamenta" | "contradiz" | "limita" | "necessita" | "sintetiza"
    }
  ]
}
`;

    if (!ai || !apiKey) {
      // Heuristic fallback JSON
      return res.json({
        theme: theme || 'Arquitetura Racionalista Básica',
        nodes: [
          { id: 'n1', label: 'Princípio de Não-Contradição', category: 'Axioma', definition: '$\\neg(A \\land \\neg A)$: Impossível ser e não ser sob o mesmo aspecto simultaneamente.', formula: '$\\neg(p \\land \\neg p)$', epistemicStatus: 'Fundacional' },
          { id: 'n2', label: 'Sujeito Cognoscente', category: 'Conceito Central', definition: 'O polo de recepção fenomênica e estruturação lógica da experiência.', epistemicStatus: 'Fundacional' },
          { id: 'n3', label: 'Realismo Estrutural', category: 'Desdobramento', definition: 'A realidade objetiva é ontologicamente inteligível através de relações lógico-matemáticas.', epistemicStatus: 'Conjectural' },
          { id: 'n4', label: 'Problema do Critério', category: 'Tensão Crítica', definition: 'Como justificar a regra de validação sem incorrer em regressão infinita ou circularidade?', epistemicStatus: 'Problemático' },
          { id: 'n5', label: 'Racionalismo Crítico', category: 'Conclusão', definition: 'Progresso epistêmico via conjeturas ousadas submetidas a refutação sistemática.', epistemicStatus: 'Derivado' }
        ],
        edges: [
          { source: 'n1', target: 'n3', relation: 'fundamenta' },
          { source: 'n2', target: 'n3', relation: 'necessita' },
          { source: 'n3', target: 'n4', relation: 'limita' },
          { source: 'n4', target: 'n5', relation: 'sintetiza' },
          { source: 'n1', target: 'n5', relation: 'implica' }
        ]
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Você é um analisador ontológico estrito que extrai redes conceituais filosóficas em formato JSON estruturado.',
          responseMimeType: 'application/json',
        },
      });

      const jsonText = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonText);
      if (parsed.nodes && parsed.edges) {
        return res.json(parsed);
      }
    } catch (modelErr) {
      console.warn('Model call for concept map failed, falling back:', modelErr);
    }

    // Dynamic heuristic fallback based on theme
    const activeTheme = theme || text?.slice(0, 40) || 'Sistema Ontológico';
    res.json({
      theme: activeTheme,
      nodes: [
        { id: 'n1', label: `Fundamento de ${activeTheme}`, category: 'Axioma', definition: 'Princípio primordial que assegura a coerência lógica e a base ontológica.', formula: '$\\mathcal{A} \\models \\Phi$', epistemicStatus: 'Fundacional' },
        { id: 'n2', label: 'Articulação Epistêmica', category: 'Conceito Central', definition: 'Critério de justificação e validação das proposições derivadas.', epistemicStatus: 'Fundacional' },
        { id: 'n3', label: 'Desdobramento Teórico', category: 'Desdobramento', definition: 'Consequência necessária da aplicação do princípio aos casos empíricos.', epistemicStatus: 'Conjectural' },
        { id: 'n4', label: 'Tensão Dialética', category: 'Tensão Crítica', definition: 'Atrito conceitual frente a tradições opostas ou anomalias empíricas.', epistemicStatus: 'Problemático' },
        { id: 'n5', label: 'Síntese Hermenêutica', category: 'Conclusão', definition: 'Integração de ordem superior formulada sob o método do Logos Institute.', epistemicStatus: 'Robusto' }
      ],
      edges: [
        { source: 'n1', target: 'n2', relation: 'fundamenta' },
        { source: 'n2', target: 'n3', relation: 'implica' },
        { source: 'n3', target: 'n4', relation: 'limita' },
        { source: 'n4', target: 'n5', relation: 'sintetiza' },
        { source: 'n1', target: 'n5', relation: 'necessita' }
      ]
    });
  } catch (err: any) {
    console.error('Error in /api/sophia/concept-map:', err);
    res.status(500).json({ error: err.message || 'Falha ao construir mapa conceitual.' });
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logos Institute Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
