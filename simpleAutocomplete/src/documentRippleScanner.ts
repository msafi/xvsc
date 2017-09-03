import {
  Position,
  TextDocument,
} from 'vscode'

enum NextLineToRead {
  Current,
  Higher,
  Lower,
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
): {
  lastScannedUpPosition: Readonly<Position>,
  lastScannedDownPosition: Readonly<Position>,
  lines?: string[]
} {
  const lines: string[] = []

  let nextLineToRead: NextLineToRead = NextLineToRead.Current

  const indexOfFirstLine = 0
  const indexOfLastLine = document.lineCount - 1

  let upLinePointer = startingUpPosition.line - 1
  let downLinePointer = startingDownPosition.line + 1
  do {
    if (nextLineToRead === NextLineToRead.Current) {
      lines.push(document.lineAt(currentPosition.line).text)

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
