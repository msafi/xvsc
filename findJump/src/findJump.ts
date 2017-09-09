import {
  Selection,
  TextEditor,
  TextLine,
  Range,
} from 'vscode'
import {InlineInput} from './inlineInput'
import {documentRippleScanner} from './documentRippleScanner'
import {AssociationManager} from './associationManager'

// TYPES
type Match = { start: number, end: number, excludedChars: string[] }
type MatchesArr = Match[]

let activityIndicatorState = 0

const associationManager = new AssociationManager()
const debounce = require('lodash.debounce') as <T>(fn: T, wait: number, options?: any) => T
const jumpChars = [
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

// console.log(jumpChars)

export class FindJump {
  isActive = false
  inlineInput: InlineInput
  intervalHandler: any
  userInput: string = ''
  textEditor: TextEditor
  associations: Map<string, Range> = new Map()

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
    if (input.length > this.userInput.length) {
      const jumpChar = input[input.length - 1]

      if (this.associations.has(jumpChar)) {
        this.jump(jumpChar)
        this.onCancel()
        return
      }
    }

    this.userInput = input
    this.updateStatusBarWithActivityIndicator()
    this.performSearch()
  }

  /*tslint:disable:member-ordering*/
  performSearch = debounce(
    () => {
      const availableJumpChars = [...jumpChars]
      if (associationManager.activeDecorations.length > 0) {
        associationManager.dispose()
      }

      const {document, selection} = this.textEditor
      const documentIterator = documentRippleScanner(document, selection.end.line)

      const matches: {value: Match, index: number}[] = []
      // const decoratedMatches = []
      for(const {line, index} of documentIterator) {
        // const lineMatches = this.getMatches(line).map((match) => ({value: match, index}))

        this.getMatches(line).forEach((match) => {
          matches.push({value: match, index})
          match.excludedChars.forEach((excludedChar) => {
            let indexOfExcludedSmallChar
            if (
              (indexOfExcludedSmallChar = availableJumpChars.indexOf(excludedChar.toLowerCase())) !== -1
            ) {
              availableJumpChars.splice(indexOfExcludedSmallChar, 1)
            }

            let indexOfExcludedBigChar
            if (
              (indexOfExcludedBigChar = availableJumpChars.indexOf(excludedChar.toUpperCase())) !== -1
            ) {
              availableJumpChars.splice(indexOfExcludedBigChar, 1)
            }
          })
        })

        // console.log('excludedChars', [...excludedChars])
        // if (lineMatches.length > 0) {
        //   matches.push(...lineMatches)
        // }
      }

      const matchesIsBigger = matches.length > availableJumpChars.length
      const iterationLength = matchesIsBigger ? availableJumpChars.length : matches.length

      for(let i = 0; i < iterationLength; i++) {
        const match = matches[i]
        const availableJumpChar = availableJumpChars[i]
        const range = new Range(
          match.index,
          match.value.start,
          match.index,
          match.value.end,
        )

        associationManager.createAssociation(
          availableJumpChar,
          range,
          this.textEditor,
        )

        this.associations.set(availableJumpChar, range)
      }

      // this.textEditor.setDecorations(
      //   this.decoration,
      //   matches.map(match => new Range(
      //     match.index,
      //     match.value.start,
      //     match.index,
      //     match.value.end,
      //   )),
      // )
    },
    200,
    {trailing: true},
  )

  jump = (jumpChar: string) => {
    const range = this.associations.get(jumpChar)

    if (range) {
      this.textEditor.selection = new Selection(
        range.start.line,
        range.start.character,
        range.start.line,
        range.start.character,
      )
    }
  }

  getMatches(line: TextLine): MatchesArr {
    const indexes = []
    const {text} = line
    const haystack = text.toLowerCase()
    const needle = this.userInput.toLowerCase()

    let index = 0
    let iterationNumber = 0
    while (
      (
        index = haystack.indexOf(
          needle,
          iterationNumber === 0 ? 0 : index + needle.length,
        )
      ) !== -1
    ) {
      const start = index
      const end = index + needle.length
      const excludedChars = haystack.slice(end, end + 5).replace(/[^a-z]/gi, '').split('')
      indexes.push({start, end, excludedChars})
      iterationNumber++
    }

    return indexes
  }

  onCancel = () => {
    this.isActive = false
    this.userInput = ''
    this.clearActivityIndicator()
    associationManager.dispose()
    this.associations = new Map()
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
