import React, { useMemo } from 'react';
import { renderWithKaTeX } from '../utils/latexExport';

interface Props {
  content: string;
  className?: string;
}

export const PhilosophicalMarkdown: React.FC<Props> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // First process math via KaTeX
    let text = renderWithKaTeX(content);

    // Escape or structure markdown blocks safely
    // Split into lines or process paragraphs
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Headers
      if (line.startsWith('### ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
        const headerText = line.replace('### ', '');
        processedLines.push(`<h3 class="text-lg font-classical font-semibold text-amber-200 mt-5 mb-2 pb-1 border-b border-amber-950/40">${headerText}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
        const headerText = line.replace('## ', '');
        processedLines.push(`<h2 class="text-xl font-classical font-bold text-amber-300 mt-7 mb-3 pb-1 border-b border-amber-900/50 tracking-wide">${headerText}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
        const headerText = line.replace('# ', '');
        processedLines.push(`<h1 class="text-2xl font-classical font-bold text-amber-400 mt-8 mb-4 tracking-wider">${headerText}</h1>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        const quoteText = line.replace('> ', '');
        processedLines.push(`<blockquote class="border-l-2 border-amber-500/60 pl-4 py-1 my-3 italic text-stone-300 font-scholarly bg-amber-950/10 rounded-r">${quoteText}</blockquote>`);
        continue;
      }

      // Tables (| Col 1 | Col 2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
        
        // Header separator line like |---|---|
        if (cells.every(c => /^[-:\s]+$/.test(c))) {
          continue;
        }

        if (!inTable) {
          inTable = true;
          processedLines.push('<div class="overflow-x-auto my-4"><table class="w-full text-left text-sm border-collapse border border-stone-800"><thead><tr class="bg-stone-900/80 text-amber-300 font-medium border-b border-stone-800">');
          cells.forEach(c => {
            processedLines.push(`<th class="p-2.5 border border-stone-800 font-classical tracking-wider">${c}</th>`);
          });
          processedLines.push('</tr></thead><tbody>');
          continue;
        } else {
          processedLines.push('<tr class="border-b border-stone-800/60 hover:bg-stone-900/40">');
          cells.forEach(c => {
            processedLines.push(`<td class="p-2.5 border border-stone-800 text-stone-200">${c}</td>`);
          });
          processedLines.push('</tr>');
          continue;
        }
      } else if (inTable) {
        processedLines.push('</tbody></table></div>');
        inTable = false;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        if (!inList) {
          inList = true;
          processedLines.push('<ul class="list-disc list-outside ml-6 space-y-1.5 my-3 text-stone-300">');
        }
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        processedLines.push(`<li class="leading-relaxed">${itemText}</li>`);
        continue;
      } else if (inList && line.trim() === '') {
        processedLines.push('</ul>');
        inList = false;
        continue;
      } else if (inList && !line.trim().startsWith('- ') && !line.trim().startsWith('* ')) {
        processedLines.push('</ul>');
        inList = false;
      }

      // Empty line
      if (line.trim() === '') {
        processedLines.push('<div class="h-3"></div>');
        continue;
      }

      // Normal paragraph
      // Convert bold **...** and italic *...*
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200/90 font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-stone-300">$1</em>');

      processedLines.push(`<p class="leading-relaxed text-stone-300 my-1 font-scholarly text-[1.05rem]">${formattedLine}</p>`);
    }

    if (inList) processedLines.push('</ul>');
    if (inTable) processedLines.push('</tbody></table></div>');

    return processedLines.join('');
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
