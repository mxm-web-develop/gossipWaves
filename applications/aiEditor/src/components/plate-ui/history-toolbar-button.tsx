'use client';

import { useEditorRef, useEditorSelector, withRef } from '@udecode/plate/react';
import { Redo, Redo2Icon, Undo, Undo2Icon } from 'lucide-react';

import { ToolbarButton } from './toolbar';

export const RedoToolbarButton = withRef<typeof ToolbarButton>((props, ref) => {
  const editor = useEditorRef();
  const disabled = useEditorSelector(
    (editor) => editor.history.redos.length === 0,
    []
  );

  return (
    <ToolbarButton
      ref={ref}
      disabled={disabled}
      onClick={() => editor.redo()}
      onMouseDown={(e) => e.preventDefault()}
      tooltip="Redo"
      {...props}
    >
      <Redo  />
    </ToolbarButton>
  );
});

export const UndoToolbarButton = withRef<typeof ToolbarButton>((props, ref) => {
  const editor = useEditorRef();
  const disabled = useEditorSelector(
    (editor) => editor.history.undos.length === 0,
    []
  );

  return (
    <ToolbarButton
      ref={ref}
      disabled={disabled}
      size={'sm'}
      onClick={() => editor.undo()}
      onMouseDown={(e) => e.preventDefault()}
      tooltip="撤回"
      {...props}
    >
      <Undo  />
    </ToolbarButton>
  );
});
