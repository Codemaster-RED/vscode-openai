import { Command } from "../commandManager";
import { IConversation } from "@app/types";
import { ConversationStorageService } from "@app/services";

export default class OpenConversationWebviewCommand implements Command {
  public readonly id = "_syntax-by-ai.conversation.open.webview";

  public execute(args: { data: IConversation }) {
    ConversationStorageService.instance.show(args.data.conversationId);
  }
}
