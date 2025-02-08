import TurndownService from 'turndown';
import { createSlateEditor, serializeHtml } from '@udecode/plate';
import { myComponents, staticPlugins } from './getHtml';
import { EditorStatic } from '../plate-ui/editor-static';

export async function getEditorMarkdownContent(editor: any) {
  const turndownService = new TurndownService();
  
  // Create a static editor instance with the current content
  const editorStatic = createSlateEditor({
    plugins: staticPlugins,
    value: editor.children,
  });

  // Convert to HTML first
  const html = await serializeHtml(editorStatic, {
    components: myComponents,
    editorComponent: EditorStatic,
  });

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(html);
  
  return markdown;
}