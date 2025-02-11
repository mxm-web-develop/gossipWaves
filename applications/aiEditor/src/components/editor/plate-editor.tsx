'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate, TPlateEditor } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { PlateStatic, serializeHtml } from '@udecode/plate';
// import { useThemedHtml } from './slate-to-html';
import { getEditorHtmlContent } from './getHtml';
import { getEditorMarkdownContent } from './getMd';
export interface IEditorProps {
  value?: string | any
}
export interface PlateEditorRef {
  getEditor: () => TPlateEditor;
  getData: () => any;
  getHtml: () => any;
  getMarkdown: () => any;
  clear: () => void;
  // getString: () => string;
}
const PlateEditor = forwardRef<PlateEditorRef, IEditorProps>((props: IEditorProps, ref) => {
  const editor = useCreateEditor({ value: props.value });

  useImperativeHandle(ref, () => ({
    getEditor: () => editor as any,
    // getString: () => editor.(),
    // getMarkdown: async () => await getEditorMarkdownContent(editor),
    getData: () => editor.children,
    getHtml: async () => await getEditorHtmlContent(editor),
    getMarkdown: async () => await getEditorMarkdownContent(editor),
    clear: () => {
      editor.tf.setValue([
        {
          type: 'p',
          children: [{ text: '' }]
        }
      ]);
    }
  }))

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="demo" />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  );
})

export default PlateEditor