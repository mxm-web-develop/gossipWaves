'use client';

import React from 'react';
import TurndownService from 'turndown';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import MD from 'slate-markdown';

import { withProps } from '@udecode/cn';
import {
  BaseParagraphPlugin,
  SlateLeaf,
  createSlateEditor,
  serializeHtml,
} from '@udecode/plate';
import { useEditorRef } from '@udecode/plate/react';

import { ArrowDownToLineIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { EditorStatic } from './editor-static';
import { EquationElementStatic } from './equation-element-static';
import { InlineEquationElementStatic } from './inline-equation-element-static';
import { ToolbarButton } from './toolbar';
import { myComponents,staticPlugins } from '../editor/getHtml';

const siteUrl = 'tailwind.css';

export function ExportToolbarButton({ children, ...props }: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  const getCanvas = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const style = document.createElement('style');
    document.head.append(style);
    style.sheet?.insertRule(
      'body > div:last-child img { display: inline-block !important; }'
    );
    const canvas = await html2canvas(editor.api.toDOMNode(editor)!);
    style.remove();

    return canvas;
  };
  const downloadFile = ({
    content,
    filename,
    isHtml = false,
  }: {
    content: string;
    filename: string;
    isHtml?: boolean;
  }) => {
    const element = document.createElement('a');
    const href = isHtml
      ? `data:text/html;charset=utf-8,${encodeURIComponent(content)}`
      : content;
    element.setAttribute('href', href);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.append(element);
    element.click();
    element.remove();
  };

  const exportToPdf = async () => {
    const canvas = await getCanvas();

    const PDFLib = await import('pdf-lib');
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const imageEmbed = await pdfDoc.embedPng(canvas.toDataURL('PNG'));
    const { height, width } = imageEmbed.scale(1);
    page.drawImage(imageEmbed, {
      height,
      width,
      x: 0,
      y: 0,
    });
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

    downloadFile({ content: pdfBase64, filename: 'plate.pdf' });
  };

  const exportToImage = async () => {
    const canvas = await getCanvas();
    downloadFile({
      content: canvas.toDataURL('image/png'),
      filename: 'plate.png',
    });
  };

  const exportToHtml = async () => {
    const components = myComponents

    const editorStatic = createSlateEditor({
      plugins: staticPlugins,
      value: editor.children,
    });

    const editorHtml = await serializeHtml(editorStatic, {
      components,
      editorComponent: EditorStatic,
      props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
    });

    const prismCss = `<link rel="stylesheet" href="${siteUrl}/prism.css">`;
    const tailwindCss = `<link rel="stylesheet" href="${siteUrl}/tailwind.css">`;
    const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`;

    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
        ${tailwindCss}
        ${prismCss}
        ${katexCss}
        <style>
          :root {
            --font-sans: 'Inter', 'Inter Fallback';
            --font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback';
          }
        </style>
      </head>
      <body>
        ${editorHtml}
      </body>
    </html>`;

    downloadFile({ content: html, filename: 'plate.html', isHtml: true });
  };
  const exportToMarkdown = async () => {
    const turndownService = new TurndownService();
    const editorStatic = createSlateEditor({
      plugins: staticPlugins,
      value: editor.children,
    });

    const html = await serializeHtml(editorStatic, {
      components: myComponents,
      editorComponent: EditorStatic,
    });
    const markdown = turndownService.turndown(html);
    
    downloadFile({
      content: `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`,
      filename: 'plate.md'
    });
  };
  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="导出" isDropdown>
          <ArrowDownToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={exportToHtml}>
            导出为HTML
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToPdf}>
            导出为PDF
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToImage}>
            导出为图片
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToMarkdown}>
            导出为Markdown
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
