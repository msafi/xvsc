import {commands, ExtensionContext} from 'vscode';
import {next, previous} from './findWordAtCaret'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerTextEditorCommand('findWordAtCaret.next', next),
    commands.registerTextEditorCommand('findWordAtCaret.previous', previous),
  );
}