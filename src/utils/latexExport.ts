import katex from 'katex';

/**
 * Formats philosophical text into a complete, compilable LaTeX article.
 */
export function generateFullLatexDocument(params: {
  title: string;
  author?: string;
  institution?: string;
  abstract?: string;
  body: string;
  date?: string;
}): string {
  const {
    title,
    author = 'Pesquisador / Logos Institute',
    institution = 'Logos Institute of Advanced Philosophical Reasoning',
    abstract = '',
    body,
    date = '\\today',
  } = params;

  // Transform markdown subheadings into LaTeX sections
  let latexBody = body
    .replace(/^### (.*$)/gim, '\\subsubsection{$1}')
    .replace(/^## (.*$)/gim, '\\subsection{$1}')
    .replace(/^# (.*$)/gim, '\\section{$1}')
    .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
    .replace(/\*(.*?)\*/g, '\\textit{$1}');

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{geometry}
\\usepackage{microtype}
\\usepackage{booktabs}
\\usepackage{hyperref}
\\usepackage{cite}

\\geometry{margin=2.5cm}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    citecolor=black,
    urlcolor=blue
}

\\newtheorem{theorem}{Teorema}[section]
\\newtheorem{axiom}{Axioma}
\\newtheorem{definition}{Definição}
\\newtheorem{proposition}{Proposição}
\\newtheorem{lemma}{Lema}

\\title{\\textbf{${escapeLatexSpecialChars(title)}}}
\\author{${escapeLatexSpecialChars(author)} \\\\ \\small ${escapeLatexSpecialChars(institution)}}
\\date{${date}}

\\begin{document}

\\maketitle

${
  abstract
    ? `\\begin{abstract}
\\noindent ${escapeLatexSpecialChars(abstract)}
\\end{abstract}
\\vspace{1em}
`
    : ''
}

\\tableofcontents
\\vspace{1.5em}
\\hrule
\\vspace{1.5em}

${latexBody}

\\vspace{2em}
\\hrule
\\vspace{1em}
\\noindent\\footnotesize{\\textit{Documento gerado pelo Logos Institute sob os auspícios de Sophia, Chief Virtual Philosopher.}}

\\end{document}
`;
}

function escapeLatexSpecialChars(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Render text with inline ($...$) and block ($$...$$) math via KaTeX safely
 */
export function renderWithKaTeX(rawContent: string): string {
  if (!rawContent) return '';

  try {
    // Replace block math $$ ... $$
    let processed = rawContent.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-4 overflow-x-auto py-2 flex justify-center text-amber-300 font-logic">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch (err) {
        return `<pre class="text-amber-400 font-logic my-2 bg-stone-900 p-2 rounded text-center">$$${math}$$</pre>`;
      }
    });

    // Replace inline math $ ... $ (excluding escaped \$)
    processed = processed.replace(/(?<!\\)\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return `<span class="inline-block px-1 text-amber-300 font-logic">${katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })}</span>`;
      } catch (err) {
        return `<code class="text-amber-400 font-logic">$${math}$</code>`;
      }
    });

    return processed;
  } catch {
    return rawContent;
  }
}

/**
 * Downloads a text file (e.g. .tex, .md) to the user's browser
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
