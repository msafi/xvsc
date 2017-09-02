const escapeRegExp = require('escape-string-regexp')

/**
 * This function takes a string and returns an array of the separate words in the given line.
 *
 * @param str The String to be tokenized
 * @param wordSeparators The splitters by which to tokenize the string
 */
export function tokenizer(str: string, wordSeparators: string) {
  const tokens = []
  const wordSeparatorsRegExp = new RegExp(`[${escapeRegExp(wordSeparators)}\\s]`)

  let tokenStartIndex
  for (let i = 0; i < str.length; i++) {
    const currentCharacter = str[i]
    const currentCharacterIsAWordSeparator = wordSeparatorsRegExp.test(currentCharacter)

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
