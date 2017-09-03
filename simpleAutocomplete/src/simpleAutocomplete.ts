import {
  Position,
  TextEditor,
  window,
  TextLine
} from 'vscode'
import {documentRippleScanner} from './documentRippleScanner'
import {lineScanner} from './lineScanner'

export class SimpleAutocomplete {
  state: {
    isSearching: boolean,
    upPosition: Position,
    downPosition: Position
    needle: string,
    matches: string[]
  }

  constructor() {
    this.next = this.next.bind(this)
    this.reset = this.reset.bind(this)

    this.reset()
  }

  reset() {
    this.state = {
      needle: '',
      isSearching: false,
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

  next(activeTextEditor: TextEditor) {
    this.setNeedle()

    if (!this.state.needle) {
      return
    }

    const scanResults = documentRippleScanner(
      activeTextEditor.document,
      activeTextEditor.selection.end,
      this.state.upPosition,
      this.state.downPosition,
      (...args) => lineScanner(this.state.needle, ...args)
    )

    const {
      lastScannedUpPosition,
      lastScannedDownPosition,
      match
    } = scanResults

    if (match) {
      this.setMatch(match)

      this.state = {
        ...this.state,
        upPosition: lastScannedUpPosition,
        downPosition: lastScannedDownPosition,
      }
    } else {
      this.reset()
    }
  }
}
