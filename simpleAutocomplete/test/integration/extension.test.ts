/* tslint:disable */
import {
  window,
  Uri,
  Position,
  Selection,
  TextEditor,
  commands,
} from 'vscode'
import * as assert from 'assert'
import * as path from 'path'

describe('Simple Autocomplete', () => {
  let textEditor: TextEditor

  before(() => {
    return window.showTextDocument(
      Uri.file(path.join(__dirname, '..', '..', '..', 'test', 'fixtures', 'one.js'))
    ).then((_textEditor) => {
      textEditor = _textEditor
      return
    })
  })

  beforeEach(() => {
    textEditor.selection = new Selection(new Position(7, 35), new Position(7, 35))
    return commands.executeCommand('workbench.action.files.revert')
  })

  it('it can cycle to the next word', async () => {
    const {document, selection} = textEditor

    const currentWord = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(currentWord === 'someva')

    await commands.executeCommand('simpleAutocomplete.next')

    const nextWord = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(nextWord === 'somevak')
  })

  it('does not cycle when the cursor is not at a word boundary', async () => {
    const { document, selection } = textEditor
    textEditor.selection = new Selection(new Position(7, 34), new Position(7, 34))

    const currentWord = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(currentWord === 'someva')

    await commands.executeCommand('simpleAutocomplete.next')

    const nextWord = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(nextWord === 'someva')
  })

  it('does not suggest the same result more than once', async () => {
    // await _delay(4000)
    const { document, selection } = textEditor

    const _1 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_1 === 'someva')

    await commands.executeCommand('simpleAutocomplete.next')
    const _2 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_2 === 'somevak')

    await commands.executeCommand('simpleAutocomplete.next')
    const _3 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_3 === 'someVariable')

    await commands.executeCommand('simpleAutocomplete.next')
    const _4 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_4 === 'someVariableFoo')
  })

  it('cycles back to the needle when results are exhausted', async () => {
    // await _delay(4000)
    const { document, selection } = textEditor

    const _1 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_1 === 'someva')

    await commands.executeCommand('simpleAutocomplete.next')
    await commands.executeCommand('simpleAutocomplete.next')
    await commands.executeCommand('simpleAutocomplete.next')
    await commands.executeCommand('simpleAutocomplete.next')

    const _2 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_2 === 'someva')
  })

  it.only('does not do anything if the user invokes the command while making a selection', async () => {
    // await _delay(4000)
    const { document, selection } = textEditor
    textEditor.selection = new Selection(new Position(7, 29), new Position(7, 35))

    const _1 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_1 === 'someva')

    await commands.executeCommand('simpleAutocomplete.next')
    const _2 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_2 === 'someva')

    textEditor.selection = new Selection(new Position(7, 35), new Position(7, 35))

    await commands.executeCommand('simpleAutocomplete.next')
    const _3 = document.getText(document.getWordRangeAtPosition(selection.end))
    assert(_3 === 'somevak')
  })
})

/*tslint:disable-next-line*/
// function _delay(t: number) {
//   return new Promise(resolve => setTimeout(resolve, t))
// }
