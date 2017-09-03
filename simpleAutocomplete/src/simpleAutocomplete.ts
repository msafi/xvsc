import {
  Position,
  TextEditor,
  window,
  TextLine,
} from 'vscode'
import {documentRippleScanner} from './documentRippleScanner'
// import {lineScanner} from './lineScanner'

export class SimpleAutocomplete {
  state: {
    isSearching: boolean,
    upPosition: Position,
    downPosition: Position
    needle: string,
    matches: string[],
    documentRippleIterator: IterableIterator<TextLine> | undefined,
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
      matches: [],
      documentRippleIterator: undefined,
    }
  }

  setNeedle() {
    const {activeTextEditor} = window

    if (activeTextEditor) {
      const {document} = activeTextEditor

      this.state.needle = document.getText(
        document.getWordRangeAtPosition(activeTextEditor.selection.end),
      )
    }
  }

  next(activeTextEditor: TextEditor) {
    // this.setNeedle()

    // if (!this.state.needle) {
    //   return
    // }

    try {
      if (!this.state.documentRippleIterator) {
        const documentRippleIterator = documentRippleScanner(
          activeTextEditor.document,
          activeTextEditor.selection.end,
        )

        this.state.documentRippleIterator = documentRippleIterator
      }

      // console.log(JSON.stringify([...this.state.documentRippleIterator].map(({text}) => text), null, 2))
      const next = this.state.documentRippleIterator.next()

      console.log(next.value.text)
    } catch (e) {
      console.log(e)
    }

    // const next = this.state.documentRippleIterator.next()

    // do {

    // } while(!next.done)
  }
}
