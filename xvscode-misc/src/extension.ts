'use strict';
import * as vscode from 'vscode';
import {openInSourceTree} from './openInSourceTree'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('xvscm.openInSourceTree', openInSourceTree)
  );
}