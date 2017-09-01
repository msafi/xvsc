import {
  Position,
  TextEditor,
  window,
  TextLine
} from 'vscode'

export class SimpleAutocomplete {
  lines: TextLine[]
  state: {
    isSearching: boolean,
    higherLinePointer: number,
    lowerLinePointer: number,
    upPosition: Position,
    downPosition: Position
    needle: string,
    matches: string[]
  }

  constructor() {
    this.next = this.next.bind(this)
    this.reset = this.reset.bind(this)

    this.reset()
    this.lines = []
  }

  reset() {
    this.state = {
      needle: '',
      isSearching: false,
      higherLinePointer: NaN,
      lowerLinePointer: NaN,
      upPosition: new Position(0,0),
      downPosition: new Position(0, 0),
      matches: []
    }
  }

  setNeedle() {
    const {activeTextEditor} = window
    if (activeTextEditor) {
      const {document} = activeTextEditor

      this.state.needle = document.getText(
        document.getWordRangeAtPosition(activeTextEditor.selection.end)
      )
    }
  }

  scanLine({text}: TextLine) {
    return 0
  }

  next(activeTextEditor: TextEditor) {
    try {} catch (e) {
      console.log(e.stacktrace || e)
    }

      // activeTextEditor.edit((textEditorEdit) => {
      //   textEditorEdit.insert(activeTextEditor.selection.end, String(this.state++))
      // })
  }
}

enum NextLineToRead {
  Current,
  Higher,
  Lower
}