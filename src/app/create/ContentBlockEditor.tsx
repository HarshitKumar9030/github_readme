'use client';

import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';

interface ContentBlockEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  initialContent,
  onChange
}) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="space-y-4">
      <MarkdownEditor
        initialValue={content}
        onChange={handleChange}
        height="300px"
        showPreview={true}
        placeholder="Enter your markdown content here..."
      />
      
      <div className="text-xs text-gray-500">
        <p className="mb-1">Markdown tips:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><code># Heading 1</code> for main headings</li>
          <li><code>## Heading 2</code> for section headings</li>
          <li><code>**Bold text**</code> for bold text</li>
          <li><code>*Italic text*</code> for italic text</li>
          <li><code>- Item</code> for bullet points</li>
          <li><code>[Link text](URL)</code> for links</li>
          <li><code>![Alt text](image-url)</code> for images</li>
          <li><code>```code```</code> for code blocks</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentBlockEditor;
