import * as vscode from 'vscode';
import * as shelljs from 'shelljs';
import * as _ from 'lodash';

const sourceTreeCmd = 'open -a /Applications/SourceTree.app/Contents/MacOS/SourceTree';

export const openInSourceTree = () => {
  try {
    const rootFolder = _.get(vscode, 'workspace.workspaceFolders.0.uri.fsPath') as string;

    if (!rootFolder) {
      throw new Error('Could not find root folder');
    }

    shelljs.cd(rootFolder);

    const gitRepoPath = shelljs.exec('git rev-parse --show-toplevel');

    vscode.window.withProgress({ location: vscode.ProgressLocation.Window }, progress => {
      progress.report({ message: 'Opening git repo in Source Tree' });
      return new Promise(resolve => shelljs.exec(`${sourceTreeCmd} ${gitRepoPath}`, resolve));
    });
  } catch (e) {
    vscode.window.showInformationMessage('Could not open git repo in Source Tree');
  }
};
