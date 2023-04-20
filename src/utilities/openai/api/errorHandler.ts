import { commands, window } from 'vscode'
import {
  ExtensionStatusBarItem,
  showMessageWithTimeout,
} from '@app/utilities/vscode'

export function errorHandler(error: any) {
  if (error.syscall === 'getaddrinfo' && error.errno === -3008) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'server-environment',
      '- unknown host'
    )
    // disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    return
  } else if (error.response !== undefined && error.response.status === 401) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'lock',
      '- failed authentication'
    )
    // disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    return
  } else if (error.response !== undefined && error.response.status === 404) {
    ExtensionStatusBarItem.instance.showStatusBarError('cloud', '- not found')
    showMessageWithTimeout(
      'Resource not found: check baseurl, api version or deployment name',
      7500
    )
    return
  } else if (error.response !== undefined && error.response.status === 429) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'exclude',
      '- rate limit'
    )
    showMessageWithTimeout(
      'Resource not found: check baseurl, api version or deployment name',
      7500
    )
    return
  }

  delete error.stack
  const reportError = JSON.stringify(error)
  window.showErrorMessage(
    `unexpected error: Please report the following details to github (remove any sensitive data). ${reportError}`
  )
}