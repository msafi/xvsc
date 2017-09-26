'use strict';
import { ExtensionContext, commands, window } from 'vscode';
import { openInSourceTree } from './openInSourceTree';
import { deleteToTextBeginning } from './deleteToTextBeginning';

export function activate(context: ExtensionContext) {
  const { registerCommand, registerTextEditorCommand } = commands;
  const storage = context.workspaceState;
  const isActiveEditor = window.activeTextEditor !== undefined;
  const hasSwitchedLayout = storage.get('hasSwitched');
  const handleLayoutSwitch = () => {
    if (!hasSwitchedLayout) {
      commands.executeCommand('workbench.action.toggleEditorGroupLayout');
      storage.update('hasSwitched', true);
    }
  };

  if (isActiveEditor) {
    handleLayoutSwitch();
  } else {
    const registration = window.onDidChangeActiveTextEditor(() => {
      handleLayoutSwitch();
      registration.dispose();
    });
  }

  context.subscriptions.push(
    registerTextEditorCommand('xvscm.openInSourceTree', openInSourceTree),
    registerTextEditorCommand('xvscm.deleteToTextBeginning', deleteToTextBeginning),
  );
}
