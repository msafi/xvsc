import * as vscode from 'vscode'
import {SimpleAutocomplete} from './simpleAutocomplete'

export const simpleAutocomplete = new SimpleAutocomplete()

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('simpleAutocomplete.next', simpleAutocomplete.next),
    vscode.window.onDidChangeTextEditorSelection(() => {
      simpleAutocomplete.reset()
    }),
  )
}
