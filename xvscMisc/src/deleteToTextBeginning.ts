import { TextEditor, Range } from 'vscode';

export const deleteToTextBeginning = (textEditor: TextEditor) => {
  const { selection } = textEditor;

  textEditor.edit(textEditorEdit => {
    textEditorEdit.delete(
      new Range(
        selection.end.line,
        textEditor.document.lineAt(selection.end.line).firstNonWhitespaceCharacterIndex,
        selection.end.line,
        selection.end.character,
      ),
    );
  });
};
