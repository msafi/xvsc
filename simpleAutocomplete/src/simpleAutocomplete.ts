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

          // After reading the current line, we read the one above.
          nextLineToRead = NextLineToRead.Higher
          continue
        }

        // if `nextLineToRead` is pointing to the higher line, we start reading the next higher
        // line.
        if (nextLineToRead === NextLineToRead.Higher) {
          lines.push(document.lineAt(higherLinePointer))
          higherLinePointer--

          if (lowerLinePointer <= indexOfLastLine) {
            nextLineToRead = NextLineToRead.Lower
          }

          continue
        }

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

function _inverter(num: number) {
  return num * -1
}

function _safeGetLine(index: number, ) {

}

enum NextLineToRead {
  Current,
  Higher,
  Lower
}