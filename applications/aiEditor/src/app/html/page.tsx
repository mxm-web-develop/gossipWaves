import React from 'react';

import { withProps } from '@udecode/cn';
import {
  type Value,
  BaseParagraphPlugin,
  SlateLeaf,
  createSlateEditor,
  serializeHtml,
} from '@udecode/plate';
import { BaseAlignPlugin } from '@udecode/plate-alignment';
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote';
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { BaseCommentsPlugin } from '@udecode/plate-comments';
import { BaseDatePlugin } from '@udecode/plate-date';
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from '@udecode/plate-font';
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from '@udecode/plate-heading';
import { BaseHighlightPlugin } from '@udecode/plate-highlight';
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { BaseIndentPlugin } from '@udecode/plate-indent';
import { BaseIndentListPlugin } from '@udecode/plate-indent-list';
import { BaseKbdPlugin } from '@udecode/plate-kbd';
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout';
import { BaseLineHeightPlugin } from '@udecode/plate-line-height';
import { BaseLinkPlugin } from '@udecode/plate-link';
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from '@udecode/plate-math';
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from '@udecode/plate-media';
import { BaseMentionPlugin } from '@udecode/plate-mention';
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table';
import { BaseTogglePlugin } from '@udecode/plate-toggle';
import fs from 'node:fs/promises';
import path from 'node:path';
import Prism from 'prismjs';

import { H3 } from '@/components/typography';
import {
  EditorClient,
  ExportHtmlButton,
  HtmlIframe,
} from '@/components/editor/slate-to-html';
import { alignValue } from '@/components/values/align-value';
import { basicElementsValue } from '@/components/values/basic-elements-value';
import { basicMarksValue } from '@/components/values/basic-marks-value';
import { columnValue } from '@/components/values/column-value';
import { commentsValue } from '@/components/values/comments-value';
import { dateValue } from '@/components/values/date-value';
import { equationValue } from '@/components/values/equation-value';
import { fontValue } from '@/components/values/font-value';
import { highlightValue } from '@/components/values/highlight-value';
import { horizontalRuleValue } from '@/components/values/horizontal-rule-value';
import { indentListValue } from '@/components/values/indent-list-value';
import { indentValue } from '@/components/values/indent-value';
import { kbdValue } from '@/components/values/kbd-value';
import { lineHeightValue } from '@/components/values/line-height-value';
import { linkValue } from '@/components/values/link-value';
import { todoListValue } from '@/components/values/list-value';
import { mediaValue } from '@/components/values/media-value';
import { mentionValue } from '@/components/values/mention-value';
import { tableValue } from '@/components/values/table-value';
import { tocPlaygroundValue } from '@/components/values/toc-value';
import { createHtmlDocument } from '@/lib/create-html-document';
import { BlockquoteElementStatic } from '@/components/plate-ui/blockquote-element-static';
import { CodeBlockElementStatic } from '@/components/plate-ui/code-block-element-static';
import { CodeLeafStatic } from '@/components/plate-ui/code-leaf-static';
import { CodeLineElementStatic } from '@/components/plate-ui/code-line-element-static';
import { CodeSyntaxLeafStatic } from '@/components/plate-ui/code-syntax-leaf-static';
import { ColumnElementStatic } from '@/components/plate-ui/column-element-static';
import { ColumnGroupElementStatic } from '@/components/plate-ui/column-group-element-static';
import { CommentLeafStatic } from '@/components/plate-ui/comment-leaf-static';
import { DateElementStatic } from '@/components/plate-ui/date-element-static';
import { EditorStatic } from '@/components/plate-ui/editor-static';
import { EquationElementStatic } from '@/components/plate-ui/equation-element-static';
import { HeadingElementStatic } from '@/components/plate-ui/heading-element-static';
import { HighlightLeafStatic } from '@/components/plate-ui/highlight-leaf-static';
import { HrElementStatic } from '@/components/plate-ui/hr-element-static';
import { ImageElementStatic } from '@/components/plate-ui/image-element-static';
import {
  FireLiComponent,
  FireMarker,
} from '@/components/plate-ui/indent-fire-marker';
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from '@/components/plate-ui/indent-todo-marker-static';
import { InlineEquationElementStatic } from '@/components/plate-ui/inline-equation-element-static';
import { KbdLeafStatic } from '@/components/plate-ui/kbd-leaf-static';
import { LinkElementStatic } from '@/components/plate-ui/link-element-static';
import { MediaAudioElementStatic } from '@/components/plate-ui/media-audio-element-static';
import { MediaFileElementStatic } from '@/components/plate-ui/media-file-element-static';
import { MediaVideoElementStatic } from '@/components/plate-ui/media-video-element-static';
import { MentionElementStatic } from '@/components/plate-ui/mention-element-static';
import { ParagraphElementStatic } from '@/components/plate-ui/paragraph-element-static';
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@/components/plate-ui/table-cell-element-static';
import { TableElementStatic } from '@/components/plate-ui/table-element-static';
import { TableRowElementStatic } from '@/components/plate-ui/table-row-element-static';
import { TocElementStatic } from '@/components/plate-ui/toc-element-static';
import { ToggleElementStatic } from '@/components/plate-ui/toggle-element-static';
const getCachedTailwindCss = React.cache(async () => {
  const cssPath = path.join(process.cwd(), 'public', 'tailwind.css');

  return await fs.readFile(cssPath, 'utf8');
});

const getCachedPrismCss = React.cache(async () => {
  const cssPath = path.join(process.cwd(), 'public', 'prism.css');

  return await fs.readFile(cssPath, 'utf8');
});

export default async function SlateToHtmlBlock() {
  const components = {
    [BaseAudioPlugin.key]: MediaAudioElementStatic,
    [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
    [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
    [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
    [BaseCodeLinePlugin.key]: CodeLineElementStatic,
    [BaseCodePlugin.key]: CodeLeafStatic,
    [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
    [BaseColumnItemPlugin.key]: ColumnElementStatic,
    [BaseColumnPlugin.key]: ColumnGroupElementStatic,
    [BaseCommentsPlugin.key]: CommentLeafStatic,
    [BaseDatePlugin.key]: DateElementStatic,
    [BaseEquationPlugin.key]: EquationElementStatic,
    [BaseFilePlugin.key]: MediaFileElementStatic,
    [BaseHighlightPlugin.key]: HighlightLeafStatic,
    [BaseHorizontalRulePlugin.key]: HrElementStatic,
    [BaseImagePlugin.key]: ImageElementStatic,
    [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
    [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
    [BaseKbdPlugin.key]: KbdLeafStatic,
    [BaseLinkPlugin.key]: LinkElementStatic,
    // [BaseMediaEmbedPlugin.key]: MediaEmbedElementStatic,
    [BaseMentionPlugin.key]: MentionElementStatic,
    [BaseParagraphPlugin.key]: ParagraphElementStatic,
    [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
    [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
    [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
    [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
    [BaseTableCellPlugin.key]: TableCellElementStatic,
    [BaseTablePlugin.key]: TableElementStatic,
    [BaseTableRowPlugin.key]: TableRowElementStatic,
    [BaseTocPlugin.key]: TocElementStatic,
    [BaseTogglePlugin.key]: ToggleElementStatic,
    [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
    [BaseVideoPlugin.key]: MediaVideoElementStatic,
    [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
    [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
    [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
    [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
    [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
    [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
  };

  const createValue = (): Value => [
    ...basicElementsValue,
    ...basicMarksValue,
    ...tocPlaygroundValue,
    ...todoListValue,
    ...linkValue,
    ...horizontalRuleValue,
    ...tableValue,
    ...equationValue,
    ...columnValue,
    ...mentionValue,
    ...dateValue,
    ...fontValue,
    ...highlightValue,
    ...kbdValue,
    ...commentsValue,
    ...alignValue,
    ...lineHeightValue,
    ...indentValue,
    ...indentListValue,
    ...mediaValue,
  ];

  const editor = createSlateEditor({
    plugins: [
      BaseEquationPlugin,
      BaseInlineEquationPlugin,
      BaseColumnPlugin,
      BaseColumnItemPlugin,
      BaseTocPlugin,
      BaseVideoPlugin,
      BaseAudioPlugin,
      BaseParagraphPlugin,
      BaseHeadingPlugin,
      BaseMediaEmbedPlugin,
      BaseBoldPlugin,
      BaseCodePlugin,
      BaseItalicPlugin,
      BaseStrikethroughPlugin,
      BaseSubscriptPlugin,
      BaseSuperscriptPlugin,
      BaseUnderlinePlugin,
      BaseBlockquotePlugin,
      BaseDatePlugin,
      BaseCodeBlockPlugin.configure({
        options: {
          prism: Prism,
        },
      }),
      BaseIndentPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            BaseBlockquotePlugin.key,
            BaseCodeBlockPlugin.key,
          ],
        },
      }),
      BaseIndentListPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            ...HEADING_LEVELS,
            BaseBlockquotePlugin.key,
            BaseCodeBlockPlugin.key,
            BaseTogglePlugin.key,
          ],
        },
        options: {
          listStyleTypes: {
            fire: {
              liComponent: FireLiComponent,
              markerComponent: FireMarker,
              type: 'fire',
            },
            todo: {
              liComponent: TodoLiStatic,
              markerComponent: TodoMarkerStatic,
              type: 'todo',
            },
          },
        },
      }),
      BaseLinkPlugin,
      BaseTableRowPlugin,
      BaseTablePlugin,
      BaseTableCellPlugin,
      BaseHorizontalRulePlugin,
      BaseFontColorPlugin,
      BaseFontBackgroundColorPlugin,
      BaseFontSizePlugin,
      BaseKbdPlugin,
      BaseAlignPlugin.extend({
        inject: {
          targetPlugins: [
            BaseParagraphPlugin.key,
            BaseMediaEmbedPlugin.key,
            ...HEADING_LEVELS,
            BaseImagePlugin.key,
          ],
        },
      }),
      BaseLineHeightPlugin,
      BaseHighlightPlugin,
      BaseFilePlugin,
      BaseImagePlugin,
      BaseMentionPlugin,
      BaseCommentsPlugin,
      BaseTogglePlugin,
    ],
    value: createValue(),
  });

  const tailwindCss = await getCachedTailwindCss();
  const prismCss = await getCachedPrismCss();
  const katexCDN = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`;

  // const cookieStore = await cookies();
  // const theme = cookieStore.get('theme')?.value;
  const theme = 'light';

  // Get the editor content HTML using EditorStatic
  const editorHtml = await serializeHtml(editor, {
    components,
    editorComponent: EditorStatic,
    props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
  });

  // Create the full HTML document
  const html = createHtmlDocument({
    editorHtml,
    katexCDN,
    prismCss,
    tailwindCss,
    theme,
  });

  return (
    <div className="grid grid-cols-3 px-4">
      <div className="p-2">
        <H3>Editor</H3>
        <EditorClient value={createValue()} />
      </div>

      <div className="p-2">
        <H3>EditorStatic</H3>
        <EditorStatic components={components} editor={editor} />
      </div>

      <div className="p-2">
        <div className="flex items-end gap-2">
          <H3>HTML Iframe</H3>
          <ExportHtmlButton html={html} serverTheme={theme} />
        </div>
        <HtmlIframe className="size-full" html={html} serverTheme={theme} />
      </div>
    </div>
  );
}
