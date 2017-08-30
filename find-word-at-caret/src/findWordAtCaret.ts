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
  const {end, start} = window.activeTextEditor.selection
  const isMultiLine = end.line !== start.line

  if (isMultiLine) {
    return
  }

  const noSelection = end.line === start.line && end.character == start.character
  const {activeTextEditor} = window
  const {document, selection} = activeTextEditor
  const wordAtCaretRange = noSelection ?
    document.getWordRangeAtPosition(selection.end, /\w+/g) :
    new Range(start, end)
  const wordAtCaret = document.getText(wordAtCaretRange)
  
  for(
    let i = selection.end.line;
    reverse ? i > 0 : i < document.lineCount - 1; 
    reverse ? i-- : i++
  ) {
    const nextIndexInLine = _findIndexInLine(
      wordAtCaret,
      document.lineAt(i),
      (i === selection.end.line) ? wordAtCaretRange[reverse ? 'start' : 'end'].character : 0,
      reverse
    )

    if (nextIndexInLine !== -1) {
      const wordSelection = noSelection ? 
        _createSelection(i, nextIndexInLine) :
        _createSelection(i, nextIndexInLine, i, nextIndexInLine + wordAtCaret.length)

      activeTextEditor.selection = wordSelection
      activeTextEditor.revealRange(wordSelection, TextEditorRevealType.InCenterIfOutsideViewport)

      if (noSelection) {
        setTimeout(function() {
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

function _findIndexInLine(word: string, {text}: TextLine, startSearchAt = 0, reverse = false) {
  const indexInLine = reverse ?
    text.substr(0, startSearchAt || text.length).lastIndexOf(word) :
    text.substr(startSearchAt).indexOf(word)

  return (indexInLine === -1) ? 
    -1 : 
    indexInLine + (reverse ? 0 : startSearchAt)
}

function _createSelection(line, character, line2 = line, character2 = character) {
  return new Selection(new Position(line, character), new Position(line2, character2))
}