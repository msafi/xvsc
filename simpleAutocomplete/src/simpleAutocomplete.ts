import {
  window,
  TextLine
} from 'vscode'

export class SimpleAutocomplete {
  state: number

  constructor() {
    this.state = 0

    this.next = this.next.bind(this)
  }

  next() {
    try {
      const {activeTextEditor} = window

      if (!activeTextEditor) {
        return
      }

      const {document, selection} = activeTextEditor
      const word = document.getText(document.getWordRangeAtPosition(selection.end))

      // To find matches, we will need to scan the document starting from the line where the cursor
      // currently is and then start to expand from that line in both directions up and down until
      // we find a match.
      //
      // So, starting of current line. We look at first line above. Then first line below. Then
      // second line above. Then second line below. Then third line above. Then third line below.
      // And so on. If the lines in either direction are exhausted before the other direction. We
      // continue going in one direction only.

      // This tells us which line to read next. We start by reading the current line where the
      // user cursor is.
      let nextLineToRead: NextLineToRead = NextLineToRead.Current
      const lines: TextLine[] = []

      // This is the first line we read
      const startingLineIndex = activeTextEditor.selection.end.line

      // This is the index of the first line in the document. We can't go higher than index 0.
      const indexOfFirstLine = 0

      // This is the index of the lowest line in the document. We can't go lower than it.
      const indexOfLastLine = document.lineCount - 1

      // Now we initialize pointers to keep track of which line to read next

      // The first higher line we'll read is the one directly above the starting line. Then we'll
      // keep decrementing this pointer until we reach the index of the first line in the document.
      let higherLinePointer = startingLineIndex - 1

      // The first lower line we'll read is the one directly below the starting line. Then we'll
      // keep increasing this pointer until we reach the index of the last line in the document.
      let lowerLinePointer = startingLineIndex + 1

      // We start looping using a do-while loop because we have to execute the code below at least
      // once for reading the current line.
      //
      // The conditions in the `while` clause below ensure that we continue to loop as long as long
      // as the pointers are within their limits.
      do {
        // This is the first block we execute.
        if (nextLineToRead === NextLineToRead.Current) {
          lines.push(document.lineAt(startingLineIndex))

          if (higherLinePointer >= indexOfFirstLine) {
            // After reading the current line, we first attempt to read a higher line if one is
            // available.
            nextLineToRead = NextLineToRead.Higher
          } else if (lowerLinePointer <= indexOfLastLine) {
            // If no higher line is available, we attempt to read a lower line next
            nextLineToRead = NextLineToRead.Lower
          } else {
            // If no lower line is available, we break out of the loop because there are no more
            // lines to read.
            break
          }

          continue
        }

        // if `nextLineToRead` is pointing to the higher line, we start reading the next higher
        // line.
        if (nextLineToRead === NextLineToRead.Higher) {
          lines.push(document.lineAt(higherLinePointer))

          // We decrement the higherLinePointer so that next higher line we read is the one above
          // the one we just read.
          higherLinePointer--

          // Next we check if there are more lower lines we need to read before we proceed. If
          // there are lower lines, we instruct the do-while loop to read a lower line next.
          // Otherwise we don't set `nextLineToRead` which in effect causes us to continue reading
          // higher lines until they are all exhausted.
          if (lowerLinePointer <= indexOfLastLine) {
            nextLineToRead = NextLineToRead.Lower
          }

          continue
        }

        // This `if` block works the same as the `if` block above it except it is for dealing with
        // lower lines rather than the higher ones.
        if (nextLineToRead === NextLineToRead.Lower) {
          lines.push(document.lineAt(lowerLinePointer))
          lowerLinePointer++

          if (higherLinePointer >= indexOfFirstLine) {
            nextLineToRead = NextLineToRead.Higher
          }

          continue
        }
      } while(
        higherLinePointer >= indexOfFirstLine
        ||
        lowerLinePointer <= indexOfLastLine
      )

      console.log(JSON.stringify(lines.map(line => line.text), null, 2))
    } catch (e) {
      console.log(e.stacktrace || e)
    }

      // activeTextEditor.edit((textEditorEdit) => {
      //   textEditorEdit.insert(activeTextEditor.selection.end, String(this.state++))
      // })
  }
}

enum NextLineToRead {
  Current,
  Higher,
  Lower
}