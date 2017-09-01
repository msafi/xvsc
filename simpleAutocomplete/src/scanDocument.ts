/**
 * This function scans a document for the next match
 */
function scanDocument(

) {
  const { document, selection } = activeTextEditor

  // Before we proceed, let's check if we have a need to work with. If we do, that means this
  // is a subsequent `next` call. Not the first one. In which case, we don't need to set the
  // needle. Instead, we need to work with the one we've initialized with previously.
  if (this.state.needle === '') {
    this.setNeedle()
  }

  // If at this point we still don't have a needle, that means the user's cursor is not on a
  // word. We abort.
  if (this.state.needle === '') {
    return
  }

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

  // This is the index of the starting line
  const startingLineIndex = activeTextEditor.selection.end.line

  // This is the index of the first line in the document. We can't go higher than index 0.
  const indexOfFirstLine = 0

  // This is the index of the lowest line in the document. We can't go lower than it.
  const indexOfLastLine = document.lineCount - 1

  // Now we initialize pointers to keep track of which line to read next

  // The first higher line we'll read is the one directly above the starting line. Then we'll
  // keep decrementing this pointer until we reach the index of the first line in the document.
  this.state.higherLinePointer = startingLineIndex - 1

  // The first lower line we'll read is the one directly below the starting line. Then we'll
  // keep increasing this pointer until we reach the index of the last line in the document.
  this.state.lowerLinePointer = startingLineIndex + 1

  // We start looping using a do-while loop because we have to execute the code below at least
  // once for reading the current line.
  //
  // The conditions in the `while` clause below ensure that we continue to loop as long as long
  // as the pointers are within their limits.
  do {
    // This is the first block we execute.
    if (nextLineToRead === NextLineToRead.Current) {
      const line = document.lineAt(startingLineIndex)
      const match = this.scanLine(line)

      // if (match) {
      //   this.setMatch(match)
      //   break
      // }

      if (this.state.higherLinePointer >= indexOfFirstLine) {
        // After reading the current line, we first attempt to read a higher line if one is
        // available.
        nextLineToRead = NextLineToRead.Higher
      } else if (this.state.lowerLinePointer <= indexOfLastLine) {
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
      this.lines.push(document.lineAt(this.state.higherLinePointer))

      // We decrement the higherLinePointer so that next higher line we read is the one above
      // the one we just read.
      this.state.higherLinePointer--

      // Next we check if there are more lower lines we need to read before we proceed. If
      // there are lower lines, we instruct the do-while loop to read a lower line next.
      // Otherwise we don't set `nextLineToRead` which in effect causes us to continue reading
      // higher lines until they are all exhausted.
      if (this.state.lowerLinePointer <= indexOfLastLine) {
        nextLineToRead = NextLineToRead.Lower
      }

      continue
    }

    // This `if` block works the same as the `if` block above it except it is for dealing with
    // lower lines rather than the higher ones.
    if (nextLineToRead === NextLineToRead.Lower) {
      this.lines.push(document.lineAt(this.state.lowerLinePointer))
      this.state.lowerLinePointer++

      if (this.state.higherLinePointer >= indexOfFirstLine) {
        nextLineToRead = NextLineToRead.Higher
      }

      continue
    }
  } while (
    this.state.higherLinePointer >= indexOfFirstLine
    ||
    this.state.lowerLinePointer <= indexOfLastLine
  )
      // console.log(JSON.stringify(this.lines.map(line => line.text), null, 2))

}