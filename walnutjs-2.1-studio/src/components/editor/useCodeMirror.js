import { EditorState } from '@codemirror/state';
import {
  drawSelection, EditorView, keymap, 
  lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
} from '@codemirror/view';
import {
  defaultKeymap, history, historyKeymap, indentWithTab,
} from '@codemirror/commands';
import { linter } from '@codemirror/lint';
import { foldGutter, syntaxHighlighting, indentUnit } from '@codemirror/language'
import { useHighlightStyle } from './useHighlightStyle.js';
import { json, jsonParseLinter } from '@codemirror/lang-json';

export function getEditorState(store) {
  return EditorState.create({
    doc: JSON.stringify(store.json, null, 2),
    extensions: [
      // Maybe add vim mode? ;)
      // vim(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      history(),
      indentUnit.of('  '),
      json(),
      linter(jsonParseLinter()),
      syntaxHighlighting(useHighlightStyle(), {fallback: true}),
      lineNumbers(),
      foldGutter(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      drawSelection(),
      EditorView.updateListener.of((update) => {
        if (!update.changes) return;

        store.json = JSON.parse(update.state.doc.toString());
      }),
    ],
  });
}
