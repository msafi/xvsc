import {TextEditor, TextLine} from 'vscode'
import {InlineInput} from './inlineInput'
import {documentRippleScanner} from './documentRippleScanner'

const debounce = require('lodash.debounce') as <T>(fn: T, wait: number, options?: any) => T

let activityIndicatorState = 0
// const jumpChars = [
//   'a', 'b', 'c', 'd', 'e', 'f', 'g',
//   'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
//   'q', 'r', 's',
//   't', 'u', 'v',
//   'w', 'x',
//   'y', /*and*/ 'z',
// ]

// console.log(jumpChars)

export class FindJump {
  isActive = false
  inlineInput: InlineInput
  intervalHandler: any
  userInput: string = ''
  textEditor: TextEditor

  find = (textEditor: TextEditor) => {
    this.textEditor = textEditor

    try {
      if (!this.isActive) {
        this.isActive = true

        this.inlineInput = new InlineInput({
          textEditor,
          onInput: this.onInput,
          onCancel: this.onCancel,
        })
      }

      this.updateStatusBarWithActivityIndicator()
    } catch(e) {
      console.log(e)
    }
  }

  onInput = (input: string) => {
    this.userInput = input
    this.updateStatusBarWithActivityIndicator()
    this.performSearch()
  }

  /*tslint:disable:member-ordering*/
  performSearch = debounce(
    () => {
      console.log('performSearch calls')
      // get the first twenty matches
      const {document, selection} = this.textEditor
      const documentIterator = documentRippleScanner(document, selection.end.line)

      for(const line of documentIterator) {
        const matches = this.getMatches(line)

        console.log('matches', matches)
      }
    },
    500,
    {leading: true, trailing: true},
  )

  getMatches(line: TextLine): {start: number, end: number}[] {
    const indexes = []
    const {text} = line
    const haystack = text.toLowerCase()
    const needle = this.userInput.toLowerCase()

    let index = 0
    while ((index = haystack.indexOf(needle, index + needle.length)) !== -1) {
      indexes.push({start: index, end: index + needle.length})
    }

    return indexes
  }

  onCancel = () => {
    this.isActive = false
    this.userInput = ''
    this.clearActivityIndicator()
  }

  updateStatusBarWithActivityIndicator = () => {
    const callback = () => {
      if (activityIndicatorState === 1) {
        this.inlineInput.updateStatusBar(`Find-Jump: ${this.userInput} 🔴`)
        activityIndicatorState = 0
      } else {
        this.inlineInput.updateStatusBar(`Find-Jump: ${this.userInput} ⚪`)
        activityIndicatorState = 1
      }
    }

    this.inlineInput.updateStatusBar(
      `Find-Jump: ${this.userInput} ${activityIndicatorState === 0 ? '🔴' : '⚪'}`,
    )

    if (this.intervalHandler === undefined) {
      this.intervalHandler = setInterval(callback, 600)
    }
  }

  clearActivityIndicator = () => {
    clearInterval(this.intervalHandler)
    this.intervalHandler = undefined
  }
}
