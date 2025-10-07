"use client";

import { useState, useRef } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  error,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      openTag +
      selectedText +
      closeTag +
      value.substring(end);

    onChange(newText);

    // Set cursor position after inserted tags
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length,
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      label: "Bold",
      icon: "B",
      action: () => insertTag("<strong>", "</strong>"),
    },
    {
      label: "Italic",
      icon: "I",
      action: () => insertTag("<em>", "</em>"),
    },
    {
      label: "Heading",
      icon: "H3",
      action: () => insertTag("<h3>", "</h3>"),
    },
    {
      label: "Paragraph",
      icon: "P",
      action: () => insertTag("<p>", "</p>"),
    },
    {
      label: "List",
      icon: "UL",
      action: () => insertTag("<ul>\n<li>", "</li>\n</ul>"),
    },
    {
      label: "Code",
      icon: "</>",
      action: () => insertTag("<code>", "</code>"),
    },
    {
      label: "Code Block",
      icon: "{ }",
      action: () => insertTag("<pre><code>", "</code></pre>"),
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.action}
            title={button.label}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            {button.icon}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              !isPreview
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              isPreview
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      {isPreview ? (
        <div className="p-4 min-h-[200px] bg-white">
          <div
            className="answer-content"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-gray-900 focus:outline-none resize-none"
          rows={10}
          placeholder="Enter the answer with HTML formatting..."
        />
      )}

      {error && (
        <p className="px-4 py-2 text-sm text-red-600 bg-red-50">{error}</p>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
        <p className="text-xs text-gray-600">
          Use the toolbar buttons to insert HTML tags or write HTML directly.
          Click Preview to see how it will look.
        </p>
      </div>
    </div>
  );
}
