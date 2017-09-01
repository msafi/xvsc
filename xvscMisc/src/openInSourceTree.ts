import * as vscode from 'vscode';
import * as shelljs from 'shelljs'
import * as _ from 'lodash'

export const openInSourceTree = () => {
  const rootFolder = _.get(vscode, 'workspace.workspaceFolders.0.uri.fsPath')
  const sourceTreeCmd = 'open -a /Applications/SourceTree.app/Contents/MacOS/SourceTree'
  const isGitRepo = shelljs.test('-e', `${rootFolder}/.git`)
  
  if (rootFolder && isGitRepo) {
    vscode.window.withProgress(
      {location: vscode.ProgressLocation.Window},
      (progress) => {
        progress.report({message: 'Opening git repo in Source Tree'})
        return new Promise((resolve) => shelljs.exec(`${sourceTreeCmd} ${rootFolder}`, resolve))
      }
    )
  } else {
    vscode.window.showInformationMessage('Could not open git repo in Source Tree')
  }
}