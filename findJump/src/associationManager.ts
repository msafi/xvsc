import {
  TextEditorDecorationType,
  window,
  ThemeColor,
  Range,
  TextEditor,
} from 'vscode'

export class AssociationManager {
  public activeDecorations: TextEditorDecorationType[] = []
  public associations: Map<string, Range> = new Map()
  public jumpChars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's',
    't', 'u', 'v',
    'w', 'x',
    'y', 'z',

    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S',
    'T', 'U', 'V',
    'W', 'X',
    'Y', 'Z',
  ]

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
    this.associations.set(letter, range)
  }

  public dispose = () => {
    this.activeDecorations.forEach((activeDecoration) => activeDecoration.dispose())

    this.associations = new Map()
    this.activeDecorations = []
  }
}
