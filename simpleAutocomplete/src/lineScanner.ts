/* tslint:disable */
// import {
//   TextLine,
//   Position
// } from 'vscode'
// import {tokenizer} from './tokenizer'

// const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

// /**
//  * This is a pure function that's responsible for scanning a line for matches.
//  */
// export function lineScanner(
//   needle: Readonly<string>,
//   // discardedMatches: ReadonlyArray<string>
//   {text}: Readonly<TextLine>,
//   currentPosition: Readonly<Position>
// ) {
//   const tokens = tokenizer(text, wordSeparators)
//   const matchingToken = tokens.find((token) => {
//     return token.value === needle
//   })

//   return {
//     lastScannedCharacter: matchingToken && matchingToken.character,
//     match: matchingToken && matchingToken.value,
//     done: true
//   }
// }
