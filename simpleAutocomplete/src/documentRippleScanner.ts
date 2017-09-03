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
 * This is a generator function that scans a document for the next match using a pattern similar
 * to a water ripple. I mean, we look for the next match starting from the line where the cursor
 * is (the center of the ripple). Then we move to the line above, then the line below. Then the
 * second line above, then the second line below and so on...
 */
export function* documentRippleScanner(
  document: Readonly<TextDocument>,
  currentPosition: Readonly<Position>,
  // startingUpPosition = currentPosition ,
  // startingDownPosition = currentPosition,
) {
  let nextLineToRead: NextLineToRead = NextLineToRead.Current

  const indexOfFirstLine = 0
  const indexOfLastLine = document.lineCount - 1

  let upLinePointer = currentPosition.line - 1
  let downLinePointer = currentPosition.line + 1
  do {
    if (nextLineToRead === NextLineToRead.Current) {
      yield document.lineAt(currentPosition.line)

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
      yield document.lineAt(upLinePointer)

      upLinePointer--

      if (downLinePointer <= indexOfLastLine) {
        nextLineToRead = NextLineToRead.Lower
      }

      continue
    }

    if (nextLineToRead === NextLineToRead.Lower) {
      yield document.lineAt(downLinePointer)

      downLinePointer++

      if (downLinePointer >= indexOfFirstLine) {
        nextLineToRead = NextLineToRead.Higher
      }

      continue
    }
  } while (upLinePointer >= indexOfFirstLine || downLinePointer <= indexOfLastLine)
}
