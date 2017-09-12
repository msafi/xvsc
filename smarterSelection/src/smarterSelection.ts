import {TextEditor} from 'vscode'

export function expand(textEditor: TextEditor) {
  const {selection} = textEditor

  return 'ok'
}

export function contract(textEditor: TextEditor) {
  return 'ok'
}
