import { ExtensionContext, window } from "vscode";
import { ConversationsWebviewProvider } from "./conversationsWebviewProvider";

export function conversationsWebviewViewProvider(context: ExtensionContext) {
  const sidebarProvider = new ConversationsWebviewProvider(
    context.extensionUri
  );
  const view = window.registerWebviewViewProvider(
    "syntax-by-ai.conversations.view.sidebar",
    sidebarProvider
  );
  context.subscriptions.push(view);
}
