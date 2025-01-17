import { commands, env, window } from 'vscode'

export async function compareFileToClipboard(newValue: string) {
  const clipboard = await env.clipboard.readText()
  try {
    const editor = window.activeTextEditor
    if (editor) {
      env.clipboard.writeText(newValue)
      commands.executeCommand(
        'workbench.files.action.compareWithClipboard',
        editor.document.uri
      )
    }
  } catch (error) {
    window.showErrorMessage(error as string)
  }
  env.clipboard.writeText(clipboard)
}
