import * as c from 'vscode';
import * as shelljs from 'shelljs'
import * as _ from 'lodash'

export const deleteToTextBeginning = () => {
  const activeTextEditor = c.window.activeTextEditor
  
  activeTextEditor.edit((textEditorEdit) => {
    textEditorEdit.delete(new c.Range(
      activeTextEditor.selection.end.line,
      activeTextEditor.document.lineAt(
        activeTextEditor.selection.end.line
      ).firstNonWhitespaceCharacterIndex,
      activeTextEditor.selection.end.line,
      activeTextEditor.selection.end.character,
    ))
  })
}