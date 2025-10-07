/**
 * Utility functions for processing HTML content
 */

/**
 * Escapes HTML content within <pre> and <code> tags to prevent hydration errors
 * This ensures that HTML tags inside code blocks are displayed as text rather than interpreted as HTML
 */
export function escapeHtmlInCodeBlocks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // Regular expression to match <pre> and <code> blocks with their content
  // This captures the opening tag, content, and closing tag
  const codeBlockRegex = /<(code)>(.*?)<\/\1>/gs;

  return htmlContent.replace(codeBlockRegex, (match, tagName, content) => {
    // Escape HTML entities within the content
    const escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return `<${tagName}>${escapedContent}</${tagName}>`;
  });
}

/**
 * Unescapes HTML content within <pre> and <code> tags (for editing purposes)
 */
export function unescapeHtmlInCodeBlocks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  const codeBlockRegex = /<(code)>(.*?)<\/\1>/gs;

  return htmlContent.replace(codeBlockRegex, (match, tagName, content) => {
    // Unescape HTML entities within the content
    const unescapedContent = content
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return `<${tagName}>${unescapedContent}</${tagName}>`;
  });
}
