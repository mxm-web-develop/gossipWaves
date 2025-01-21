'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate, TPlateEditor } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { PlateStatic, serializeHtml } from '@udecode/plate';
export interface IEditorProps{
  value?:string | any
  onChange?: (value:any) => void
}
export interface PlateEditorRef {
  getEditor: () => TPlateEditor;
  getData: () => any;
  getHtml: () => any;
}
const PlateEditor = forwardRef<PlateEditorRef,IEditorProps>((props:IEditorProps,ref)=> {
  const editor = useCreateEditor({value:props.value});
  useImperativeHandle(ref, () => ({
    getEditor: () => editor as any,
    getData: () => editor.children,
    getHtml: () => serializeHtml(editor,{
      components: {
        
      }
    })  
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