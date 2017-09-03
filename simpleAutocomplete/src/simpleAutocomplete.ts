import {
  TextEditor,
  window,
  // TextLine,
} from 'vscode'
import {documentRippleScanner} from './documentRippleScanner'
// import {Token, tokenizer} from './tokenizer'
import {tokenizer} from './tokenizer'

const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

export class SimpleAutocomplete {
  state: {
    needle: string,
    nextGenerator: IterableIterator<string> | undefined,
  }

  constructor() {
    this.next = this.next.bind(this)
    this.reset = this.reset.bind(this)

    this.reset()
  }

  reset() {
    this.state = {
      needle: '',
      nextGenerator: undefined,
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

  *nextGenerator(activeTextEditor: TextEditor) {
    const documentIterator = documentRippleScanner(
      activeTextEditor.document,
      activeTextEditor.selection.end,
    )

    let nextLine = documentIterator.next()

    while(!nextLine.done && nextLine.value !== undefined) {
      const tokensIterator = tokenizer(nextLine.value.text, wordSeparators)

      let nextToken = tokensIterator.next()

      while(!nextToken.done && nextToken.value !== undefined) {
        console.log(nextToken.value.value)
        nextToken = tokensIterator.next()
        yield ''
      }

      nextLine = documentIterator.next()
    }
  }

  next(activeTextEditor: TextEditor) {
    try {
      if (!this.state.nextGenerator) {
        this.state.nextGenerator = this.nextGenerator(activeTextEditor)
      }

      const nextResult = this.state.nextGenerator.next()

      if (nextResult.done || nextResult.value === undefined) {
        this.reset()
      }
    } catch (e) {
      console.log(e)
    }
  }
}
