'use strict'
import * as vscode from 'vscode'
import {expand, contract} from './smarterSelection'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('smarterSelection.expand', expand),
    vscode.commands.registerTextEditorCommand('smarterSelection.contract', contract),
  )
}
