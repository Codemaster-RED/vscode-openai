import { Command } from "../commandManager";
import { ConversationStorageService } from "@app/services";

export default class RefreshConversationsCommand implements Command {
  public readonly id = "_syntax-by-ai.conversations.refresh";

  public async execute() {
    ConversationStorageService.instance.refresh();
  }
}
