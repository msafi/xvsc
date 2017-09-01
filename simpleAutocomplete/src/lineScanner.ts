import {
  Position,
  TextDocument,
  TextLine
} from 'vscode'

/**
 * This is a pure function that's responsible for scanning a line for matches.
 */
type LineScannerArgs = {
  needle: string,
  line: TextLine,
  discardedMatches: string[],
}
type LineScannerReturn = {
  match: string,
  discardedMatches: string[],
  characterPosition: number
}
export function lineScanner(args: Readonly<LineScannerArgs>): Readonly<LineScannerReturn> {
  return {} as any
}