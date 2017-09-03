import {
  Position,
  TextDocument,
  TextLine
} from 'vscode'

enum NextLineToRead {
  Current,
  Higher,
  Lower,
}

type LineProcessor = (
  currentPosition: Position,
  line: TextLine
) => {
  lastScannedCharacter: number,
  done: boolean
}
/**
 * This is a pure function that scans a document for the next match using a pattern similar
 * to a water ripple. I mean, we look for the next match starting from the line where the cursor
 * is (the center of the ripple). Then we move to the line above, then the line below. Then the
 * second line above, then the second line below and so on...
 */
export function documentRippleScanner(
  document: Readonly<TextDocument>,
  currentPosition: Readonly<Position>,
  startingUpPosition = currentPosition ,
  startingDownPosition = currentPosition,
  lineScanner: LineProcessor
): {
  lastScannedUpPosition: Readonly<Position>,
  lastScannedDownPosition: Readonly<Position>,
  lastScannedCurrentPosition: Readonly<Position>
  lines?: string[],
  [name: string]: any
} {
  const lines: string[] = []

  let nextLineToRead: NextLineToRead = NextLineToRead.Current

  const indexOfFirstLine = 0
  const indexOfLastLine = document.lineCount - 1

  let upLinePointer = startingUpPosition.line - 1
  let downLinePointer = startingDownPosition.line + 1
  do {
    if (nextLineToRead === NextLineToRead.Current) {
      const line = document.lineAt(currentPosition.line)
      const results = lineScanner(currentPosition, line)

      if (results.done) {
        return {
          lastScannedUpPosition: startingUpPosition,
          lastScannedDownPosition: startingDownPosition,
          lastScannedCurrentPosition: new Position(
            currentPosition.line,
            results.lastScannedCharacter
          ),
          ...results
        }
      }

      lines.push(line.text)

      if (upLinePointer >= indexOfFirstLine) {
        nextLineToRead = NextLineToRead.Higher
      } else if (downLinePointer <= indexOfLastLine) {
        nextLineToRead = NextLineToRead.Lower
      } else {
        break
      }

      continue
    }

    if (nextLineToRead === NextLineToRead.Higher) {
      lines.push(document.lineAt(upLinePointer).text)

      upLinePointer--

      if (downLinePointer <= indexOfLastLine) {
        nextLineToRead = NextLineToRead.Lower
      }

      continue
    }

    if (nextLineToRead === NextLineToRead.Lower) {
      lines.push(document.lineAt(downLinePointer).text)

      downLinePointer++

      if (downLinePointer >= indexOfFirstLine) {
        nextLineToRead = NextLineToRead.Higher
      }

      continue
    }
  } while (upLinePointer >= indexOfFirstLine || downLinePointer <= indexOfLastLine)

  return {
    lastScannedUpPosition: new Position(upLinePointer, 0),
    lastScannedDownPosition: new Position(downLinePointer, 0),
    lines
  }
}
