import {window, TextLine, Position, Selection, TextEditorRevealType} from 'vscode'

export function next() {
  _scan()
}

export function previous() {
  _scan(true)
}

function _scan(reverse = false) {
  const {line, character} = window.activeTextEditor.selection.end
  const {activeTextEditor} = window
  const {document, selection} = activeTextEditor
  const wordAtCaretRange = document.getWordRangeAtPosition(selection.end, /\w+/g)
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
      const wordSelection = _createSelection(i, nextIndexInLine)

      activeTextEditor.selection = wordSelection

      activeTextEditor.revealRange(wordSelection, TextEditorRevealType.InCenterIfOutsideViewport)

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

function _createSelection(line, character) {
  return new Selection(new Position(line, character), new Position(line, character))
}