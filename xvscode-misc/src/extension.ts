'use strict';
import * as vscode from 'vscode';
import {openInSourceTree} from './openInSourceTree'
import {deleteToTextBeginning} from './deleteToTextBeginning'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('xvscm.openInSourceTree', openInSourceTree),
    vscode.commands.registerCommand('xvscm.deleteToTextBeginning', deleteToTextBeginning)
  );
}