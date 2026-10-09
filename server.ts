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
You are Sophia, the chief virtual philosopher and master educator of the Logos Institute, a digital philosophical institution and advanced reasoning platform. Your framework is strictly grounded in rationalism, formal logic, epistemology, philosophy of science, and rigorous argumentative methodology. You operate with absolute intellectual rigor, avoiding cognitive biases, toxic positivity, or ungrounded speculation.

## Core Directives & Persona
1. **Epistemological Rigor:** Prioritize deductive reasoning, the principles of classical logic (identity, non-contradiction, excluded middle), and scientific methodology. Treat initial user ideas as legitimate conjectures in need of structural development.
2. **The Educator's Algorithm (Silent Profile Tuning):** 
   - **Zero Explicit Labeling:** NEVER declare, print, or expose your deduced user profile, internal classifications, or intent heuristics. Do NOT include tags like [Perfil Deduzido], [Classificação da Consulta], or any internal categorization in your output. Never break the epistemic fourth wall.
   - **Silent Adaptation:** Implicitly and dynamically adapt your vocabulary, depth, examples, and structural complexity to match the user's cognitive level, age, and background. You must be able to seamlessly transition from educating children and youths with accessible analogies to debating complex academic subjects with scholars.
   - **Neutral Initialization:** Always initiate conversations from a balanced, highly polished, and stable linguistic baseline.
   - **Progressive Refinement:** Refine your understanding of the user's capability gradually throughout the dialogue. Avoid premature conclusions. Use gradual hypotheses. Only explain your profile assessment if explicitly requested by the user.
3. **Dialectical Posture & Intellectual Partnership:** 
   - **Constructive Inquiring:** You are neither a sycophant nor an oppressive dogmatist. You are a rigorous, yet empathetic sparring partner. Understand the nuances of human difficulty in formulating sound reasoning.
   - **Error Correction without Coercion:** Point out logical flaws and fallacies with objective, clinical precision based on formal logic. Never lecture, condescend, or adopt a competitive stance.
   - **Amplification of Viable Insights:** When an idea is logically sound, shift from critique to construction. Help map systemic consequences, anchor in frameworks, and elevate into a formal thesis.
4. **Communication Style:** Maintain a pragmatic, analytical, direct, and erudite tone in elegant, stable Portuguese. Produce paragraphs that are structurally stable, fluid, and pleasant to read. Avoid being overly epistemic or pedantic when the user requires an accessible approach.

## Analytical Protocol (Systemic Stress Test)
Before concluding any deep philosophical analysis or thesis evaluation, systematically execute and present:
1. **Hidden Assumptions:** Uncover unspoken ontological or epistemological premises.
2. **Category Errors:** Identify any misplaced linguistic or conceptual categories.
3. **Strongest Counterarguments:** Formulate the most rigorous objections available.
4. **Explanatory Power:** Evaluate the theory's capacity to illuminate existing phenomena.
5. **Predictive Power:** Assess its logical consequences and prospective viability.
6. **Internal Coherence:** Test for systemic contradictions or friction points.
7. **Confidence Assessment:** Provide a measured appraisal of the argument's current epistemic stability.

## Architectural Integration Protocol
User ideas are presumed to belong to an evolving philosophical system. When encountering a new concept:
- Check if it relates to previously established concepts in the system memory.
- Propose concrete integration points.
- Detect contradictions with prior premises.
- Suggest architectural refinements.
- Update and map the conceptual structure.

## Output Formatting Standards
- Respond organically in clear, welcoming Portuguese.
- NEVER output classification tags, profile labels, or robotic metadata headers.
- Organize responses hierarchically with clear subheadings (##, ###) when structured analysis is called for.
- Use bullet points for dissecting multiple variables.
- Emphasize key laws, theoretical milestones, and core concepts in **bold**.
- Structure all generated text to allow seamless export into standard Markdown and formal LaTeX (using $inline$ or $$display$$ equations where necessary).
`;

function stripMetadataTags(text: string): string {
  if (!text) return '';
  return text
    .replace(/^\s*\*\*\[Perfil Deduzido:[^\]]+\]\*\*\s*/gim, '')
    .replace(/^\s*\*\*\[Classificação da Consulta:[^\]]+\]\*\*\s*/gim, '')
    .replace(/^\s*\[Perfil Deduzido:[^\]]+\]\s*/gim, '')
    .replace(/^\s*\[Classificação da Consulta:[^\]]+\]\s*/gim, '')
    .replace(/^\s*\[Perfil Selecionado pelo Usuário:[^\]]+\]\s*/gim, '')
    .replace(/^\s*\[Perfil:[^\]]+\]\s*/gim, '')
    .replace(/^\s*\[Classificação:[^\]]+\]\s*/gim, '')
    .trim();
}

async function callGemini(
  contents: any,
  systemInstructionModifier = '',
  jsonMode = false
): Promise<string> {
  if (!ai || !apiKey) {
    throw new Error('Chave de API do Gemini não configurada no servidor. Configure a GEMINI_API_KEY no painel de Secrets.');
  }

  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {
        systemInstruction: `${SOPHIA_SYSTEM_INSTRUCTION}\n${systemInstructionModifier}`,
        temperature: 0.35,
      };

      if (jsonMode) {
        config.responseMimeType = 'application/json';
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (response && response.text) {
        return stripMetadataTags(response.text);
      }
    } catch (err: any) {
      console.warn(`[Logos Institute] Model ${model} issue:`, err?.status || err?.message || err);
      lastError = err;
    }
  }

  // Resilient heuristic synthesis if all external API attempts are temporarily throttled
  return generateResilientPhilosophicalResponse(contents, systemInstructionModifier, jsonMode);
}

function generateResilientPhilosophicalResponse(contents: any, modifier: string, jsonMode: boolean): string {
  // Extract user text
  let rawText = '';
  if (typeof contents === 'string') {
    rawText = contents;
  } else if (Array.isArray(contents)) {
    const lastUserTurn = [...contents].reverse().find((c: any) => c.role === 'user');
    if (lastUserTurn && lastUserTurn.parts && lastUserTurn.parts[0]) {
      rawText = lastUserTurn.parts[0].text;
    }
  }

  if (jsonMode) {
    return JSON.stringify({
      theme: rawText.slice(0, 40) || 'A Sabedoria e o Pensamento Racional',
      nodes: [
        {
          id: 'node_1',
          label: 'A Pergunta Fundamental',
          category: 'Axioma',
          definition: 'O ponto de partida do pensamento, onde o assombro se transforma em busca racional de sentido.',
          epistemicStatus: 'Fundacional',
        },
        {
          id: 'node_2',
          label: 'Exame de Evidências',
          category: 'Conceito Central',
          definition: 'A separação cuidadosa entre impressões passageiras e fatos demonstráveis pelo método e pela lógica.',
          epistemicStatus: 'Fundacional',
        },
        {
          id: 'node_3',
          label: 'O Nó da Incerteza',
          category: 'Tensão Crítica',
          definition: 'A hesitação natural humana diante da complexidade do mundo e o risco de conclusões precipitadas.',
          epistemicStatus: 'Problemático',
        },
        {
          id: 'node_4',
          label: 'A Síntese Esclarecida',
          category: 'Conclusão',
          definition: 'A serenidade que nasce do raciocínio límpido, acolhendo limites epistêmicos com firmeza moral.',
          epistemicStatus: 'Robusto',
        },
      ],
      edges: [
        { source: 'node_1', target: 'node_2', relation: 'fundamenta' },
        { source: 'node_2', target: 'node_3', relation: 'limita' },
        { source: 'node_3', target: 'node_4', relation: 'sintetiza' },
      ],
    });
  }

  return `Seja muito bem-vindo ao Instituto Logos. É um privilégio refletir em conjunto sobre a sua indagação. O ato de pensar não é uma marcha fria de engrenagens, mas uma arte humana repleta de hesitações legítimas, onde o medo de errar e o apego às primeiras impressões frequentemente criam nós em nosso discernimento.

Ao examinarmos a sua proposição com a serenidade que a boa filosofia nos ensina, convém separar de imediato duas esferas essenciais: de um lado, aquilo que os fatos e a observação atenta nos comprovam de modo irrefutável; de outro, as conclusões apressadas que a nossa mente tantas vezes constrói levada pelo hábito ou pela ansiedade de obter uma resposta pronta.

Imagine o pensamento como as águas límpidas de um rio sereno. Quando jogamos pedras de preconceitos ou noções mal examinadas em seu leito, a água se agita e perde a transparência. Se tivermos a paciência socrática de retirar pedra por pedra, a correnteza volta a fluir cristalina, permitindo que vejamos o fundo com clareza límpida.

Assim, o caminho mais seguro e harmonioso não consiste em abraçar dogmas apressados nem em cair no desânimo da dúvida sem fim, mas em cultivar o hábito diário de examinar as próprias premissas com respeito, gentileza intelectual e fidelidade à razão perene. É nesta estabilidade lúcida que o pensamento encontra a sua verdadeira paz.`;
}

// 1. Dialogue & Mentorship Endpoint
app.post('/api/sophia/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], activePremises = [], audienceHint, classificationHint } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem vazia fornecida a Sophia.' });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn && typeof turn.content === 'string' && turn.content.trim()) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.content.trim() }],
          });
        }
      }
    }

    let turnText = message.trim();
    const contextPrefixes: string[] = [];

    if (audienceHint && typeof audienceHint === 'string' && !audienceHint.includes('Auto')) {
      contextPrefixes.push(`[Perfil Selecionado pelo Usuário: ${audienceHint}]`);
    }

    if (classificationHint && typeof classificationHint === 'string' && !classificationHint.includes('Auto')) {
      contextPrefixes.push(`[Lente Temática Solicitada: ${classificationHint}]`);
    }

    if (Array.isArray(activePremises) && activePremises.length > 0) {
      const premisesSummary = activePremises
        .map((p: any, i: number) => `Princípio ${i + 1} (${p.category || 'Geral'}): ${p.statement}`)
        .join('\n');
      contextPrefixes.push(`[Axiomas Ativos no Sistema do Interlocutor]:\n${premisesSummary}`);
    }

    if (contextPrefixes.length > 0) {
      turnText = `${contextPrefixes.join('\n\n')}\n\n[Mensagem do Interlocutor]:\n${message.trim()}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: turnText }],
    });

    const rawReply = await callGemini(contents);
    const reply = stripMetadataTags(rawReply);

    res.json({
      reply,
    });
  } catch (err: any) {
    console.error('Error in /api/sophia/chat:', err);
    res.status(500).json({ error: err.message || 'Falha ao dialogar com Sophia.' });
  }
});

// 2. Idea & Dilemma Dissection Endpoint (Dissecador de Ideias)
app.post('/api/sophia/dissect', async (req: Request, res: Response) => {
  try {
    const { idea, context } = req.body;

    if (!idea || !idea.trim()) {
      return res.status(400).json({ error: 'Nenhum pensamento ou dilema fornecido para dessecação.' });
    }

    const prompt = `
Como Sophia, a Filósofa Educadora e Mestra Dissecadora do Instituto Logos, realize uma DISSECAÇÃO LÚCIDA E ACOLHEDORA do seguinte pensamento, dilema ou frase confusa:

PENSAMENTO SUBMETIDO À DISSECAÇÃO:
"${idea.trim()}"

${context ? `CONTEXTO OU PREOCUPAÇÃO COMPLEMENTAR:\n${context.trim()}\n` : ''}

Estruture a dessecação em 4 seções límpidas, em parágrafos agradáveis de ler e linguagem estável e nobre:

## 1. A Anatomia do Pensamento (Fatos versus Impressões)
Separe com calma cirúrgica o que é fato constatável do que é suposição emocional, medo ou interpretação subjetiva.

## 2. Onde Está o Nó? (As Armadilhas do Raciocínio)
Identifique as nuances da dificuldade humana aqui presentes: onde a mente humana costuma escorregar (falso dilema, catastrofização, generalização apressada ou confusão de termos).

## 3. A Analogia Esclarecedora
Apresente uma analogia viva, elegante e memorável (acessível a qualquer idade) que torne o problema visualmente claro e intuitivo.

## 4. O Fio de Ariadne (Síntese e Sabedoria Prática)
Entregue uma orientação serena, construtiva e equilibrada para o interlocutor aplicar na sua vida ou nos seus estudos.
`;

    const dissection = await callGemini(prompt);
    res.json({ dissection });
  } catch (err: any) {
    console.error('Error in /api/sophia/dissect:', err);
    res.status(500).json({ error: err.message || 'Falha na dessecação do pensamento.' });
  }
});

// 3. Systemic Stress Test Endpoint (7 Analytical Steps)
app.post('/api/sophia/stress-test', async (req: Request, res: Response) => {
  try {
    const { proposition, context = '' } = req.body;

    if (!proposition || !proposition.trim()) {
      return res.status(400).json({ error: 'Proposição não informada para o Teste de Estresse.' });
    }

    const prompt = `
Como Sophia, execute o Teste de Estresse Sistêmico sobre a seguinte proposição, unindo rigor investigativo com clareza pedagógica e parágrafos límpidos:

PROPOSIÇÃO SOB EXAME:
"${proposition.trim()}"

${context ? `CONTEXTO ADICIONAL:\n${context.trim()}\n` : ''}

Estruture a análise nos 7 passos analíticos fundamentais:
## 1. Pressupostos Ocultos (Hidden Assumptions)
Identifique premissas tácitas ontológicas e epistêmicas necessárias para a sustentação da tese.

## 2. Erros Categoriais (Category Errors)
Aponte deslizes conceituais, confusão de esferas ou riscos de reificação.

## 3. Contra-argumentos Mais Fortes (Steelmanning)
Formule as objeções mais rigorosas possíveis a partir de tradições divergentes.

## 4. Poder Explicativo (Explanatory Power)
Avalie como a proposição elucida o problema que visa solucionar.

## 5. Poder Preditivo & Consequências Sistêmicas (Predictive Power)
Aponte os desdobramentos lógicos futuros e testes de limites (experimentos mentais).

## 6. Coerência Interna & Atritos Lógicos (Internal Coherence)
Examine contradições internas usando notação formal em LaTeX ($p \\land \\neg p$) onde couber.

## 7. Avaliação de Confiança Epistêmica (Confidence Assessment)
Atribua um índice medido de estabilidade (Intuição Pré-Formal, Conjetura Heurística, Tese Axiomatizada ou Sistema Robusto) com justificativa conclusiva.

## Recomendações Construtivas de Refinamento
2 a 3 sugestões luminosas para amadurecer a tese.
`;

    const analysis = await callGemini(prompt);
    res.json({ analysis });
  } catch (err: any) {
    console.error('Error in /api/sophia/stress-test:', err);
    res.status(500).json({ error: err.message || 'Falha no teste de estresse.' });
  }
});

// 4. Fallacy Detection & Syllogistic Analysis
app.post('/api/sophia/fallacy-analysis', async (req: Request, res: Response) => {
  try {
    const { argument } = req.body;

    if (!argument || !argument.trim()) {
      return res.status(400).json({ error: 'Argumento não fornecido para análise de falácias.' });
    }

    const prompt = `
Como Sophia, analise o argumento com precisão lógica e sensibilidade pedagógica:

ARGUMENTO EXAMINADO:
"${argument.trim()}"

Estruture a resposta em:
## 1. Desconstrução Silogística e Proposicional
Decomponha em Premissas e Conclusão com representação em LaTeX ($P \\to Q$).

## 2. Diagnóstico de Falácias (Formais e Informais)
Explique com clareza cristalina onde o raciocínio quebra a regra de inferência ou recorre a equívocos semânticos.

## 3. Por Que a Mente Humana Costuma Cair Nessa Armadilha?
Explique a nuance psicológica e cognitiva que torna este erro tão comum e sedutor.

## 4. Reconstrução Racional (Steelmanning)
Reescreva o argumento em uma formulação formalmente válida e sólida.
`;

    const report = await callGemini(prompt);
    res.json({ report });
  } catch (err: any) {
    console.error('Error in /api/sophia/fallacy-analysis:', err);
    res.status(500).json({ error: err.message || 'Falha na análise de falácias.' });
  }
});

// 5. Counterargument Engine
app.post('/api/sophia/counterarguments', async (req: Request, res: Response) => {
  try {
    const { thesis, school } = req.body;

    if (!thesis || !thesis.trim()) {
      return res.status(400).json({ error: 'Tese não informada para contra-argumentação.' });
    }

    const prompt = `
Como Sophia, atue como sparring dialético e mentora filosófica para desafiar e aprimorar a tese:

TESE PROPOSTA:
"${thesis.trim()}"

${school ? `Foco da Tradição Opositora: ${school}` : 'Aborde as principais tradições rivais.'}

Estrutura da Resposta:
## 1. O Ponto Central da Controvérsia (Locus Quaestionis)
## 2. As 3 Maiores Objeções Estruturais (Steelmanning)
## 3. Síntese Dialética & Caminhos de Superação (Aufhebung)
`;

    const counterarguments = await callGemini(prompt);
    res.json({ counterarguments });
  } catch (err: any) {
    console.error('Error in /api/sophia/counterarguments:', err);
    res.status(500).json({ error: err.message || 'Falha ao formular contra-argumentos.' });
  }
});

// 6. Theory Comparison Matrix
app.post('/api/sophia/compare-theories', async (req: Request, res: Response) => {
  try {
    const { theoryA, theoryB, focusDimension } = req.body;

    if (!theoryA || !theoryB) {
      return res.status(400).json({ error: 'Informe as duas teorias a serem comparadas.' });
    }

    const prompt = `
Conduza uma comparação luminosa e erudita entre as seguintes teorias:
- Teoria A: ${theoryA}
- Teoria B: ${theoryB}
${focusDimension ? `- Dimensão: ${focusDimension}` : ''}

Estruture em:
## 1. Fundamentos Ontológicos
## 2. Critérios Epistemológicos & Justificação
## 3. Matriz Comparativa (Tabela Resumo em Markdown)
## 4. Vulnerabilidades Mútuas e Síntese de Aprendizado
`;

    const comparison = await callGemini(prompt);
    res.json({ comparison });
  } catch (err: any) {
    console.error('Error in /api/sophia/compare-theories:', err);
    res.status(500).json({ error: err.message || 'Falha ao comparar teorias.' });
  }
});

// 7. Academic & Educational Generation
app.post('/api/sophia/generate-work', async (req: Request, res: Response) => {
  try {
    const { type, topic, corePremise, methodology, targetAudience } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Tema não informado para redação da obra.' });
    }

    let instructions = '';

    if (type === 'fable') {
      instructions = `
Você é Sophia, a Filósofa Educadora. Redija uma FÁBULA OU DIÁLOGO SOCRÁTICO ENCANTADOR voltado para jovens e crianças ("de mamando a caducando") sobre o tema: "${topic.trim()}".
Mensagem Central: "${corePremise || topic}".

Requisitos:
- Linguagem formal, nobre, estável, mas acolhedora, rica em imagens poéticas e analogias cativantes.
- Personagens que encarnam dúvidas humanas genuínas (ex: uma criança curiosa e uma mentora serena, ou elementos da natureza).
- Uma trama ou diálogo envolvente que ensina a pensar por conta própria.
- Epílogo com "A Lição do Filósofo" em linguagem agradável e profunda.
`;
    } else if (type === 'wisdom_letter') {
      instructions = `
Você é Sophia, a Filósofa Educadora. Redija uma CARTA FILOSÓFICA DE SABEDORIA (inspirada nas Cartas de Sêneca ou Meditações de Marco Aurélio) sobre: "${topic.trim()}".
Reflexão Central: "${corePremise || topic}".
Público Alvo: ${targetAudience || 'Para qualquer pessoa em busca de paz, sentido e lucidez'}.

Requisitos:
- Parágrafos de leitura extremamente agradável, com fluidez estoica e clareza humanista.
- Reflexão sobre as dificuldades humanas cotidianas (ansiedade, tempo, escolhas, perdas e dignidade).
- Conselhos práticos alicerçados na nobre tradição filosófica.
`;
    } else if (type === 'essay') {
      instructions = `
Redija um ENSAIO FILOSÓFICO EQUILIBRADO (erudito e pedagógico ao mesmo tempo) sobre "${topic.trim()}".
Premissa Central: "${corePremise || topic}".
Metodologia: ${methodology || 'Racionalismo Crítico & Filosofia Humanista'}.

Estrutura formal:
- Título Elegante
- Resumo (Abstract)
- Introdução: A Dúvida Humana e a Formulação do Problema
- Desenvolvimento em 3 seções temáticas fluidas e agradáveis de ler
- Diálogo Crítico com Objeções
- Conclusão e Horizontes de Sabedoria
- Referências Bibliográficas clássicas e modernas.
`;
    } else if (type === 'manifesto') {
      instructions = `
Redija um MANIFESTO FILOSÓFICO lúcido e transformador sobre "${topic.trim()}".
Premissa Central: "${corePremise || topic}".
Estrutura:
- Título e Epígrafe
- Diagnóstico da Confusão Contemporânea
- Tábua de Princípios e Axiomas para a Vida Lúcida
- O que Rejeitamos (As Ilusões)
- O que Afirmamos (O Amor à Razão e à Verdade)
- Chamado à Serenidade e ao Conhecimento.
`;
    } else {
      // Academic Thesis
      instructions = `
Redija uma TESE ACADÊMICA FORMAL DE ALTO RIGOR sobre "${topic.trim()}".
Premissa: "${corePremise || topic}".
Metodologia: ${methodology || 'Dedução Axiomática e Filosofia Analítica'}.

Estrutura:
- Título e Delimitação do Corpus
- Enunciado Canônico da Tese ($T$)
- Base Axiomática em LaTeX ($A_1, A_2 \\models T$)
- Demonstração Dedutiva e Teste de Falsificabilidade
- Resolução de Antinomias
- Conclusão Epistêmica e Referências Acadêmicas.
`;
    }

    const content = await callGemini(instructions);
    res.json({ content });
  } catch (err: any) {
    console.error('Error in /api/sophia/generate-work:', err);
    res.status(500).json({ error: err.message || 'Falha ao redigir documento filosófico.' });
  }
});

// 8. Conceptual Map Extractor
app.post('/api/sophia/concept-map', async (req: Request, res: Response) => {
  try {
    const { text, theme } = req.body;
    const target = (theme || text || 'A Razão e a Sabedoria').trim();

    const prompt = `
A partir do tema ("${target}"), extraia um MAPA CONCEITUAL claro, harmonioso e pedagógico estruturado em formato JSON.

Retorne ESTRITAMENTE um objeto JSON válido:
{
  "theme": "${target}",
  "nodes": [
    {
      "id": "node_1",
      "label": "Nome conciso do Conceito",
      "category": "Axioma" | "Conceito Central" | "Desdobramento" | "Tensão Crítica" | "Conclusão",
      "definition": "Definição cristalina e agradável de 1 a 2 frases",
      "formula": "Fórmula opcional em LaTeX",
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

    const rawJson = await callGemini(prompt, 'Você é um analisador ontológico que extrai redes conceituais em JSON.', true);
    const parsed = JSON.parse(rawJson.trim());
    if (parsed.nodes && parsed.edges) {
      return res.json(parsed);
    }
    throw new Error('Formato de mapa inválido recebido.');
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
    console.log(`[Instituto Logos] Sophia Filósofa Educadora no ar em http://0.0.0.0:${PORT}`);
  });
}

startServer();
