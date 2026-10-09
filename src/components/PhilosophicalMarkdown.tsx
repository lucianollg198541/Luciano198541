import React, { useMemo } from 'react';
import { renderWithKaTeX } from '../utils/latexExport';

interface Props {
  content: string;
  className?: string;
  fontSizeClass?: string;
}

export const PhilosophicalMarkdown: React.FC<Props> = ({
  content,
  className = '',
  fontSizeClass = 'text-[1.05rem]',
}) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // First process math via KaTeX
    let text = renderWithKaTeX(content);

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
        processedLines.push(`<h3 class="text-base sm:text-lg font-classical font-semibold text-amber-200 mt-5 mb-2 pb-1 border-b border-amber-900/30">${headerText}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
        const headerText = line.replace('## ', '');
        processedLines.push(`<h2 class="text-lg sm:text-xl font-classical font-bold text-amber-300 mt-7 mb-3 pb-1 border-b border-amber-800/40 tracking-wide">${headerText}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
        const headerText = line.replace('# ', '');
        processedLines.push(`<h1 class="text-xl sm:text-2xl font-classical font-bold text-amber-400 mt-8 mb-4 tracking-wider">${headerText}</h1>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        const quoteText = line.replace('> ', '');
        processedLines.push(`<blockquote class="border-l-3 border-amber-500 pl-4 py-1.5 my-3.5 italic text-slate-200 font-scholarly bg-amber-950/20 rounded-r-lg shadow-sm leading-relaxed">${quoteText}</blockquote>`);
        continue;
      }

      // Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (inList) { processedLines.push('</ul>'); inList = false; }
        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
        
        if (cells.every(c => /^[-:\s]+$/.test(c))) {
          continue;
        }

        if (!inTable) {
          inTable = true;
          processedLines.push('<div class="overflow-x-auto my-4 rounded-lg border border-slate-700/70 shadow-sm"><table class="w-full text-left text-sm border-collapse"><thead><tr class="bg-slate-800/90 text-amber-300 font-semibold border-b border-slate-700">');
          cells.forEach(c => {
            processedLines.push(`<th class="p-3 border-r border-slate-700/60 font-classical tracking-wider text-xs">${c}</th>`);
          });
          processedLines.push('</tr></thead><tbody>');
          continue;
        } else {
          processedLines.push('<tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">');
          cells.forEach(c => {
            processedLines.push(`<td class="p-3 border-r border-slate-800/80 text-slate-200">${c}</td>`);
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
          processedLines.push('<ul class="list-disc list-outside ml-6 space-y-2 my-3 text-slate-200">');
        }
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        processedLines.push(`<li class="leading-relaxed font-scholarly">${itemText}</li>`);
        continue;
      } else if (inList && line.trim() === '') {
        processedLines.push('</ul>');
        inList = false;
        continue;
      } else if (inList && !line.trim().startsWith('- ') && !line.trim().startsWith('* ')) {
        processedLines.push('</ul>');
        inList = false;
      }

      // Empty line / paragraph break
      if (line.trim() === '') {
        processedLines.push('<div class="h-3 sm:h-3.5"></div>');
        continue;
      }

      // Normal paragraph with comfortable spacing and reading flow
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200 font-semibold tracking-wide">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>');

      processedLines.push(`<p class="leading-[1.75] text-slate-200 my-1 font-scholarly ${fontSizeClass} tracking-[0.01em]">${formattedLine}</p>`);
    }

    if (inList) processedLines.push('</ul>');
    if (inTable) processedLines.push('</tbody></table></div>');

    return processedLines.join('');
  }, [content, fontSizeClass]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
