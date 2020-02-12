import {
  Selection,
  Position,
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

export class FindJump {
  isActive = false
  inlineInput: InlineInput
  intervalHandler: any
  userInput: string = ''
  textEditor: TextEditor
  associationManager = new AssociationManager()
  activityIndicatorState = 0
  activatedWithSelection = false
  activatedWithWordSelection = false
  searchFunctionDebounceTracker: any

  activate = (textEditor: TextEditor) => {
    this.textEditor = textEditor

    if (this.isActive) {
      this.reset()
    }

    this.isActive = true

    this.inlineInput = new InlineInput({
      textEditor,
      onInput: this.onInput,
      onCancel: this.reset,
    })

    this.updateStatusBarWithActivityIndicator()
  }

  activateWithSelection = (textEditor: TextEditor) => {
    this.activatedWithSelection = true
    this.activate(textEditor)
  }

  activateWithWordSelection = (textEditor: TextEditor) => {
    this.activatedWithWordSelection = true
    this.activate(textEditor)
  }

  onInput = (input: string, char: string) => {
    if (
      this.associationManager.associations.has(char) &&
      this.searchFunctionDebounceTracker === undefined
    ) {
      this.jump(char)
      return
    }

    this.userInput = input
    this.updateStatusBarWithActivityIndicator()

    clearTimeout(this.searchFunctionDebounceTracker)
    this.searchFunctionDebounceTracker = setTimeout(
      () => {
        this.performSearch()
        this.searchFunctionDebounceTracker = undefined
      },
      100,
    )
  }

  performSearch = () => {
    const {matches, availableJumpChars} = this.getMatchesAndAvailableJumpChars()

    if (matches.length > 0) {
      this.associationManager.dispose()
    }

    for(let i = 0; i < matches.length; i++) {
      if (availableJumpChars[i] === undefined) {
        break
      }

      const match = matches[i]
      const availableJumpChar = availableJumpChars[i]
      const {index, value} = match
      const range = new Range(index, value.start, index, value.end)

      this.associationManager.createAssociation(availableJumpChar, range, this.textEditor)
    }
  }

  jump = (jumpChar: string) => {
    const range = this.associationManager.associations.get(jumpChar)

    if (!range) {
      return
    }

    const {line, character} = range.start

    const selection = this.getNewSelection(line, character);
    this.textEditor.selection = selection;

    this.reset()
  }

  getNewSelection = (line: number, character: number) => {
    if (this.activatedWithSelection) {
      return new Selection(
        this.textEditor.selection.start.line,
        this.textEditor.selection.start.character,
        line,
        character
      );
    } else if (this.activatedWithWordSelection) {
      const position = new Position(line, character);
      const wordRange = this.textEditor.document.getWordRangeAtPosition(position);

      return new Selection(wordRange.start, wordRange.end);
    } else {
      return new Selection(line, character, line, character);
    }
  }

  getMatchesAndAvailableJumpChars = () => {
    const {document, selection} = this.textEditor
    const documentIterator = documentRippleScanner(document, selection.end.line)
    const availableJumpChars = [...this.associationManager.jumpChars]
    const matches: { value: Match, index: number }[] = []

    outer: for (const {line, index} of documentIterator) {
      const lineMatches = this.getLineMatches(line)

      for(const lineMatch of lineMatches) {
        if (matches.length >= availableJumpChars.length) {
          break outer
        }

        matches.push({value: lineMatch, index})

        for(const excludedChar of lineMatch.excludedChars) {
          for (let i = 0; i < 2; i++) {
            const method = i === 0 ? 'toLowerCase' : 'toUpperCase'
            const indexOfExcludedChar = availableJumpChars.indexOf(excludedChar[method]())

            if (indexOfExcludedChar !== -1) {
              availableJumpChars.splice(indexOfExcludedChar, 1)
            }
          }
        }
      }
    }

    return {matches, availableJumpChars}
  }

  getLineMatches = (line: TextLine): MatchesArr => {
    const indexes = []
    const {text} = line
    const haystack = text.toLowerCase()
    const needle = this.userInput.toLowerCase()

    let index = 0
    let iterationNumber = 0
    while (
      (index = haystack.indexOf(needle, iterationNumber === 0 ? 0 : index + needle.length)) !== -1
    ) {
      const start = index
      const end = index + needle.length
      const excludedChars = haystack.slice(end, end + 8).replace(/[^a-z]/gi, '').split('')
      indexes.push({start, end, excludedChars})
      iterationNumber++
    }

    return indexes
  }

  reset = () => {
    this.isActive = false
    this.activatedWithSelection = false
    this.activatedWithWordSelection = false;
    this.userInput = ''
    this.clearActivityIndicator()
    this.inlineInput.destroy()
    this.associationManager.dispose()
  }

  updateStatusBarWithActivityIndicator = () => {
    const callback = () => {
      if (this.activityIndicatorState === 1) {
        this.inlineInput.updateStatusBar(`Find-Jump: ${this.userInput} 🔴`)
        this.activityIndicatorState = 0
      } else {
        this.inlineInput.updateStatusBar(`Find-Jump: ${this.userInput} ⚪`)
        this.activityIndicatorState = 1
      }
    }

    this.inlineInput.updateStatusBar(
      `Find-Jump: ${this.userInput} ${this.activityIndicatorState === 0 ? '🔴' : '⚪'}`,
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
