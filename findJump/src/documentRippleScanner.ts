import {
  TextDocument,
} from 'vscode'

enum NextLineToRead {
  Current,
  Higher,
  Lower,
}

/**
 * This is a generator function that scans a document using a pattern similar to a water ripple. I
 * mean, we start from the line where the cursor is (as if that was the center of the ripple). Then
 * we move to the line above, then the line below. Then the second line above, then the second line
 * below and so on...
 */
export function* documentRippleScanner(
  document: Readonly<TextDocument>,
  startingLine: number,
) {
  let nextLineToRead: NextLineToRead = NextLineToRead.Current

  const indexOfFirstLine = 0
  const indexOfLastLine = document.lineCount - 1

  let upLinePointer = startingLine - 1
  let downLinePointer = startingLine + 1
  do {
    if (nextLineToRead === NextLineToRead.Current) {
      yield {line: document.lineAt(startingLine), index: startingLine}

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
      yield {line: document.lineAt(upLinePointer), index: upLinePointer}

      upLinePointer--

      if (downLinePointer <= indexOfLastLine) {
        nextLineToRead = NextLineToRead.Lower
      }

      continue
    }

    if (nextLineToRead === NextLineToRead.Lower) {
      yield {line: document.lineAt(downLinePointer), index: downLinePointer}

      downLinePointer++

      if (upLinePointer >= indexOfFirstLine) {
        nextLineToRead = NextLineToRead.Higher
      }

      continue
    }
  } while (upLinePointer >= indexOfFirstLine || downLinePointer <= indexOfLastLine)
}
