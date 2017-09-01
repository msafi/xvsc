import {
  TextLine,
} from 'vscode'

const escapeRegExp = require('escape-string-regexp')

/**
 * This is a pure function that's responsible for scanning a line for matches.
 */
interface LineScannerArgs {
  needle: string
  line: TextLine
  discardedMatches: string[]
}
interface LineScannerReturn {
  match: string
  discardedMatches: string[]
  characterPosition: number
}
export function lineScanner(args: Readonly<LineScannerArgs>): Readonly<LineScannerReturn> {
  console.log(args)
  return {} as any
}

export function _tokenize(str: string, wordSeparators: string) {
  const tokens = []
  const regexp = new RegExp(`[${escapeRegExp(wordSeparators)}\\s]`)

  let tokenStartIndex
  for (let i = 0; i < str.length; i++) {
    const currentCharacter = str[i]
    const currentCharacterIsAWordSeparator = regexp.test(currentCharacter)

    if (!currentCharacterIsAWordSeparator && tokenStartIndex === undefined) {
      tokenStartIndex = i
    } else if (currentCharacterIsAWordSeparator && tokenStartIndex !== undefined) {
      tokens.push({
        value: str.slice(tokenStartIndex, i),
        character: i,
      })

      tokenStartIndex = undefined
    }
  }

  return tokens
}
