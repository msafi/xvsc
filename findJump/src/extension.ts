'use strict'
import {commands, ExtensionContext} from 'vscode'
import {FindJump} from './findJump'
import {subscriptions as inlineInputSubscriptions} from './inlineInput'

export function activate(context: ExtensionContext) {
  const findJump = new FindJump()

  context.subscriptions.push(
    commands.registerTextEditorCommand('findJump.find', findJump.find),
  )
}

export function deactivate() {
  const subscriptions = [...inlineInputSubscriptions]

  subscriptions.forEach(
    (subscription) => subscription.dispose(),
  )
}
