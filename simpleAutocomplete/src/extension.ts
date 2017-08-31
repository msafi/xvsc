'use strict';
import * as vscode from 'vscode';
import {SimpleAutocomplete} from './simpleAutocomplete'

const simpleAutocomplete = new SimpleAutocomplete()

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('simpleAutocomplete.next', simpleAutocomplete.next)
  );
}

export function deactivate() {
}