'use strict';
import {ExtensionContext, commands} from 'vscode';
import {openInSourceTree} from './openInSourceTree'
import {deleteToTextBeginning} from './deleteToTextBeginning'

export function activate(context: ExtensionContext) {
  const withContext = (fn: Function) => (...args) => fn(context, ...args)
  const {registerCommand, registerTextEditorCommand} = commands
  const storage = context.workspaceState
  const hasSwitchedLayout = storage.get('hasSwitched')

  if (!hasSwitchedLayout) {
    commands.executeCommand('workbench.action.toggleEditorGroupLayout')
    storage.update('hasSwitched', true)
  }
  
  context.subscriptions.push(
    registerTextEditorCommand('xvscm.openInSourceTree', withContext(openInSourceTree)),
    registerTextEditorCommand('xvscm.deleteToTextBeginning', withContext(deleteToTextBeginning)),
  )
}