/**
 * Utility to convert Markdown into clean, semantic HTML for Tiptap RichTextEditor.
 * Ensures headings (#, ##, ###), bold text (**text**), lists (*, -), blockquotes (>),
 * and paragraphs are properly formatted instead of collapsing into raw text.
 */

export function isMarkdown(text: string): boolean {
  if (!text) return false;
  const hasMarkdownMarkers = /(?:^|\n|\s)#{1,4}\s+|(\*\*[^*]+\*\*)|(?:^|\n|\s)[\*\-]\s+\*\*|(?:^|\n)>\s+/m.test(text);
  const hasHtml = /<(p|h[1-6]|ul|ol|table|blockquote|div)[\s>]/i.test(text);

  if (hasHtml && !hasMarkdownMarkers) {
    return false;
  }
  return hasMarkdownMarkers || !hasHtml;
}

export function formatMarkdownToHtml(raw: string): string {
  if (!raw) return '';

  let text = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // If already clean HTML without raw markdown markers, return as is
  if (/<(p|h[1-6]|ul|ol|table|blockquote)[\s>]/i.test(text) && !/(#{1,4}\s|\*\*[^*]+\*\*|^\s*[\*\-]\s+)/m.test(text)) {
    return text;
  }

  // If text is wrapped in HTML tags like <p>...</p> but contains raw markdown markers (#, **, *),
  // strip wrapper tags so the markdown can be parsed properly
  if (/<[a-z][\s\S]*>/i.test(text) && /(?:^|\s)#{1,4}\s+|\*\*[^*]+\*\*|[\*\-]\s+\*\*/m.test(text)) {
    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<\/?(?:p|div|span)[^>]*>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }

  // 1. Ensure headings have clean linebreaks before them if preceded by text or punctuation:
  // e.g. "for a lifetime. ## Understanding..." -> "for a lifetime.\n\n## Understanding..."
  text = text.replace(/([^\n])\s*(#{1,4}\s+)/g, '$1\n\n$2');

  // 2. Separate bullet points if glued to previous sentence:
  // e.g. "teeth. * **Floss Daily:**" -> "teeth.\n* **Floss Daily:**"
  text = text.replace(/([.!?])\s*([\*\-]\s+\*\*)/g, '$1\n$2');
  text = text.replace(/([.!?])\s*([\*\-]\s+[A-Za-z0-9])/g, '$1\n$2');

  // 3. Separate heading running directly into bullet points:
  // e.g. "### Essential Daily Practices * **Brush Twice..." -> "### Essential Daily Practices\n\n* **Brush Twice..."
  text = text.replace(/(#{1,4}\s+[^\n*]+?)\s*([\*\-]\s+\*\*)/g, '$1\n\n$2');

  // 4. Separate heading running into paragraph sentences on the same line:
  // e.g. "## Nutrition and Your Teeth What you eat..." -> "## Nutrition and Your Teeth\n\nWhat you eat..."
  text = text.replace(/(^|\n)(#{1,4}\s+[^:\n]{2,70}?)\s+([A-Z][a-z]+(?:\s+[a-z]+){2,})/g, '$1$2\n\n$3');
  // Handle headings with colon e.g. "# Title: Subtitle Achieving and maintaining..."
  text = text.replace(/(^|\n)(#{1,4}\s+[^:\n]+:\s+[^.\n]{2,70}?)\s+([A-Z][a-z]+(?:\s+[a-z]+){2,})/g, '$1$2\n\n$3');

  // 5. Separate inline callouts glued after period:
  // e.g. "bacteria. *Key Takeaway:..." -> "bacteria.\n\n*Key Takeaway:..."
  text = text.replace(/([.!?])\s*(\*[A-Z][a-zA-Z\s]+:)/g, '$1\n\n$2');

  // Helper for inline markdown: bold, italic, code, links
  function formatInline(str: string): string {
    return str
      // Bold + Italic: ***text***
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold: **text** or __text__
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Code: `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  const lines = text.split('\n');
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  let currentParagraph: string[] = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const pText = currentParagraph.join(' ').trim();
      if (pText) {
        htmlParts.push(`<p>${formatInline(pText)}</p>`);
      }
      currentParagraph = [];
    }
  }

  function closeLists() {
    if (inUl) {
      htmlParts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlParts.push('</ol>');
      inOl = false;
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      htmlParts.push('</blockquote>');
      inBlockquote = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      continue;
    }

    // Heading 1: # Title
    const h1Match = trimmed.match(/^#\s+(.+)$/);
    if (h1Match) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(`<h1>${formatInline(h1Match[1].trim())}</h1>`);
      continue;
    }

    // Heading 2: ## Title
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(`<h2>${formatInline(h2Match[1].trim())}</h2>`);
      continue;
    }

    // Heading 3: ### Title
    const h3Match = trimmed.match(/^###\s+(.+)$/);
    if (h3Match) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(`<h3>${formatInline(h3Match[1].trim())}</h3>`);
      continue;
    }

    // Heading 4: #### Title
    const h4Match = trimmed.match(/^####\s+(.+)$/);
    if (h4Match) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push(`<h4>${formatInline(h4Match[1].trim())}</h4>`);
      continue;
    }

    // Unordered List: * Item or - Item
    const ulMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (inOl) closeLists();
      if (!inUl) {
        htmlParts.push('<ul>');
        inUl = true;
      }
      htmlParts.push(`<li>${formatInline(ulMatch[1].trim())}</li>`);
      continue;
    }

    // Ordered List: 1. Item
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (inUl) closeLists();
      if (!inOl) {
        htmlParts.push('<ol>');
        inOl = true;
      }
      htmlParts.push(`<li>${formatInline(olMatch[1].trim())}</li>`);
      continue;
    }

    // Blockquote: > Quote
    const bqMatch = trimmed.match(/^>\s*(.+)$/);
    if (bqMatch) {
      flushParagraph();
      closeLists();
      if (!inBlockquote) {
        htmlParts.push('<blockquote>');
        inBlockquote = true;
      }
      htmlParts.push(`<p>${formatInline(bqMatch[1].trim())}</p>`);
      continue;
    }

    // Regular paragraph line
    closeLists();
    closeBlockquote();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  closeLists();
  closeBlockquote();

  return htmlParts.join('\n');
}
