import {
  window,
  TextLine,
  Position,
  Selection,
  TextEditorRevealType,
  OverviewRulerLane,
  ThemeColor,
  Range
} from 'vscode'

const decorationType = window.createTextEditorDecorationType({
  backgroundColor: new ThemeColor('editor.wordHighlightBackground')
});

export const eventRegistrations = []

export function next() {
  _scan()
}

export function previous() {
  _scan(true)
}

eventRegistrations.push(window.onDidChangeTextEditorSelection(() => {
  window.activeTextEditor.setDecorations(decorationType, [])
}))

function _scan(reverse = false) {
  const {activeTextEditor} = window
  const {document, selection} = activeTextEditor
  const {end, start} = selection
  const isMultiLine = end.line !== start.line

  if (isMultiLine) { return }

  const isMultiCharSelection = end.line !== start.line || end.character !== start.character
  const wordAtCaretRange = isMultiCharSelection
    ? new Range(start, end)
    : document.getWordRangeAtPosition(end, /\w+/g)

  if (wordAtCaretRange === undefined) { return }

  const wordAtCaret = document.getText(wordAtCaretRange)

  if (!wordAtCaret.length) { return }

  for(
    let i = end.line;
    reverse ? i >= 0 : i < document.lineCount - 1;
    reverse ? i-- : i++
  ) {
    const nextIndexInLine = _findIndexInLine(
      wordAtCaret,
      document.lineAt(i),
      (i === end.line) ? wordAtCaretRange[reverse ? 'start' : 'end'].character : 0,
      reverse,
      isMultiCharSelection,
      i,
      document
    )

    if (nextIndexInLine !== -1) {
      const wordSelection = isMultiCharSelection ?
        _createSelection(i, nextIndexInLine, i, nextIndexInLine + wordAtCaret.length) :
        _createSelection(i, nextIndexInLine)

      activeTextEditor.selection = wordSelection
      activeTextEditor.revealRange(wordSelection, TextEditorRevealType.InCenterIfOutsideViewport)

      if (!isMultiCharSelection) {
        setTimeout(() => {
          activeTextEditor.setDecorations(
            decorationType,
            [document.getWordRangeAtPosition(new Position(i, nextIndexInLine), /\w+/g)]
          )
        }, 10);
      }

      break
    }
  }
}

function _findIndexInLine(
  word: string,
  {text}: TextLine,
  startSearchAt = 0,
  reverse,
  isMultiCharSelection,
  line,
  document,
) {
  let indexInLine = reverse ?
    text.substr(0, startSearchAt || text.length).lastIndexOf(word) :
    text.substr(startSearchAt).indexOf(word)

  indexInLine = (indexInLine === -1)
    ? -1
    : indexInLine + (reverse ? 0 : startSearchAt)

  if (!isMultiCharSelection && indexInLine !== -1) {
    const detectedWordRange = document.getWordRangeAtPosition(new Position(line, indexInLine))
    const detectedWord = document.getText(detectedWordRange)

    indexInLine = detectedWord !== word ? -1 : indexInLine
  }

  return indexInLine
}

function _createSelection(line, character, line2 = line, character2 = character) {
  return new Selection(new Position(line, character), new Position(line2, character2))
}