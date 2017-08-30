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

const decorationType = window.createTextEditorDecorationType({
  backgroundColor: new ThemeColor('editor.wordHighlightBackground')
});

export const eventRegistrations: Disposable[] = []

export function next() {
  _seek()
}

export function previous() {
  _seek(true)
}

eventRegistrations.push(window.onDidChangeTextEditorSelection(() => {
  if (window.activeTextEditor) {
    window.activeTextEditor.setDecorations(decorationType, [])
  }
}))

function _seek(seekBack = false) {
  const {activeTextEditor} = window

  // Spec #2
  if (!activeTextEditor) {
    return
  }

  const {document, selection} = activeTextEditor
  const {end, start} = selection
  const isMultiLine = end.line !== start.line

  // Spec #3
  if (isMultiLine) { return }

  const isMultiCharSelection = end.line !== start.line || end.character !== start.character

  // Spec #4
  const wordAtCursorRange = isMultiCharSelection
    ? new Range(start, end)
    : document.getWordRangeAtPosition(end, /\w+/g)

  // Spec #5
  if (wordAtCursorRange === undefined) { return }

  const wordAtCursor = document.getText(wordAtCursorRange)

  // Spec #6
  for(
    // Spec #7
    let i = end.line;

    // Spec #8
    seekBack ? i >= 0 : i < document.lineCount;
    seekBack ? i-- : i++
  ) {
    const nextIndexInLine = _findIndexInLine(
      wordAtCursor,
      document.lineAt(i),
      (i === end.line) ? wordAtCursorRange[seekBack ? 'start' : 'end'].character : 0,
      seekBack,
      isMultiCharSelection,
      i,
      document
    )

    if (nextIndexInLine !== -1) {
      const wordSelection = isMultiCharSelection ?
        _createSelection(i, nextIndexInLine, i, nextIndexInLine + wordAtCursor.length) :
        _createSelection(i, nextIndexInLine)

      activeTextEditor.selection = wordSelection
      activeTextEditor.revealRange(wordSelection, TextEditorRevealType.InCenterIfOutsideViewport)

      if (!isMultiCharSelection) {
        const range = document.getWordRangeAtPosition(new Position(i, nextIndexInLine), /\w+/g)

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
  startSearchAt = 0,
  seekBack: boolean,
  isMultiCharSelection: boolean,
  line: number,
  document: TextDocument,
): number {
  const {text} = textLine
  let indexInLine = seekBack ?
    text.substr(0, startSearchAt || text.length).lastIndexOf(word) :
    text.substr(startSearchAt).indexOf(word)

  indexInLine = (indexInLine === -1)
    ? -1
    : indexInLine + (seekBack ? 0 : startSearchAt)

  if (!isMultiCharSelection && indexInLine !== -1) {
    const detectedWordRange = document.getWordRangeAtPosition(new Position(line, indexInLine))
    const detectedWord = document.getText(detectedWordRange)

    if (detectedWord !== word && detectedWordRange !== undefined) {
      return _findIndexInLine(
        word,
        textLine,
        detectedWordRange[seekBack ? 'start' : 'end'].character,
        seekBack,
        isMultiCharSelection,
        line,
        document
      )
    }

    indexInLine = detectedWord !== word
      ? -1
      : indexInLine
  }

  return indexInLine
}

function _createSelection(line: number, character: number, line2 = line, character2 = character) {
  return new Selection(new Position(line, character), new Position(line2, character2))
}