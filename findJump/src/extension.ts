'use strict'
import * as vscode from 'vscode'
import {FindJump} from './findJump'

const findJump = new FindJump()

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('findJump.find', findJump.find),
  )
}

const uuuuuuuuuuusususususususus = 'asdf'