import { commands } from "vscode";
import { IConversation } from "@app/types";

export const onDidOpenConversationWebview = (
  conversation: IConversation
): void => {
  commands.executeCommand("_syntax-by-ai.conversation.open.webview", {
    data: conversation,
  });
};
