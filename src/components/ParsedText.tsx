import React from 'react';

interface ParsedTextProps {
  text: string;
  className?: string;
}

export const ParsedText: React.FC<ParsedTextProps> = ({ text, className = "" }) => {
  const elements: React.ReactNode[] = [];
  let i = 0;
  let currentText = '';
  let keyCount = 0;

  if (!text) return null;

  while (i < text.length) {
    if (text[i] === '[') {
      // Find the matching closing bracket for this specific opening bracket
      let bracketCount = 1;
      let j = i + 1;
      let endBracketIndex = -1;
      
      while (j < text.length) {
        if (text[j] === '[') bracketCount++;
        else if (text[j] === ']') bracketCount--;
        
        if (bracketCount === 0) {
          endBracketIndex = j;
          break;
        }
        j++;
      }

      if (endBracketIndex !== -1) {
        const tagContent = text.substring(i + 1, endBracketIndex);
        
        if (tagContent.startsWith('delay:')) {
          if (currentText) {
            elements.push(<span key={keyCount++}>{currentText}</span>);
            currentText = '';
          }
          i = endBracketIndex + 1;
          continue;
        }
        
        const colonIndex = tagContent.indexOf(':');
        if (colonIndex !== -1) {
          if (currentText) {
            elements.push(<span key={keyCount++}>{currentText}</span>);
            currentText = '';
          }
          const color = tagContent.substring(0, colonIndex);
          const content = tagContent.substring(colonIndex + 1);
          
          // Recursively parse content in case of nested tags
          elements.push(
            <span key={keyCount++} style={{ color }}>
              <ParsedText text={content} />
            </span>
          );
          
          i = endBracketIndex + 1;
          continue;
        }
      }
    }
    currentText += text[i];
    i++;
  }
  
  if (currentText) {
    elements.push(<span key={keyCount++}>{currentText}</span>);
  }

  return <span className={`whitespace-pre-wrap ${className}`}>{elements}</span>;
};
