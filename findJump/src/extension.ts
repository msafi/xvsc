'use strict'
import {commands, ExtensionContext} from 'vscode'
import {FindJump} from './findJump'
import {subscriptions as inlineInputSubscriptions} from './inlineInput'

const findJump = new FindJump()

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerTextEditorCommand('findJump.activate', findJump.activate),
  )
}

export function deactivate() {
  const subscriptions = [...inlineInputSubscriptions]

  subscriptions.forEach(
    (subscription) => subscription.dispose(),
  )
}
