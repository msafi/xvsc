import {
  TextEditorDecorationType,
  window,
  ThemeColor,
  Range,
  TextEditor,
} from 'vscode'

export class AssociationManager {
  public activeDecorations: TextEditorDecorationType[] = []

  public createAssociation = (letter: string, range: Range, textEditor: TextEditor) => {
    let finalLetter = letter

    if (letter === letter.toUpperCase()) {
      finalLetter = `⇧${letter.toLowerCase()}`
    }

    const type = window.createTextEditorDecorationType({
      backgroundColor: new ThemeColor('editor.wordHighlightBackground'),
      before: {
        contentText: finalLetter,
        margin: '0 5px 0 5px',
        backgroundColor: '#4169E1',
        border: '3px solid',
        color: 'white',
        borderColor: '#4169E1',
      },
    })

    this.activeDecorations.push(type)

    textEditor.setDecorations(type, [range])
  }

  public dispose = () => {
    this.activeDecorations.forEach((activeDecoration) => {
      activeDecoration.dispose()
    })

    this.activeDecorations = []
  }
}
