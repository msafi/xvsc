import {
  Position,
  TextEditor,
  window,
  TextLine
} from 'vscode'
import {documentScanner} from './documentScanner'

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
      upPosition: new Position(0, 0),
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
    try {
      const { document, selection } = activeTextEditor

      // Before we proceed, let's check if we have a need to work with. If we do, that means this
      // is a subsequent `next` call. Not the first one. In which case, we don't need to set the
      // needle. Instead, we need to work with the one we've initialized with previously.
      if (this.state.needle === '') {
        this.setNeedle()
      }

      // If at this point we still don't have a needle, that means the user's cursor is not on a
      // word. We abort.
      if (this.state.needle === '') {
        return
      }

      // This is the index of the starting line
      const startingLineIndex = activeTextEditor.selection.end.line

      // Now we initialize pointers to keep track of which line to read next

      // The first higher line we'll read is the one directly above the starting line. Then we'll
      // keep decrementing this pointer until we reach the index of the first line in the document.
      this.state.higherLinePointer = startingLineIndex - 1

      // The first lower line we'll read is the one directly below the starting line. Then we'll
      // keep increasing this pointer until we reach the index of the last line in the document.
      this.state.lowerLinePointer = startingLineIndex + 1

      documentScanner(
        document,
        activeTextEditor.selection,

      )

    } catch (e) {
      console.log(e.stacktrace || e)
    }

      // activeTextEditor.edit((textEditorEdit) => {
      //   textEditorEdit.insert(activeTextEditor.selection.end, String(this.state++))
      // })
  }
}
