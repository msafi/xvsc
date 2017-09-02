import {
  window,
  Uri,
  Position,
  Selection,
  TextEditor,
  commands
} from 'vscode'
import * as assert from 'assert'
import {simpleAutocomplete} from '../../src/extension'
import * as path from 'path'

try {
  // Defines a Mocha test suite to group tests of similar kind together
  describe('Simple Autocomplete', () => {
    let textEditor: TextEditor

    describe('activation', () => {
      before(() => {
        return window.showTextDocument(
          Uri.file(path.join(__dirname, '..', '..', '..', 'test', 'fixtures', 'one.js'))
        ).then((_textEditor) => {
          textEditor = _textEditor
          textEditor.selection = new Selection(new Position(5, 35), new Position(5, 35))
          return
        })
      })

      it('remembers state', async() => {
        const initialState = simpleAutocomplete.state.higherLinePointer
        await commands.executeCommand('simpleAutocomplete.next')
        const stateAfterCommand = simpleAutocomplete.state.higherLinePointer

        assert(initialState !== stateAfterCommand)
      })

      it('resets state', async() => {
        await commands.executeCommand('simpleAutocomplete.next')
        const initialState = simpleAutocomplete.state.higherLinePointer

        simpleAutocomplete.reset()

        const stateAfterReset = simpleAutocomplete.state.higherLinePointer

        assert(initialState !== stateAfterReset)
      })

      it.only('sets the needle correctly', async() => {
        simpleAutocomplete.setNeedle()

        assert(simpleAutocomplete.state.needle === 'someva')
      })

      it.skip('remembers state between `activate` calls', async() => {
        try {
          await commands.executeCommand('simpleAutocomplete.next')

          // await commands.executeCommand('simpleAutocomplete.next')

          // await _delay(1000)
        } catch (e) {
          console.log(e.stacktrace || e)
        }
      })
    })
  })
} catch (e) {
  console.log(e.stacktrace || e)
}
