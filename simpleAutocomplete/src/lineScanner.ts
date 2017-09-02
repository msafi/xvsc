import {
  TextLine,
} from 'vscode'

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
