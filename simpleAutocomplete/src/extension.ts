'use strict'
import * as vscode from 'vscode'
import {SimpleAutocomplete} from './simpleAutocomplete'

export const simpleAutocomplete = new SimpleAutocomplete()

export function activate(context: vscode.ExtensionContext) {
  const obj = vscode.window.activeTextEditor

  if (obj) {
    // console.log(obj.document.languageId)
    const obj2 = vscode.languages.getLanguages().then((languages) => {
      console.log(languages)
    })
  }

  // const obj2 = vscode.languages.getLanguages

  // console.log(obj)

  // context.subscriptions.push(
  //   vscode.commands.registerTextEditorCommand('simpleAutocomplete.next', simpleAutocomplete.next),
  //   vscode.window.onDidChangeTextEditorSelection(() => {
  //     simpleAutocomplete.reset()
  //   })
  // );
}

export function deactivate() {
}
