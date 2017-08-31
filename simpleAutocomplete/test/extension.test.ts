import {
  window,
  Uri,
  Position,
  Range,
  Selection,
  TextEditor,
  commands
} from 'vscode';
import * as assert from 'assert';
import * as myExtension from '../src/extension';
import * as path from 'path'

// Defines a Mocha test suite to group tests of similar kind together
describe("Simple Autocomplete", () => {
  let textEditor: TextEditor

  describe('activation', () => {
    before(() => {
      return window.showTextDocument(
        Uri.file(path.join(__dirname, '..', '..', 'test', 'fixtures', 'one.js'))
      ).then((_textEditor) => {
        textEditor = _textEditor
        return
      })
    })


    it("remembers state between `activate` calls", async () => {
      try {
        textEditor.selection = new Selection(new Position(5, 19), new Position(5, 19))
        await commands.executeCommand('simpleAutocomplete.next')
        // await commands.executeCommand('simpleAutocomplete.next')

        // await _delay(1000)
      } catch(e) {
        console.log(e.stacktrace || e)
      }
    });
  })
});

function _delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}