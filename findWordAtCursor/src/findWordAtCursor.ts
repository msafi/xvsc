import {
  window,
  TextLine,
  Position,
  Selection,
  TextEditorRevealType,
  OverviewRulerLane,
  ThemeColor,
  Range,
  Disposable,
  TextDocument
} from 'vscode'

// We will decorate found matches with this decoration type, which is just the default theme
// highlight behind the word.
const decorationType = window.createTextEditorDecorationType({
  backgroundColor: new ThemeColor('editor.wordHighlightBackground')
});

// We export eventRegistrations so that we can remove the listeners in `extension.ts` when
// the extension is deactivated
export const eventRegistrations: Disposable[] = []

// `next` seeks forward
export function next() {
  _seek()
}

// `previous` seeks back
export function previous() {
  _seek(true)
}

// When the user moves the mouse, set decorations to an empty array, effectively removing all
// of our decorations.
eventRegistrations.push(window.onDidChangeTextEditorSelection(() => {
  if (window.activeTextEditor) {
    window.activeTextEditor.setDecorations(decorationType, [])
  }
}))

// The seek function
function _seek(seekBack = false) {
  const {activeTextEditor} = window

  // If there's no activeTextEditor, do nothing.
  if (!activeTextEditor) {
    return
  }

  const {document, selection} = activeTextEditor
  const {end, start} = selection
  const isMultiLine = end.line !== start.line

  // If the user is trying to seek while having made a multiline selection, do nothing.
  if (isMultiLine) { return }

  // If the beginning and end of selection are on different line or different characters
  // that means the user is performing a selection search, otherwise, it means the user
  // is making a whole word search
  const isSelectionSearch = end.line !== start.line || end.character !== start.character

  // For selection search, our range is the selection itself. Otherwise, we use
  // `document.getWordRangeAtPosition` to get the range of the word under the cursor
  const wordAtCursorRange = isSelectionSearch
    ? selection
    : document.getWordRangeAtPosition(end, /\w+/g)

  // If at this point, we don't have a word range, abort.
  if (wordAtCursorRange === undefined) { return }

  const needle = document.getText(wordAtCursorRange)

  // Starting from the line at which the user has their cursor, we loop through the
  // rest of the lines in the document either forward or back depending on whether the
  // user triggered the `next` or `previous` command.
  for(
    // The first line we process is the line on which the user cursor currently is because the
    // current line may contain occurrences of the needle farther ahead or behind in the
    // line itself.
    let i = end.line;

    // We loop through the lines either forward or back. If we are looping forward, we'll want to
    // reach up to the last line in the document.
    // If we are looping back, we want to reach as far back as the first line in the document
    seekBack ? i >= 0 : i < document.lineCount;
    seekBack ? i-- : i++
  ) {
    // For each line, we try to find the next occurrence of the needle within that line.
    const indexInLine = _findIndexInLine(
      needle,
      document.lineAt(i),

      //If the line we're looking at is the same line where the cursor currently is, we
      // start searching that line from the location of the first word that appears after or before
      // the cursor, depending on whether we're seeking back or not.
      (i === end.line) ? wordAtCursorRange[seekBack ? 'start' : 'end'].character : undefined,
      seekBack,
      isSelectionSearch,
      i,
      document
    )

    if (indexInLine !== -1) {
      // We have found the match. We select it for selection search, or if it's a word search,
      // we simply place the cursor there.
      const wordSelection = isSelectionSearch ?
        _createSelection(i, indexInLine, i, indexInLine + needle.length) :
        _createSelection(i, indexInLine)

      activeTextEditor.selection = wordSelection

      // Scroll the view to the selection
      activeTextEditor.revealRange(wordSelection, TextEditorRevealType.InCenterIfOutsideViewport)

      // For word search, we want to highlight the match that was navigated to.
      if (!isSelectionSearch) {
        const range = document.getWordRangeAtPosition(new Position(i, indexInLine), /\w+/g)

        if (range) {
          setTimeout(() => {
            activeTextEditor.setDecorations(
              decorationType,
              [range]
            )
          }, 10);
        }
      }

      break
    }
  }
}

function _findIndexInLine(
  word: string,
  textLine: TextLine,
  startSearchAt: number | undefined,
  seekBack: boolean,
  isSelectionSearch: boolean,
  line: number,
  document: TextDocument,
): number {
  const {text} = textLine

  // Based on whether we are seeking back or not, we decide how to find the next occurrence in the
  // line. Let's say we have the following line:
  //
  // ```js
  // import config from 'config';
  // //          |1     |2
  // ```
  //
  // If the cursor position is where the `|1` is, and the user seeks forward, we will cut off
  // everything behind the cursor and look for the `indexOf('config')` in that substring.
  //
  // If the cursor position is where the `|2` is, and the user seeks back, we will cut off
  // everything after the cursor and look for `lastIndexOf('config')`.
  //
  // If the line we're looking at is not the same line where the user's cursor currently is, we
  // will not substring the line. Instead, we will scan it in its entirety.
  //
  // Another case is the following text
  //
  // ```
  // foo
  // foofoo
  // ```
  //
  // In this case, if the cursor is at the beginning of the first line, and we're seeking back,
  // the substring should be an empty string "".
  let indexInLine = seekBack
    ? text.substr(0, startSearchAt === undefined ? text.length : startSearchAt).lastIndexOf(word)
    : text.substr(startSearchAt || 0).indexOf(word)

  // To make the `indexInLine` relative to the full length of the line, we need to add back the
  // length of the portion which we've cut out.
  indexInLine = (indexInLine === -1)
    ? -1
    : indexInLine + (seekBack ? 0 : startSearchAt || 0)

  // When the user is performing a whole word search, using `indexOf` might give us some
  // false positives. For example, if we're searching for the word "for" and the line has the
  // word `forward` in it, `indexOf` will report the substring `for` in `forward` as a match.
  //
  // This is a problem for whole word operations only. Selection operations are intended to
  // match `for` in `forward` by design, so that's not a problem for selection operations.
  //
  // To solve this problem for whole word operations, we need to perform the following checks:
  //
  // We take the `indexInLine` and we call `document.getWordRangeAtPosition` to get the whole
  // word at that position. If this whole word matched the whole word we're searching for, then
  // our `indexInLine` is good. We can report it as is. However, if it doesn't match, that
  // means we have a situation such as `for` and `forward` as described previously. In that case,
  // we call `_findIndexInLine` recursively but this time with a new `startSearchAt` that does
  // not include the false positive word.
  if (!isSelectionSearch && indexInLine !== -1) {
    const detectedWordRange = document.getWordRangeAtPosition(new Position(line, indexInLine))
    const detectedWord = document.getText(detectedWordRange)

    if (detectedWord !== word && detectedWordRange !== undefined) {
      return _findIndexInLine(
        word,
        textLine,
        detectedWordRange[seekBack ? 'start' : 'end'].character,
        seekBack,
        isSelectionSearch,
        line,
        document
      )
    }
  }

  return indexInLine
}

function _createSelection(line: number, character: number, line2 = line, character2 = character) {
  return new Selection(new Position(line, character), new Position(line2, character2))
}