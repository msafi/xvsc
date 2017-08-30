import {commands, ExtensionContext} from 'vscode';
import {next, previous, eventRegistrations} from './findWordAtCursor'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerTextEditorCommand('findWordAtCursor.next', next),
    commands.registerTextEditorCommand('findWordAtCursor.previous', previous),
  );
}

export function deactivate() {
  eventRegistrations.forEach((eventRegistration) => {
    eventRegistration.dispose()
  })
}